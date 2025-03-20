from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import delete, insert, select, update, and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import Optional
from random import randint
from app.security import get_current_user

from app.api.v1.core.models import (
    Users,
    Recipes,
    UserRecipes,
    Images,
    Comments,
    Messages,
    Reviews,
    SavedRecipes
)

from app.api.v1.core.schemas import (
    SearchRecipeSchema,
    RandomRecipeSchema,
    SavedRecipeSchema,
    UserSchema
)


def get_recipe_db(recipe: SearchRecipeSchema, page: int = 0, page_size: int = 20, db=None):
    search_term = recipe.query

    # Create base query
    query_stmt = select(Recipes)

    # Create an empty list to collect filter conditions
    conditions = []

    # Add conditions dynamically if parameters are provided
    if search_term:
        conditions.append(Recipes.name.ilike(f"%{search_term}%"))

    if recipe.carbohydrates is not None:
        conditions.append(Recipes.carbohydrates <= recipe.carbohydrates)

    if recipe.calories is not None:
        conditions.append(Recipes.calories <= recipe.calories)

    if recipe.protein is not None:
        conditions.append(Recipes.protein >= recipe.protein)
        
    # Handle ingredients filter
    if recipe.ingredients:
        ingredients_list = recipe.ingredients.split(',')
        for ingredient in ingredients_list:
            conditions.append(Recipes.ingredients.ilike(f"%{ingredient.strip()}%"))

    # Add specific recipe type handling (keep this if needed)
    if hasattr(recipe, 'recipe_type') and recipe.recipe_type:
        # Your existing recipe_type logic here
        pass

    # Apply conditions to the query if any exist
    if conditions:
        query_stmt = query_stmt.where(and_(*conditions))

    # Add pagination
    query_stmt = query_stmt.offset(page * page_size).limit(page_size)

    # Execute the query
    results = db.scalars(query_stmt).all()

    return results


def get_random_recipe_db(recipe: RandomRecipeSchema, db):

    query_stmt = select(Recipes)

    conditions = []

    if recipe.recipe_type:
        rt = recipe.recipe_type.lower()
        if rt in ["fågel", "poultry"]:
            conditions.append(
                or_(
                    Recipes.ingredients.ilike("%kyckling%"),
                    Recipes.ingredients.ilike("%anka%"),
                    Recipes.ingredients.ilike("%kalkon%"),
                )
            )
        elif rt in ["fisk", "fish"]:
            conditions.append(
                or_(
                    Recipes.ingredients.ilike("%fisk%"),
                    Recipes.ingredients.ilike("%skaldjur%"),
                    Recipes.ingredients.ilike("%tonfisk%"),
                    Recipes.ingredients.ilike("%lax%"),
                    Recipes.ingredients.ilike("%bläckfisk%"),
                    Recipes.ingredients.ilike("%räkor%"),
                    Recipes.ingredients.ilike("%krabba%"),
                    Recipes.ingredients.ilike("%hummer%"),
                )
            )
        elif rt in ["kött", "meat"]:
            conditions.append(
                or_(
                    Recipes.ingredients.ilike("%nötkött%"),
                    Recipes.ingredients.ilike("%fläsk%"),
                    Recipes.ingredients.ilike("%bacon%"),
                    Recipes.ingredients.ilike("%kött%"),
                    Recipes.ingredients.ilike("%lamm%"),
                )
            )
        elif rt in ["vegetarisk", "vegetarian"]:
            conditions.append(~(
                Recipes.ingredients.ilike("%kyckling%") |
                Recipes.ingredients.ilike("%kalkon%") |
                Recipes.ingredients.ilike("%anka%") |
                Recipes.ingredients.ilike("%nötkött%") |
                Recipes.ingredients.ilike("%fläsk%") |
                Recipes.ingredients.ilike("%lamm%") |
                Recipes.ingredients.ilike("%bacon%") |
                Recipes.ingredients.ilike("%kött%") |
                Recipes.ingredients.ilike("%fisk%") |
                Recipes.ingredients.ilike("%skaldjur%") |
                Recipes.ingredients.ilike("%tonfisk%") |
                Recipes.ingredients.ilike("%lax%") |
                Recipes.ingredients.ilike("%bläckfisk%") |
                Recipes.ingredients.ilike("%räkor%") |
                Recipes.ingredients.ilike("%krabba%") |
                Recipes.ingredients.ilike("%hummer%")
            ))

        if conditions:

            list_recipes = []
            count = 0
            
            query_stmt = query_stmt.where(and_(*conditions))

            results = db.scalars(query_stmt).all()

            while count <= 10:  
            
                list_recipes.append(results[randint(0, len(results) - 1)])
                count += 1

            if not list_recipes:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No recipes found"
                )
            return list_recipes

    if conditions == []:

        list_recipes = []
        count = 0

        id_query = select(Recipes.id)
        all_ids = db.scalars(id_query).all()

        while count <= 10:
            random_id = all_ids[randint(0, len(all_ids) - 1)]

            result = db.scalars(query_stmt.where(
                Recipes.id == random_id)).first()
            list_recipes.append(result)
            count += 1
        

        if not list_recipes:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No recipes found"
            )
        return list_recipes


def get_one_recipe_db(id: int, db):
    query_stmt = select(Recipes).where(Recipes.id == id)
    result = db.scalars(query_stmt).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    return result

def save_recipe_db(recipe: SavedRecipeSchema, db):

    saved_recipe = SavedRecipes(**recipe.model_dump())
    db.add(saved_recipe)
    db.commit()
    return saved_recipe

def get_saved_recipes_db(user: UserSchema, db):

    
    stmt = (
        select(Recipes)
        .join(SavedRecipes, Recipes.id == SavedRecipes.recipe_id)
        .where(SavedRecipes.user_id == user.id)
    )

    saved_recipes = db.scalars(stmt).all()

    return saved_recipes


from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import delete, insert, select, update, and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import Optional
from random import randint

from app.api.v1.core.models import (
    Users,
    Recipes,
    UserRecipes,
    Images,
    Comments,
    Messages,
    Reviews
)

from app.api.v1.core.schemas import (
    SearchRecipeSchema,
    RandomRecipeSchema
)


def get_recipe_db(recipe: SearchRecipeSchema, db):
    search_term = f"%{recipe.query}%"

    # Skapa grundfrågan
    query_stmt = select(Recipes)

    # Create an empty list to collect filter conditions
    conditions = []

    # Add conditions dynamically if parameters are provided
    if search_term is not None:
        conditions.append(Recipes.name.ilike(f"%{search_term}%"))

    if recipe.carbohydrates is not None:
        conditions.append(Recipes.carbohydrates <= recipe.carbohydrates)

    if recipe.calories is not None:
        conditions.append(Recipes.calories <= recipe.calories)

    if recipe.protein is not None:
        conditions.append(Recipes.protein >= recipe.protein)

    # Additional filter for recipe type based on ingredients
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
            # If the ingredients do NOT contain any meat-related keywords, then it's vegetarian.
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


    # Apply conditions to the query if any exist
    if conditions:
        query_stmt = query_stmt.where(and_(*conditions))

    # Add limit to the query
    query_stmt = query_stmt.limit(10)

    # Execute the query
    results = db.scalars(query_stmt).all()

    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No recipes found"
        )
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
            query_stmt = query_stmt.where(and_(*conditions))

            results = db.scalars(query_stmt).all()

            result = results[randint(0, len(results) - 1)]

            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No recipes found"
                )
            return result

    if conditions == []:

        id_query = select(Recipes.id)
        all_ids = db.scalars(id_query).all()

        random_id = all_ids[randint(0, len(all_ids) - 1)]

        result = db.scalars(query_stmt.where(
            Recipes.id == random_id)).first()

        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No recipes found"
            )
        return result


def get_one_recipe_db(id: int, db):
    query_stmt = select(Recipes).where(Recipes.id == id)
    result = db.scalars(query_stmt).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    return result

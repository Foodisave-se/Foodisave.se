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

    if recipe.calories is not None:
        conditions.append(Recipes.calories <= recipe.calories)

    if recipe.protein_content is not None:
        conditions.append(Recipes.protein_content >= recipe.protein_content)

    # Additional filter for recipe type based on ingredients
    if recipe.recipe_type:
        rt = recipe.recipe_type.lower()
        if rt in ["fågel", "poultry"]:
            conditions.append(
                or_(
                    Recipes.ingredients.ilike("%chicken%"),
                    Recipes.ingredients.ilike("%duck%"),
                    Recipes.ingredients.ilike("%turkey%"),
                )
            )
        elif rt in ["fisk", "fish"]:
            conditions.append(
                or_(
                    Recipes.ingredients.ilike("%fish%"),
                    Recipes.ingredients.ilike("%seafood%"),
                    Recipes.ingredients.ilike("%tuna%"),
                    Recipes.ingredients.ilike("%salmon%"),
                    Recipes.ingredients.ilike("%octopus%"),
                    Recipes.ingredients.ilike("%shrimp%"),
                    Recipes.ingredients.ilike("%crab%"),
                    Recipes.ingredients.ilike("%lobster%"),
                )
            )
        elif rt in ["kött", "meat"]:
            conditions.append(
                or_(
                    Recipes.ingredients.ilike("%beef%"),
                    Recipes.ingredients.ilike("%pork%"),
                    Recipes.ingredients.ilike("%bacon%"),
                    Recipes.ingredients.ilike("%meat%"),
                    Recipes.ingredients.ilike("%lamb%"),

                )
            )
        elif rt in ["vegetarisk", "vegetarian"]:
            # If the ingredients do NOT contain any meat-related keywords, then it's vegetarian.
            conditions.append(~(
                Recipes.ingredients.ilike("%chicken%") |
                Recipes.ingredients.ilike("%turkey%") |
                Recipes.ingredients.ilike("%duck%") |
                Recipes.ingredients.ilike("%beef%") |
                Recipes.ingredients.ilike("%pork%") |
                Recipes.ingredients.ilike("%lamb%") |
                Recipes.ingredients.ilike("%bacon%") |
                Recipes.ingredients.ilike("%meat%") |
                Recipes.ingredients.ilike("%fish%") |
                Recipes.ingredients.ilike("%seafood%") |
                Recipes.ingredients.ilike("%tuna%") |
                Recipes.ingredients.ilike("%salmon%") |
                Recipes.ingredients.ilike("%octopus%") |
                Recipes.ingredients.ilike("%shrimp%") |
                Recipes.ingredients.ilike("%crab%") |
                Recipes.ingredients.ilike("%lobster%")
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
                    Recipes.ingredients.ilike("%chicken%"),
                    Recipes.ingredients.ilike("%duck%"),
                    Recipes.ingredients.ilike("%turkey%"),
                )
            )
        elif rt in ["fisk", "fish"]:
            conditions.append(
                or_(
                    Recipes.ingredients.ilike("%fish%"),
                    Recipes.ingredients.ilike("%seafood%"),
                    Recipes.ingredients.ilike("%tuna%"),
                    Recipes.ingredients.ilike("%salmon%"),
                    Recipes.ingredients.ilike("%octopus%"),
                    Recipes.ingredients.ilike("%shrimp%"),
                    Recipes.ingredients.ilike("%crab%"),
                    Recipes.ingredients.ilike("%lobster%"),
                )
            )
        elif rt in ["kött", "meat"]:
            conditions.append(
                or_(
                    Recipes.ingredients.ilike("%beef%"),
                    Recipes.ingredients.ilike("%pork%"),
                    Recipes.ingredients.ilike("%bacon%"),
                    Recipes.ingredients.ilike("%meat%"),
                    Recipes.ingredients.ilike("%lamb%"),

                )
            )
        elif rt in ["vegetarisk", "vegetarian"]:
            # If the ingredients do NOT contain any meat-related keywords, then it's vegetarian.
            conditions.append(~(
                Recipes.ingredients.ilike("%chicken%") |
                Recipes.ingredients.ilike("%turkey%") |
                Recipes.ingredients.ilike("%duck%") |
                Recipes.ingredients.ilike("%beef%") |
                Recipes.ingredients.ilike("%pork%") |
                Recipes.ingredients.ilike("%lamb%") |
                Recipes.ingredients.ilike("%bacon%") |
                Recipes.ingredients.ilike("%meat%") |
                Recipes.ingredients.ilike("%fish%") |
                Recipes.ingredients.ilike("%seafood%") |
                Recipes.ingredients.ilike("%tuna%") |
                Recipes.ingredients.ilike("%salmon%") |
                Recipes.ingredients.ilike("%octopus%") |
                Recipes.ingredients.ilike("%shrimp%") |
                Recipes.ingredients.ilike("%crab%") |
                Recipes.ingredients.ilike("%lobster%")
            ))

        if conditions:
            query_stmt = query_stmt.where(and_(*conditions))

            results = db.scalars(query_stmt).all()

            result = results[randint(1, len(results))]

            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No recipes found"
                )
            return result

        if conditions == []:
            result = db.scalars(query_stmt.where(
                Recipes.id == randint(1, 500000))).first()

            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No recipes found"
                )
            return result

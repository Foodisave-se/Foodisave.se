from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import delete, insert, select, update, and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import Optional, Annotated
from random import randint
from app.api.v1.core.recipe_endpoints.user_recipe_db import (
    create_user_recipe_db,
    get_user_recipes_db,
    delete_user_recipe_db,
    update_user_recipe_db,
)

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
    RandomRecipeSchema,
    UserRecipeSchema,
    UserUpdateRecipeSchema
)

from app.db_setup import get_db

router = APIRouter()


@router.post("/user/recipe", response_model=UserRecipeSchema, status_code=200)
def create_user_recipe(user_recipe: UserRecipeSchema, db: Session = Depends(get_db)):
    
    result = create_user_recipe_db(user_recipe, db)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="couldnt add recipe to database"
        )
    return result

@router.get("/user/recipe/{user_id}", status_code=200)
def get_user_recipes(user_id: int, db: Session = Depends(get_db)):

    result = get_user_recipes_db(user_id, db)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="no recipes found"
        )
    return result

@router.delete("/user/recipe/delete/{user_recipe_id}", status_code=200)
def delete_user_recipe(user_recipe_id: int, db: Session = Depends(get_db)):
    
    result = delete_user_recipe_db(user_recipe_id, db)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="couldnt delete recipe"
        )
    return result

@router.patch("/user/recipe/update/{user_recipe_id}", response_model=UserUpdateRecipeSchema)
def update_user_recipe(
    user_recipe_id: int,
    user_update_recipe: UserUpdateRecipeSchema,
    db: Session = Depends(get_db),
):
    db_user_recipe = update_user_recipe_db(user_update_recipe, user_recipe_id, db)

    return db_user_recipe


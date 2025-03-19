from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import delete, insert, select, update, and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import Optional, Annotated
from random import randint
import logging


from app.security import get_current_user
from app.api.v1.core.recipe_endpoints.recipe_db import (
    get_recipe_db,
    get_random_recipe_db,
    get_one_recipe_db,
    save_recipe_db,
    get_saved_recipes_db
)

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
    SavedRecipesResponse
)

from app.db_setup import get_db

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/search/recipe", status_code=200)
def search_recipe(recipe_type: SearchRecipeSchema = Depends(),
                  db: Session = Depends(get_db)):
    
    result = get_recipe_db(recipe=recipe_type, db=db)
    

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No recipes found"
        )
    return result


@router.get("/random/recipe", status_code=200)
def get_random_recipe(
        recipe_type: RandomRecipeSchema = Depends(),
        db: Session = Depends(get_db)):

    result = get_random_recipe_db(recipe=recipe_type, db=db)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No recipes found"
        )
    return result

@router.get("/recipe/{recipe_id}", status_code=200)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = get_one_recipe_db(recipe_id, db)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    return recipe

@router.post("/recipe/saved", status_code=204)
def save_recipe(recipe: SavedRecipeSchema, db: Session = Depends(get_db)):
    recipe = save_recipe_db(recipe, db)

    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="couldnt save recipe"
        )
    return recipe

@router.get("/saved/recipe", status_code=200)
def get_saved_recipes(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    stmt = (
        select(Recipes)
        .join(SavedRecipes, Recipes.id == SavedRecipes.recipe_id)
        .where(SavedRecipes.user_id == current_user.id)
    )

    saved_recipes = db.scalars(stmt).all()
    

    if not saved_recipes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="couldnt find saved recipe"
        )
    return saved_recipes

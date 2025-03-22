from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status, Query
from sqlalchemy import delete, insert, select, update, and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import Optional, Annotated
from random import randint


from app.security import get_current_user
from app.api.v1.core.recipe_endpoints.recipe_db import (
    get_recipe_db,
    get_random_recipe_db,
    get_one_recipe_db,
    save_recipe_db
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

@router.get("/search/recipe", status_code=200)
def search_recipe(
    query: str = Query(..., description="Search term for recipes"),
    carbohydrates: int = Query(None, description="Maximum carbohydrates"),
    calories: int = Query(None, description="Maximum calories"),
    protein: int = Query(None, description="Minimum protein"),
    ingredients: str = Query(None, description="Ingredients to filter by"),
    page: int = Query(0, ge=0, description="Page number, starting from 0"),
    page_size: int = Query(20, ge=1, le=100, description="Number of recipes per page"),
    db: Session = Depends(get_db)
):
    # Create a SearchRecipeSchema instance with the parameters
    recipe_params = SearchRecipeSchema(
        query=query,
        carbohydrates=carbohydrates,
        calories=calories,
        protein=protein,
        ingredients=ingredients,
        page=page,
        page_size=page_size
    )
    
    result = get_recipe_db(recipe=recipe_params, page=page, page_size=page_size, db=db)
    
    if not result and page == 0:
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

from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import delete, insert, select, update, and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import Optional, Annotated
from random import randint
from app.api.v1.core.recipe_endpoints.recipe_db import (
    get_recipe_db,
    get_random_recipe_db
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
    RandomRecipeSchema
)

from app.db_setup import get_db

router = APIRouter()


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


# randomize recipes endpoints
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


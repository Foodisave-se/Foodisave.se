from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import delete, insert, select, update, and_, or_, exists
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import Optional, Annotated
from random import randint
from app.security import get_current_user

from app.api.v1.core.recipe_endpoints.user_recipe_db import (
    create_user_recipe_db,
    get_user_recipes_db,
    delete_user_recipe_db,
    update_user_recipe_db,
    create_ai_recipe_db,
    save_user_recipe_db
)

from app.api.v1.core.models import (
    Users,
    Recipes,
    UserRecipes,
    Images,
    Comments,
    Messages,
    Reviews,
    SavedUserRecipes
)

from app.api.v1.core.schemas import (
    SearchRecipeSchema,
    RandomRecipeSchema,
    UserRecipeSchema,
    UserUpdateRecipeSchema,
    AiRecipeSchema,
    SavedUserRecipeSchema,
    AiRecipeOutSchema
)

from app.db_setup import get_db

router = APIRouter()


@router.post("/user/recipe", response_model=UserRecipeSchema, status_code=200)
def create_user_recipe(user_recipe: UserRecipeSchema, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    
    result = create_user_recipe_db(user_recipe, db, current_user)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="couldnt add recipe to database"
        )
    return result

@router.post("/user-recipe/saved", status_code=204)
def save_recipe(user_recipe: SavedUserRecipeSchema, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    
    user_recipe = save_user_recipe_db(user_recipe, db, current_user)
    
    if not user_recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="couldnt save recipe"
        )

    return user_recipe

@router.get("/saved/user-recipe", status_code=200)
def get_saved_user_recipes(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    stmt = (
        select(UserRecipes)
        .join(SavedUserRecipes, UserRecipes.id == SavedUserRecipes.user_recipe_id)
        .where(SavedUserRecipes.user_id == current_user.id)
    )

    saved_user_recipes = db.scalars(stmt).all()
    

    if not saved_user_recipes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="couldnt find saved recipe"
        )
    return saved_user_recipes

@router.delete("/user-recipe/saved", status_code=200)
def delete_saved_recipe(recipe_id: SavedUserRecipeSchema, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = (
        delete(SavedUserRecipes)
        .where(SavedUserRecipes.user_recipe_id == recipe_id.user_recipe_id)
        .where(SavedUserRecipes.user_id == current_user.id)
    )
    db.execute(stmt)
    db.commit()
    return {"message": "Recipe deleted successfully"}


@router.post("/user-recipe/saved/check", status_code=200)
def check_recipe_saved(
    recipe: SavedUserRecipeSchema, 
    current_user: Users = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # Create a query to check if the recipe is saved by this user
    stmt = (
        select(exists().where(
            (SavedUserRecipes.user_recipe_id == recipe.user_recipe_id) & 
            (SavedUserRecipes.user_id == current_user.id)
        ))
    )
    
    # Execute the query
    result = db.execute(stmt).scalar()
    
    # Return a dictionary with the result
    return {"isSaved": result}

@router.post("/ai/recipe", response_model=AiRecipeOutSchema, status_code=200)
def create_ai_recipe(ai_recipe: AiRecipeSchema, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    
    result = create_ai_recipe_db(ai_recipe, db, current_user)

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


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
    RandomRecipeSchema,
    UserRecipeSchema,
    UserUpdateRecipeSchema
)



def create_user_recipe_db(user_recipe: UserRecipeSchema, db):

    recipe = UserRecipes(**user_recipe.model_dump())
    db.add(recipe)
    db.commit()
    return recipe



def get_user_recipes_db(user_id: int, db):
    
    query_stmt = select(UserRecipes).where(UserRecipes.user_id == user_id)
    result = db.scalars(query_stmt).all()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    return result



def delete_user_recipe_db(user_recipe_id: int, db):

    user_recipe = db.scalar(select(UserRecipes).where(UserRecipes.id == user_recipe_id))
    if not user_recipe:
        return False

    # Utför delete-operationen
    db.execute(delete(UserRecipes).where(UserRecipes.id == user_recipe_id))
    db.commit()
    return True

def update_user_recipe_db(user_update_recipe: UserUpdateRecipeSchema, user_recipe_id: int, db):
    
    db_user_recipe = db.scalars(select(UserRecipes).where(UserRecipes.id == user_recipe_id)).first()

    # Update user fields from provided data
    for key, value in user_update_recipe.model_dump(exclude_unset=True).items():
        setattr(db_user_recipe, key, value)

    db.commit()
    return db_user_recipe

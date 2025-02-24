from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import delete, insert, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload

from app.api.v1.core.models import (
    Users,
    Recipes,
    UserRecipes,
    Images,
    Comments,
    Messages,
    Reviews
)

# from app.api.v1.core.schemas import (
#     CompanySchema,
#     CompanyTypeSchema,
#     CourseSchema,
#     UserSchema,
# )

from app.db_setup import get_db

router = APIRouter()


@router.get("/search/recipe", status_code=200)
def get_recipe(query: str, db: Session = Depends(get_db)):
    search_term = f"%{query}%"

    recipes = db.scalars(select(Recipes).where(
        Recipes.name.ilike(search_term))).first()

    if not recipes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No recipes found"
        )

    # Convert SQLAlchemy model instances to dictionaries
    # and explicitly handle numeric value

    return recipes

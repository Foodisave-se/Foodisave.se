from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import delete, insert, select, update, and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import Optional, Annotated

from app.api.v1.core.user_endpoints.user_db import (
    create_user_db,
    get_user_db,
    delete_user_db,
    update_user_db
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
    UserSchema,
    UserSearchSchema,
    UserUpdateSchema,
    UserOutSchema,
    UserRegisterSchema
)

from app.security import (
    get_current_user,
    get_current_admin,
    get_current_superuser
)

from app.db_setup import get_db

router = APIRouter()


@router.post("/user", status_code=200)
def create_user(user: UserRegisterSchema, db: Session = Depends(get_db)):
    result = create_user_db(user=user, db=db)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User couldnt be created"
        )
    return result

@router.get("/me", response_model=UserOutSchema)
def read_users_me(current_user: Users = Depends(get_current_user)):
    return current_user



@router.get("/user", status_code=200)
def search_user(search: Annotated[UserSearchSchema, Depends(UserSearchSchema)],
                db: Session = Depends(get_db)):
    result = get_user_db(search=search, db=db)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No users found"
        )
    return result


@router.delete("/user/{user_id}", status_code=200)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    result = delete_user_db(user_id=user_id, db=db)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or could not be deleted"
        )
    return {"message": "User deleted successfully"}


@router.put("/user/{user_id}", status_code=200)
def update_user(
    user_id: int,
    user_update: Annotated[UserUpdateSchema, Depends(UserUpdateSchema)],
    db: Session = Depends(get_db)
):
    result = update_user_db(user_id=user_id, user=user_update, db=db)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or could not be updated"
        )
    return result

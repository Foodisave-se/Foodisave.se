from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import delete, insert, select, update, and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import Optional
from random import randint
import bcrypt
from app.security import hash_password

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
    UserRegisterSchema,
    UserUpdateSchema
)

def create_user_db(user: UserRegisterSchema, db):

    user = Users(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        hashed_password=hash_password(user.password),
        is_superuser=False,
        is_admin=False,
        is_customer=True,
        credits=100,
        level=1
    )

    db.add(user)
    db.commit()
    return user


def get_user_db(db):
    users = db.scalars(select(Users)).all()
    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No users found"
        )

    return users


def delete_user_db(user_id: int, db):
    # Kontrollera om användaren finns
    user = db.scalar(select(Users).where(Users.id == user_id))
    if not user:
        return False

    # Utför delete-operationen
    db.execute(delete(Users).where(Users.id == user_id))
    db.commit()
    return True


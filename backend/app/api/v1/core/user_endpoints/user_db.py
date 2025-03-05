from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import delete, insert, select, update, and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import Optional
from random import randint
import bcrypt
# from app.security import hash_password

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
    UserSearchSchema
)



def create_user_db(user: UserSchema, db):

    user = Users(
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        # password=hash_password(user.password),
        level=user.level
    )

    db.add(user)
    db.commit()
    return user


def get_user_db(search: UserSearchSchema, db):
    users = db.scalars(select(Users).where(
        Users.username.ilike(f"%{search.username}%"))).all()
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


def update_user_db(user_id: int, user: UserSchema, db):

    update_user = db.scalar(select(Users).where(Users.id == user_id))
    if not update_user:
        return False

    if user.username is not None:
        update_user.username = user.username
    if user.first_name is not None:
        update_user.first_name = user.first_name
    if user.last_name is not None:
        update_user.last_name = user.last_name
    if user.email is not None:
        update_user.email = user.email
    if user.password is not None:
        update_user.password = hash_password(user.password)

    db.commit()
    db.refresh(update_user)
    return user

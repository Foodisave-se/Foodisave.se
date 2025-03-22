# ./backend/app/api/v1/core/user_endpoints/users.py

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import Annotated

from app.api.v1.core.user_endpoints.user_db import (
    create_user_db,
    get_user_db,
    delete_user_db
)
from app.api.v1.core.models import Users, Recipes, UserRecipes, Images, Comments, Messages, Reviews
from app.api.v1.core.schemas import (
    UserSchema,
    UserSearchSchema,
    UserUpdateSchema,
    UserOutSchema,
    UserRegisterSchema,
    PasswordChangeSchema,
)
# Importera e-postfunktionerna
from app.email import generate_activation_token, send_activation_email
from app.security import (
    hash_password,
    verify_password,
    get_current_user,
    get_current_admin,
    get_current_superuser,
)
from app.db_setup import get_db

router = APIRouter()

@router.post("/user", status_code=201)
def create_user(
    user: UserRegisterSchema,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Skapa användaren i databasen (is_active blir False som standard)
    new_user = create_user_db(user=user, db=db)
    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User couldn't be created"
        )
    # Generera aktiveringstoken
    token = generate_activation_token(user_id=new_user.id, db=db)
    # Skicka aktiveringsmejl asynkront
    background_tasks.add_task(send_activation_email, new_user.email, token)
    
    return {
        "message": "User created successfully. Please check your email to activate your account."
    }

@router.get("/me", response_model=UserOutSchema)
def read_users_me(current_user: Users = Depends(get_current_user)):
    return current_user

@router.get("/user", status_code=200)
def search_user(db: Session = Depends(get_db)):
    result = get_user_db(db)
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

@router.get("/profile", response_model=UserUpdateSchema)
def get_user_profile(current_user: Users = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserUpdateSchema)
def update_user_profile(
    user_update: UserUpdateSchema,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_user = db.scalars(select(Users).where(Users.id == current_user.id)).first()
    for key, value in user_update.model_dump(exclude_unset=True).items():
        if value != "":
            setattr(db_user, key, value)
    db.commit()
    return db_user

@router.put("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    password_data: PasswordChangeSchema,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not password_data.current_password or not password_data.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both current and new passwords are required",
        )
    if len(password_data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters long",
        )
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    if verify_password(password_data.new_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the current password",
        )
    try:
        db_user = db.scalars(select(Users).where(Users.id == current_user.id)).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        db_user.hashed_password = hash_password(password_data.new_password)
        db.commit()
        return {
            "message": "Password updated successfully",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update password: {str(e)}",
        )

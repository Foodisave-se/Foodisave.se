from datetime import datetime, timezone

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
    UserRegisterSchema,
    PasswordChangeSchema,
)

from app.security import (
    get_current_user,
    get_current_admin,
    get_current_superuser,
    hash_password,
    verify_password,
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

@router.get("/profile", response_model=UserUpdateSchema)
def get_user_profile(current_user: Users = Depends(get_current_user)):
    """
    Get current user's profile information
    """
    return current_user


@router.put("/profile", response_model=UserUpdateSchema)
def update_user_profile(
    user_update: UserUpdateSchema,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update current user's profile information
    """
    # Get the user from the database
    db_user = db.scalars(select(Users).where(Users.id == current_user.id)).first()

    # Update user fields from provided data
    for key, value in user_update.model_dump(exclude_unset=True).items():
        setattr(db_user, key, value)

    db.commit()
    return db_user

@router.put("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    password_data: PasswordChangeSchema,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update user's password

    Requires the current password for verification and a new password to set.
    Validates password strength and ensures the new password is different from the current one.
    """
    # Validate input
    if not password_data.current_password or not password_data.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both current and new passwords are required",
        )

    # Check if new password meets complexity requirements (example validation)
    if len(password_data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters long",
        )

    # Verify current password
    if not verify_password(
        password_data.current_password, current_user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    # Check if new password is the same as current password
    if verify_password(password_data.new_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the current password",
        )

    try:
        # Get fresh user object from database
        db_user = db.scalars(select(Users).where(Users.id == current_user.id)).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        # Update password
        db_user.hashed_password = hash_password(password_data.new_password)

        # Add last_password_change timestamp if you have such a field
        # db_user.last_password_change = datetime.now(UTC)

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

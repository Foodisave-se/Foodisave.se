from datetime import datetime
from enum import Enum
from typing import List
from fastapi import Query

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class SearchRecipeSchema(BaseModel):
    query: str
    carbohydrates: int | None = None
    calories: int | None = None
    protein: int | None = None
    ingredients: str | None = None  # Add ingredients parameter
    page: int = Query(0, ge=0)  # Change default to 0 to match frontend
    page_size: int = Query(20, ge=1, le=100)

class SavedRecipeSchema(BaseModel):
    recipe_id: int

class SavedUserRecipeSchema(BaseModel):
    user_recipe_id: int

class UploadImageSchema(BaseModel):
    user_recipe_id: int

class RandomRecipeSchema(BaseModel):
    recipe_type: str | None = None


class UserSearchSchema(BaseModel):
    username: str

class UserUpdateSchema(BaseModel):
    first_name: str | None = None
    last_name: str | None = None

class AdminUpdateSchema(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr | None = None
    credits: int | None = None
    is_admin: bool | None = None

class UserRegisterSchema(BaseModel):
    email: str
    last_name: str
    first_name: str
    password: str
    is_active: bool = False
    is_admin: bool = False
    credits: int = 2
    last_login_credit: datetime | None = None
    last_credit_refill: datetime| None = None
    last_recipe_saved_credit: datetime | None = None
    credits: int = 99
    level:int = 1
    model_config = ConfigDict(from_attributes=True)
    

class TokenSchema(BaseModel):
    access_token: str
    token_type: str

class PasswordResetRequestSchema(BaseModel):
    email: EmailStr = Field(..., description="Email address for password reset")
    model_config = ConfigDict(json_schema_extra={"example": {"email": "user@example.com"}})


class PasswordResetConfirmSchema(BaseModel):
    token: str = Field(..., description="Password reset token received via email")
    new_password: str = Field(..., min_length=8, description="New password")
    model_config = ConfigDict(json_schema_extra={"example": {"token": "randomsecuretoken", "new_password": "NewSecurePassword123"}})


class ActivationConfirmSchema(BaseModel):
    token: str = Field(..., description="Activation token received via email")
    model_config = ConfigDict(json_schema_extra={"example": {"token": "activationsecuretoken"}})

    

class UserOutSchema(BaseModel):
    id: int
    email: str
    last_name: str
    first_name: str
    is_admin: bool
    credits: int
    level: int
    model_config = ConfigDict(from_attributes=True)

class UserRecipeSchema(BaseModel):
    name: str
    descriptions: str
    ingredients: str
    instructions: str
    category: str | None = None
    cook_time: str | None = None
    calories: float | None = None
    protein: float | None = None
    carbohydrates: float | None = None
    fat: float | None = None
    is_ai: bool = False
    servings: int
    user_id: int

class AiRecipeSchema(BaseModel):
    name: str
    descriptions: str
    ingredients: str
    instructions: str
    category: str | None = None
    cook_time: str | None = None
    calories: float | None = None
    protein: float | None = None
    carbohydrates: float | None = None
    fat: float | None = None
    is_ai: bool = True
    servings: int

class AiRecipeOutSchema(BaseModel):
    id: int
    name: str
    descriptions: str
    ingredients: str
    instructions: str
    category: str | None = None
    cook_time: str | None = None
    calories: float | None = None
    protein: float | None = None
    carbohydrates: float | None = None
    fat: float | None = None
    is_ai: bool = True
    servings: int
    

class UserUpdateRecipeSchema(BaseModel):
    name: str | None = None
    descriptions: str | None = None
    ingredients: str | None = None
    instructions: str | None = None
    category: str | None = None
    cook_time: str | None = None
    calories: float | None = None
    protein: float | None = None
    carbohydrates: float | None = None
    fat: float | None = None
    servings: int | None = None

class RecipeOutSchema(BaseModel):
    id: int
    name: str
    ingredients: str
    cook_time: str = None
    calories: float = None
    protein: float = None
    carbohydrates: float = None
    fat: float = None
    rating: float = None
    images: str = None
    recipe_url: str = None
    
    model_config = ConfigDict(from_attributes=True)

class ImageDetectionResponse(BaseModel):
    """
    Base model representing the response body for image detection.

    Attributes:
        is_nsfw (bool): Whether the image is classified as NSFW.
        confidence_percentage (float): Confidence level of the NSFW classification.
    """

    is_nsfw: bool
    confidence_percentage: float

class FileImageDetectionResponse(ImageDetectionResponse):
    """
    Model extending ImageDetectionResponse with a file attribute.

    Attributes:
        file (str): The name of the file that was processed.
    """

    file_name: str
    
class PasswordChangeSchema(BaseModel):
    current_password: str
    new_password: str

class ChatRequest(BaseModel):
    context: str
    message: str

class SavedItemsSchema(BaseModel):
    item: str
    size: str

class UpdateItemSchema(BaseModel):
    item: str | None = None
    size: str | None = None

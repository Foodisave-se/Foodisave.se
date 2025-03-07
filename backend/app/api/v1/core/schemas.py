from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class SearchRecipeSchema(BaseModel):
    query: str
    carbohydrates: int | None = None
    calories: int | None = None
    protein: int | None = None
    recipe_type: str | None = None


class RandomRecipeSchema(BaseModel):
    recipe_type: str | None = None


class UserSchema(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    is_superuser: bool = False
    is_admin: bool = False
    is_customer: bool = True
    coins: int = 100
    level: int = 1

class UserSearchSchema(BaseModel):
    username: str

class UserUpdateSchema(BaseModel):
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr | None = None
    password: str | None = None

class UserRegisterSchema(BaseModel):
    username: str
    email: str
    last_name: str
    first_name: str
    password: str
    model_config = ConfigDict(from_attributes=True)


class TokenSchema(BaseModel):
    access_token: str
    token_type: str
    

class UserOutSchema(BaseModel):
    id: int
    username: str
    email: str
    last_name: str
    first_name: str
    is_superuser: bool
    is_admin: bool
    is_customer: bool
    coins: int
    level: int
    model_config = ConfigDict(from_attributes=True)

class UserRecipeSchema(BaseModel):
    name: str
    descriptions: str
    ingredients: str
    instructions: str
    tags: str | None = None
    cook_time: str | None = None
    calories: float | None = None
    protein: float | None = None
    carbohydrates: float | None = None
    fat: float | None = None
    is_ai: bool = False
    servings: int
    user_id: int

class UserUpdateRecipeSchema(BaseModel):
    name: str | None = None
    descriptions: str | None = None
    ingredients: str | None = None
    instructions: str | None = None
    tags: str | None = None
    cook_time: str | None = None
    calories: float | None = None
    protein: float | None = None
    carbohydrates: float | None = None
    fat: float | None = None
    servings: int | None = None

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
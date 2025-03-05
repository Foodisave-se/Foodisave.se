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
    level: int = 1

class UserSearchSchema(BaseModel):
    username: str

class UserUpdateSchema(BaseModel):
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr | None = None
    password: str | None = None


class TokenSchema(BaseModel):
    access_token: str
    token_type: str
    

class UserOutSchema(BaseModel):
    id: int
    email: str
    last_name: str
    first_name: str
    is_superuser: bool
    is_admin: bool
    is_customer: bool
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
    

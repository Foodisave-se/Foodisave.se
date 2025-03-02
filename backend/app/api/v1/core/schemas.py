from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class SearchRecipeSchema(BaseModel):
    query: str
    carbohydrates: int | None = None
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
    
    

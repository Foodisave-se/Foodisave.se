from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status, File, UploadFile, Form
from starlette.responses import StreamingResponse
from sqlalchemy import delete, insert, select, update, and_, or_, exists
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import Optional, Annotated
from random import randint
from app.security import get_current_user
from app.s3_utils import upload_image_to_s3
from app.settings import settings
import boto3

from app.api.v1.core.recipe_endpoints.user_recipe_db import (
    create_user_recipe_db,
    get_user_recipes_db,
    delete_user_recipe_db,
    update_user_recipe_db,
    create_ai_recipe_db,
    save_user_recipe_db
)

from app.api.v1.core.models import (
    Users,
    Recipes,
    UserRecipes,
    Images,
    Comments,
    Messages,
    Reviews,
    SavedUserRecipes,
    Images
)

from app.api.v1.core.schemas import (
    SearchRecipeSchema,
    RandomRecipeSchema,
    UserRecipeSchema,
    UserUpdateRecipeSchema,
    AiRecipeSchema,
    SavedUserRecipeSchema,
    AiRecipeOutSchema,
    UploadImageSchema
)

from app.db_setup import get_db

router = APIRouter()

s3_client = boto3.client(
    "s3",
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION,
)


@router.post("/user/recipe", response_model=UserRecipeSchema, status_code=200)
def create_user_recipe(user_recipe: UserRecipeSchema, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    
    result = create_user_recipe_db(user_recipe, db, current_user)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="couldnt add recipe to database"
        )
    return result

@router.post("/user-recipe/saved", status_code=204)
def save_recipe(user_recipe: SavedUserRecipeSchema, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    
    user_recipe = save_user_recipe_db(user_recipe, db, current_user)
    
    if not user_recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="couldnt save recipe"
        )

    return user_recipe

@router.get("/saved/user-recipe", status_code=200)
def get_saved_user_recipes(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    stmt = (
        select(UserRecipes)
        .join(SavedUserRecipes, UserRecipes.id == SavedUserRecipes.user_recipe_id)
        .where(SavedUserRecipes.user_id == current_user.id)
    )

    saved_user_recipes = db.scalars(stmt).all()
    

    if not saved_user_recipes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="couldnt find saved recipe"
        )
    return saved_user_recipes

@router.delete("/user-recipe/saved", status_code=200)
def delete_saved_recipe(recipe_id: SavedUserRecipeSchema, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = (
        delete(SavedUserRecipes)
        .where(SavedUserRecipes.user_recipe_id == recipe_id.user_recipe_id)
        .where(SavedUserRecipes.user_id == current_user.id)
    )
    db.execute(stmt)
    db.commit()
    return {"message": "Recipe deleted successfully"}


@router.post("/user-recipe/saved/check", status_code=200)
def check_recipe_saved(
    recipe: SavedUserRecipeSchema, 
    current_user: Users = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # Create a query to check if the recipe is saved by this user
    stmt = (
        select(exists().where(
            (SavedUserRecipes.user_recipe_id == recipe.user_recipe_id) & 
            (SavedUserRecipes.user_id == current_user.id)
        ))
    )
    
    # Execute the query
    result = db.execute(stmt).scalar()
    
    # Return a dictionary with the result
    return {"isSaved": result}

@router.post("/ai/recipe", response_model=AiRecipeOutSchema, status_code=200)
def create_ai_recipe(ai_recipe: AiRecipeSchema, db: Session = Depends(get_db), current_user: Users = Depends(get_current_user)):
    
    result = create_ai_recipe_db(ai_recipe, db, current_user)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="couldnt add recipe to database"
        )
    return result

@router.post("/upload-image/")
async def upload_image(
    user_recipe_id: int = Form(...), 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    current_user: Users = Depends(get_current_user)
):
    """Upload an image and store its information in the database using SQLAlchemy 2.0"""
    # Validate the file type
    if file.content_type not in ["image/jpeg", "image/png", "image/gif"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and GIF are supported.")

    # Upload to S3
    s3_url = upload_image_to_s3(file)
    
    # Create a new image record in the database using SQLAlchemy 2.0 pattern
    new_image = Images(
        link=s3_url,
        user_id=current_user.id,
        user_recipes_id=user_recipe_id
    )
    
    # Add, commit and refresh using SQLAlchemy 2.0 pattern
    db.add(new_image)
    db.commit()
    db.refresh(new_image)

    # Return the image ID for the client to use with the new endpoint
    return {
        "image_id": new_image.id,
        "image_url": f"/api/images/{new_image.id}"  # URL to your new endpoint
    }

@router.get("/images/{user_recipe_id}")
async def get_image(
    user_recipe_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    """
    Endpoint to serve private S3 images through your API with authentication.
    """
    stmt = select(Images).where(Images.user_recipes_id == user_recipe_id)
    result = db.execute(stmt)
    image = result.scalar_one_or_none()
    
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Optional: Check permissions (e.g., ensure the user has rights to view this image)
    if image.user_id != current_user.id:
        # Check if the user has permission to view this recipe's images
        # This is just an example - implement your own permission logic
        stmt = select(UserRecipes).where(UserRecipes.id == image.user_recipes_id)
        result = db.execute(stmt)
        user_recipe = result.scalar_one_or_none()
        
        if not user_recipe or user_recipe.user_id != current_user.id:
            # You can add more conditions here based on your app's sharing/permission model
            raise HTTPException(status_code=403, detail="You don't have permission to view this image")
    
    # Parse the S3 key from the full URL
    # Assuming the URL format is: https://{bucket}.s3.{region}.amazonaws.com/{key}
    s3_key = image.link.split(f"https://{settings.AWS_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/")[1]

    
    
    try:
        # Get the image file from S3
        response = s3_client.get_object(Bucket=settings.AWS_BUCKET_NAME, Key=s3_key)
        
        # Determine content type based on the file extension
        content_type = "image/jpeg"  # Default
        if s3_key.lower().endswith(".png"):
            content_type = "image/png"
        elif s3_key.lower().endswith(".gif"):
            content_type = "image/gif"
        
        # Stream the file content to the response
        return StreamingResponse(
            response["Body"].iter_chunks(),
            media_type=content_type
        )
        
    except s3_client.exceptions.NoSuchKey:
        raise HTTPException(status_code=404, detail="Image not found in storage")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving image: {str(e)}")

@router.get("/user/recipe/{user_id}", status_code=200)
def get_user_recipes(user_id: int, db: Session = Depends(get_db)):

    result = get_user_recipes_db(user_id, db)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="no recipes found"
        )
    return result

@router.delete("/user/recipe/delete/{user_recipe_id}", status_code=200)
def delete_user_recipe(user_recipe_id: int, db: Session = Depends(get_db)):
    
    result = delete_user_recipe_db(user_recipe_id, db)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="couldnt delete recipe"
        )
    return result

@router.patch("/user/recipe/update/{user_recipe_id}", response_model=UserUpdateRecipeSchema)
def update_user_recipe(
    user_recipe_id: int,
    user_update_recipe: UserUpdateRecipeSchema,
    db: Session = Depends(get_db),
):
    db_user_recipe = update_user_recipe_db(user_update_recipe, user_recipe_id, db)

    return db_user_recipe


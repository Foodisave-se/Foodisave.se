import boto3
import os
from uuid import uuid4
from app.settings import settings


AWS_ACCESS_KEY_ID = settings.AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY = settings.AWS_SECRET_ACCESS_KEY
AWS_BUCKET_NAME = settings.AWS_BUCKET_NAME
AWS_REGION = settings.AWS_REGION

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)

def upload_image_to_s3(file, folder="uploads"):
    """Upload an image to S3 and return the S3 key"""
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{folder}/{uuid4()}.{file_extension}"

    # Upload the file with private ACL - this is fine now since we'll serve it through our API
    s3_client.upload_fileobj(file.file, settings.AWS_BUCKET_NAME, unique_filename, ExtraArgs={'ACL': 'private'})

    # Return the full S3 path for storage in database
    return f"https://{settings.AWS_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{unique_filename}"

from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import delete, insert, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload

# from app.api.v1.core.models import
# from app.api.v1.core.schemas import
# from app.db_setup import get_db

router = APIRouter(tags=["dashboard"], prefix="/dashboard")

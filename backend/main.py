from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.core.models import (
    Users,
    Recipes,
    UserRecipes,
    Images,
    Comments,
    Messages,
    Reviews
)
# from app.api.v1.core.schemas import
from app.api.v1.routers import router
from app.db_setup import get_db, init_db


# Funktion som körs när vi startar FastAPI -
# perfekt ställe att skapa en uppkoppling till en databas
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()  # Vi ska skapa denna funktion
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(router, prefix="/v1", tags=["v1"])

origins = [
    "http://localhost:3000",  # React app URL
    "http://localhost:8000",  # FastAPI app URL
    "http://localhost:5173",  # Another development URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from fastapi import APIRouter

from app.api.v1.core.endpoints.general import router as general_router

router = APIRouter()

router.include_router(general_router)

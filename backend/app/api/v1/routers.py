from fastapi import APIRouter

from app.api.v1.core.recipe_endpoints.recipes import router as general_router
from app.api.v1.core.user_endpoints.users import router as user_router

router = APIRouter()

router.include_router(general_router)
router.include_router(user_router)

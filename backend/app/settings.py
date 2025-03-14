from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DB_URL: str
    GEMINI_API_KEY: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 60
    POSTMARK_TOKEN: str
    FRONTEND_BASE_URL: str = "http://localhost:5173" # Frontend URL for reset links
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()

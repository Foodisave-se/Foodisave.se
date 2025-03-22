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
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_BUCKET_NAME: str
    AWS_REGION: str
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()

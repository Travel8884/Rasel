from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Rasel SaaS Core"
    environment: str = "production"
    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 30
    algorithm: str = "HS256"
    database_url: str = "sqlite:///./rasel.db"
    password_min_length: int = 12
    login_attempt_limit: int = 5
    login_attempt_window_seconds: int = 300

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()

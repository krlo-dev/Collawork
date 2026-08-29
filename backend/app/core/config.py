from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://collawork:collawork@localhost:5433/collawork"
    cors_origins: str = "http://localhost:3000"

    aws_region: str = "us-east-1"
    s3_bucket_name: str = ""

    cognito_user_pool_id: str = ""
    cognito_app_client_id: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()

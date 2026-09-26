"""Config via env vars (pydantic-settings)."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@127.0.0.1:5432/adamgrafica"

    # A2A gateway (MIDI SOFT)
    a2a_gateway_url: str = "http://127.0.0.1:9900"
    a2a_agent_id: str = "agent-lead"  # lead agent del gateway

    # WhatsApp Bridge
    whatsapp_bridge_url: str = "http://127.0.0.1:5290"

    # CORS — comma-separated string
    cors_origins: str = "http://localhost:5173,http://localhost:5174,https://adamgrafica.online"

    # Env
    environment: str = "development"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
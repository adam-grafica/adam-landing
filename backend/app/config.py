"""Config via env vars (pydantic-settings)."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@127.0.0.1:5432/adamgrafica"

    # A2A gateway (MIDI SOFT)
    a2a_gateway_url: str = "http://127.0.0.1:9900"
    a2a_agent_id: str = "agent-lead"  # lead agent del gateway

    # Interruptor de la ruta A2A. Por defecto OFF: el widget es local-first.
    # Motivo (medido 2026-09-26): el gateway :9900 no aporta valor al widget
    # y tiene un coste real. (a) Su único agente vendible, agent-lead, responde
    # con voz de head-of-engineering => 71/73 llamadas caían al copy curado.
    # (b) El proceso corre desde un directorio borrado (cwd "(deleted)"), su
    # unidad systemd es LoadState=not-found y Restart=no: si la caja reinicia,
    # :9900 no vuelve y no hay forma de relanzarlo (no queda fuente en disco ni
    # en git). Con el breaker, un gateway muerto sólo se descubre tras 5
    # mensajes de prospecto pagando 1-3.7s cada uno. OFF hace que la caída del
    # gateway sea un no-evento en vez de una degradación silenciosa.
    # Para reactivarlo: A2A_ENABLED=1 (y un gateway agent-lead de voz comercial).
    a2a_enabled: bool = False

    # Contexto de negocio que se antepone al mensaje del visitante.
    # El gateway A2A no acepta system prompt (contrato: {agent_id, message, from}),
    # así que el rol de venta se inyecta aquí del lado del cliente.
    a2a_context: str = (
        "Eres el asistente de ventas de AdamGráfica (agencia de diseño y marketing "
        "en Chile). Responde en español chileno, tono amable y breve (2-3 frases). "
        "Tu interlocutor es un potencial cliente que está escribiendo desde el sitio "
        "web, NO un ingeniero ni un colega. NUNCA respondas como asistente técnico, "
        "no menciones tareas de ingeniería, ADAM OS ni agentes internos.\n"
        "Servicios y precios: branding desde $890.000 CLP; sitios web desde $1.490.000 CLP "
        "(entrega 4 semanas); automatizaciones con IA desde $2.400.000 CLP.\n"
        "Objetivo: entender la necesidad, responder la pregunta y agendar una reunión "
        "con el equipo comercial.\n"
    )

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
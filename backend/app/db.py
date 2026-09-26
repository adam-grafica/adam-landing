"""SQLAlchemy async engine + session factory."""
import uuid as _uuid
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


# Engine config — pool params only apply to network drivers (PG/MySQL).
# SQLite usa NullPool por defecto, no acepta pool_size/max_overflow.
_engine_kwargs = {"echo": False}
if not settings.database_url.startswith("sqlite"):
    _engine_kwargs.update(pool_size=10, max_overflow=20, pool_pre_ping=True)

engine = create_async_engine(settings.database_url, **_engine_kwargs)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class GUID(TypeDecorator):
    """Portable UUID: Postgres native UUID, SQLite CHAR(36) como string."""

    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            from sqlalchemy.dialects.postgresql import UUID as PGUUID
            return dialect.type_descriptor(PGUUID())
        return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if not isinstance(value, _uuid.UUID):
            value = _uuid.UUID(str(value))
        if dialect.name == "postgresql":
            return value
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, _uuid.UUID):
            return value
        return _uuid.UUID(str(value))


class Base(DeclarativeBase):
    """Declarative base for ORM models."""
    pass


# SQLite shim: SQLite no soporta JSONB ni UUID nativo.
import sqlalchemy as _sa  # noqa: E501
from sqlalchemy import event  # noqa: E501
from sqlalchemy.dialects.postgresql import JSONB  # noqa: E501


@event.listens_for(Base.metadata, "before_create", propagate=True)
def _sqlite_compat(metadata, connection, **kw):  # noqa: ARG001
    """Si el engine es SQLite, sustituye JSONB -> JSON y UUID -> GUID(String)."""
    if engine.dialect.name != "sqlite":
        return
    for table in metadata.tables.values():
        for col in table.columns:
            col.type = _coerce_type_for_sqlite(col.type)


def _coerce_type_for_sqlite(t):
    # JSONB -> JSON
    if isinstance(t, JSONB):
        return _sa.JSON()
    # UUID nativo -> GUID portable (CHAR(36) en SQLite, UUID en Postgres)
    try:
        from sqlalchemy.dialects.postgresql import UUID as _PGUUID
        if isinstance(t, _PGUUID):
            return GUID()
    except Exception:
        pass
    return t


async def init_db():
    """Create tables if not exist (lightweight — production usa Alembic).

    Tolerante a fallos: si la DB no está disponible (ej. preview sin
    Postgres), logueamos y dejamos la API arriba igualmente. /health y
    /docs siguen funcionando; los endpoints que tocan DB devolverán 503.
    """
    import logging
    log = logging.getLogger(__name__)
    try:
        # Import models so they register with Base.metadata
        from app.models import lead, chat_session  # noqa: F401
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        log.info("init_db: tables ready")
    except Exception as exc:
        log.warning(f"init_db: DB no disponible ({type(exc).__name__}: {exc}). "
                    "API arranca en modo degradado; endpoints con DB devolverán 503.")


async def close_db():
    """Dispose on shutdown."""
    await engine.dispose()


async def get_session() -> AsyncSession:
    """Dependency: yield session, commit on success, rollback on error."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
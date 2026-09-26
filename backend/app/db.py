"""SQLAlchemy async engine + session factory."""
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
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


class Base(DeclarativeBase):
    """Declarative base for ORM models."""
    pass


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
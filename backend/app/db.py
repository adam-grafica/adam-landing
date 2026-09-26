"""SQLAlchemy async engine + session factory."""
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


engine = create_async_engine(
    settings.database_url,
    echo=False,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Declarative base for ORM models."""
    pass


async def init_db():
    """Create tables if not exist (lightweight — production usa Alembic)."""
    # Import models so they register with Base.metadata
    from app.models import lead, chat_session  # noqa: F401
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


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
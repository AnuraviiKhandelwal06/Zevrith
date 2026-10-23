import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, JSON, String

from database import Base


class InvestigationRecord(Base):
    __tablename__ = "investigations"

    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    claim = Column(String(500), nullable=False)

    result = Column(JSON, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )
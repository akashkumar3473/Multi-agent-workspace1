from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from database.database import Base


class Chat(Base):

    __tablename__ = "chat"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    title = Column(String)

    agent_id = Column(
        Integer,
        ForeignKey("agents.id"),
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )
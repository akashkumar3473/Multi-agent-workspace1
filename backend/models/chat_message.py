from sqlalchemy import Column, Integer, Text, String, ForeignKey

from database.database import Base


class ChatMessage(Base):

    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True)

    chat_id = Column(
        Integer,
        ForeignKey("chat.id")
    )

    role = Column(String)

    content = Column(Text)
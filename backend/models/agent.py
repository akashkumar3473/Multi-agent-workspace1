from sqlalchemy import Column, Integer, String
from database.database import Base


class Agent(Base):

    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)

    icon = Column(String)

    system_prompt = Column(String)
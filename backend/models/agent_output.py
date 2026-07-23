from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import ForeignKey

from database.database import Base


class AgentOutput(Base):
    __tablename__ = "agent_outputs"

    id = Column(Integer, primary_key=True, index=True)

    agent_name = Column(String)

    output = Column(Text)

    project_id = Column(
        Integer,
        ForeignKey("projects.id")
    )
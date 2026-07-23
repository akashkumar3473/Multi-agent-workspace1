from pydantic import BaseModel


class AgentOutputCreate(BaseModel):
    project_id: int
    agent_name: str
    output: str
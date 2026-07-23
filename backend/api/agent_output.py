from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from database.database import get_db

from models.agent_output import AgentOutput

from schemas.agent_output_schema import (
    AgentOutputCreate
)

from dependencies.auth_dependency import (
    get_current_user
)

router = APIRouter()

@router.post("/save")
def save_agent_output(
    data: AgentOutputCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    output = AgentOutput(
        project_id=data.project_id,
        agent_name=data.agent_name,
        output=data.output
    )

    db.add(output)
    db.commit()
    db.refresh(output)

    return {
        "message": "Output saved",
        "id": output.id
    }

@router.get("/project/{project_id}")
def get_agent_outputs(
    project_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    outputs = db.query(AgentOutput).filter(
        AgentOutput.project_id == project_id
    ).all()

    return outputs
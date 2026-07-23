from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from models.agent_output import AgentOutput

router = APIRouter()


@router.get("/project/{project_id}")
def get_project_outputs(
    project_id: int,
    db: Session = Depends(get_db)
):

    outputs = (
        db.query(AgentOutput)
        .filter(
            AgentOutput.project_id == project_id
        )
        .all()
    )

    return outputs
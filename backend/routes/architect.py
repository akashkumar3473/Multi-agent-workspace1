from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from database.database import get_db

from models.project import Project
from models.agent_output import AgentOutput

from agents.architect_agent import architect_project

from utils.jwt_handler import get_current_user

router = APIRouter(
    prefix="/architect",
    tags=["Architect Agent"]
)


@router.post("/{project_id}")
def run_architect_agent(
    project_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    result = architect_project(
        project.description
    )

    output = AgentOutput(
        project_id=project.id,
        agent_name="Architect Agent",
        output=result
    )

    db.add(output)
    db.commit()

    return {
        "message": "Architecture generated"
    }
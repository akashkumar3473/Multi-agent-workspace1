from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from database.database import get_db

from models.project import Project
from models.agent_output import AgentOutput

from dependencies.auth_dependency import (
    get_current_user
)

from agents.research_agent import (
    research_project
)

router = APIRouter()

@router.post("/{project_id}")
def run_research_agent(
    project_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:
        return {
            "message": "Project not found"
        }

    result = research_project(
        project.description
    )

    output = AgentOutput(
        project_id=project.id,
        agent_name="Research Agent",
        output=result
    )

    db.add(output)
    db.commit()

    return {
        "message": "Research completed"
    }
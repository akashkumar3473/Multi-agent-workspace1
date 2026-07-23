from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from models.project import Project
from models.agent_output import AgentOutput

router = APIRouter()


@router.get("/{project_id}")
def get_project_results(
    project_id: int,
    db: Session = Depends(get_db)
):

    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    outputs = (
        db.query(AgentOutput)
        .filter(AgentOutput.project_id == project_id)
        .all()
    )

    return {
        "project_id": project.id,
        "project_title": project.title,
        "results": [
            {
                "agent": output.agent_name,
                "output": output.output
            }
            for output in outputs
        ]
    }
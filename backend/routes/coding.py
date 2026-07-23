from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from models.project import Project
from models.agent_output import AgentOutput
from services.coding_service import generate_coding_plan

router = APIRouter()


@router.post("/{project_id}")
def generate_code(
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

    research_output = (
        db.query(AgentOutput)
        .filter(
            AgentOutput.project_id == project_id,
            AgentOutput.agent_name == "Research Agent"
        )
        .first()
    )

    architect_output = (
        db.query(AgentOutput)
        .filter(
            AgentOutput.project_id == project_id,
            AgentOutput.agent_name == "Architect Agent"
        )
        .first()
    )
    if not research_output:
        raise HTTPException(
            status_code=400,
            detail="Research Agent output not found"
        )
    if not architect_output:
        raise HTTPException(
            status_code=400,
            detail="Architect Agent output not found"
        )
    
    coding_output = generate_coding_plan(
        project_title=project.title,
        research_output=research_output.output,
        architect_output=architect_output.output
    )

    agent_output = AgentOutput(
        project_id=project_id,
        agent_name="Coding Agent",
        output=coding_output
    )

    db.add(agent_output)
    db.commit()

    return {
        "message": "Coding Agent completed successfully"
    }
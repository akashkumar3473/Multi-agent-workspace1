from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db

from models.project import Project
from models.agent_output import AgentOutput

from services.documentation_service import generate_documentation

router = APIRouter()


@router.post("/{project_id}")
def run_documentation_agent(
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

    architect_output = (
        db.query(AgentOutput)
        .filter(
            AgentOutput.project_id == project_id,
            AgentOutput.agent_name == "Architect Agent"
        )
        .first()
    )

    coding_output = (
        db.query(AgentOutput)
        .filter(
            AgentOutput.project_id == project_id,
            AgentOutput.agent_name == "Coding Agent"
        )
        .first()
    )

    testing_output = (
        db.query(AgentOutput)
        .filter(
            AgentOutput.project_id == project_id,
            AgentOutput.agent_name == "Testing Agent"
        )
        .first()
    )

    if not architect_output:
        raise HTTPException(
            status_code=400,
            detail="Run Architect Agent first"
        )

    if not coding_output:
        raise HTTPException(
            status_code=400,
            detail="Run Coding Agent first"
        )

    if not testing_output:
        raise HTTPException(
            status_code=400,
            detail="Run Testing Agent first"
        )

    documentation_output = generate_documentation(
        project_title=project.title,
        architect_output=architect_output.output,
        coding_output=coding_output.output,
        testing_output=testing_output.output
    )

    agent_output = AgentOutput(
        project_id=project_id,
        agent_name="Documentation Agent",
        output=documentation_output
    )

    db.add(agent_output)
    db.commit()

    return {
        "message": "Documentation Agent completed successfully"
    }
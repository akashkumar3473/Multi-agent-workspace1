from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db

from models.project import Project
from models.agent_output import AgentOutput

from services.testing_service import generate_test_plan

router = APIRouter()


@router.post("/{project_id}")
def run_testing_agent(
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

    coding_output = (
        db.query(AgentOutput)
        .filter(
            AgentOutput.project_id == project_id,
            AgentOutput.agent_name == "Coding Agent"
        )
        .first()
    )

    if not coding_output:
        raise HTTPException(
            status_code=400,
            detail="Run Coding Agent first"
        )

    testing_output = generate_test_plan(
        project_title=project.title,
        coding_output=coding_output.output
    )

    agent_output = AgentOutput(
        project_id=project_id,
        agent_name="Testing Agent",
        output=testing_output
    )

    db.add(agent_output)
    db.commit()

    return {
        "message": "Testing Agent completed successfully"
    }
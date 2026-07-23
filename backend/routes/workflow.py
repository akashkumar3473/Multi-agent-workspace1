from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db

from models.project import Project
from models.agent_output import AgentOutput

from services.gemini_service import generate_research
from services.gemini_service import generate_architecture
from services.coding_service import generate_coding_plan
from services.testing_service import generate_test_plan
from services.documentation_service import generate_documentation

router = APIRouter()


@router.post("/run/{project_id}")
def run_complete_workflow(
    project_id: int,
    db: Session = Depends(get_db)
):

    # Delete old outputs for this project
    db.query(AgentOutput).filter(
        AgentOutput.project_id == project_id
    ).delete()

    db.commit()

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
    print("\n" + "=" * 50)
    print(f"Starting workflow for project: {project.title}")
    print(f"Project ID: {project.id}")
    print("=" * 50)
    project.status = "Running"
    project.workflow_step = "Research"
    db.commit()
    
    # ==========================
    # Research Agent
    # ==========================

    try:
        print("Research Agent Running...")
        research_output = generate_research(project.title)
    except Exception as e:
        print("Research Agent Error:", e)
        research_output = "Research generation failed"

    db.add(
        AgentOutput(
            project_id=project_id,
            agent_name="Research Agent",
            output=research_output
        )
    )
    db.commit()
    project.workflow_step = "Architecture"
    db.commit()


    # ==========================
    # Architect Agent
    # ==========================

    try:
        print("Architect Agent Running...")
        architect_output = generate_architecture(
            project.title
        )
    except Exception as e:
        print("Architect Agent Error:", e)
        architect_output = "Architecture generation failed"

    db.add(
        AgentOutput(
            project_id=project_id,
            agent_name="Architect Agent",
            output=architect_output
        )
    )
    db.commit()
    project.workflow_step = "Coding"
    db.commit()

    # ==========================
    # Coding Agent
    # ==========================

    try:
        print("Coding Agent Running...")
        coding_output = generate_coding_plan(
            project.title,
            research_output,
            architect_output
        )
    except Exception as e:
        print("Coding Agent Error:", e)
        coding_output = "Coding plan generation failed"

    db.add(
        AgentOutput(
            project_id=project_id,
            agent_name="Coding Agent",
            output=coding_output
        )
    )
    db.commit()
    project.workflow_step = "Testing"
    db.commit()

    # ==========================
    # Testing Agent
    # ==========================

    try:
        print("Testing Agent Running...")
        testing_output = generate_test_plan(
            project.title,
            coding_output
        )
    except Exception as e:
        print("Testing Agent Error:", e)
        testing_output = "Testing generation failed"

    db.add(
        AgentOutput(
            project_id=project_id,
            agent_name="Testing Agent",
            output=testing_output
        )
    )
    db.commit()
    project.workflow_step = "Documentation"
    db.commit()

    # ==========================
    # Documentation Agent
    # ==========================

    try:
        print("Documentation Agent Running...")
        documentation_output = generate_documentation(
            project.title,
            architect_output,
            coding_output,
            testing_output
        )
        print("=" * 50)
        project.status = "Completed"
        project.workflow_step = "Completed"

        db.commit()

        print("Workflow Completed Successfully")
        print("=" * 50)

    except Exception as e:
        print("Documentation Agent Error:", e)
        documentation_output = "Documentation generation failed"

    db.add(
        AgentOutput(
            project_id=project_id,
            agent_name="Documentation Agent",
            output=documentation_output
        )
    )
    db.commit()

    return {
        "message": "Workflow completed",
        "research": research_output,
        "architecture": architect_output,
        "coding": coding_output,
        "testing": testing_output,
        "documentation": documentation_output
    }
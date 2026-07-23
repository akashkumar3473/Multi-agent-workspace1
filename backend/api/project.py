from fastapi import HTTPException
from fastapi import APIRouter
from fastapi import Depends
from fastapi import BackgroundTasks

from sqlalchemy.orm import Session

from database.database import get_db, SessionLocal

from models.project import Project
# Import AgentOutput to clear child rows before project deletion
from models.agent_output import AgentOutput 

from schemas.project_schema import ProjectCreate

from dependencies.auth_dependency import get_current_user

import time

router = APIRouter()


# -------------------------------
# Background AI Workflow
# -------------------------------

def run_workflow(project_id: int):

    steps = [
        "Research",
        "Architecture",
        "Coding",
        "Testing",
        "Documentation",
        "Completed"
    ]

    for step in steps:

        db = SessionLocal()

        try:

            project = (
                db.query(Project)
                .filter(Project.id == project_id)
                .first()
            )

            if not project:
                return

            project.workflow_step = step

            if step == "Completed":
                project.status = "Completed"
            else:
                project.status = "Running"

            db.commit()

        finally:
            db.close()

        time.sleep(2)


# -------------------------------
# Create Project
# -------------------------------

@router.post("/create")
def create_project(
    project: ProjectCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    new_project = Project(
        user_id=current_user["user_id"],
        title=project.title,
        description=project.description,
        status="Pending",
        workflow_step="Pending"
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    # Start AI Workflow
    

    return {
        "message": "Project Created",
        "project_id": new_project.id
    }


# -------------------------------
# Get Projects
# -------------------------------

@router.get("/all")
def get_projects(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    projects = (
        db.query(Project)
        .filter(Project.user_id == current_user["user_id"])
        .all()
    )

    return projects


# -------------------------------
# Delete Project
# -------------------------------

@router.delete("/delete/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # 1. Verify project exists and belongs to the current user
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.user_id == current_user["user_id"]
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # 2. Delete child records first to satisfy foreign key constraints
    db.query(AgentOutput).filter(AgentOutput.project_id == project_id).delete()

    # 3. Safely remove the parent project row
    db.delete(project)
    db.commit()

    return {
        "message": "Project and associated outputs deleted successfully"
    }
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from models.agent import Agent
from services.agent_runner import run_agent

router = APIRouter(
    prefix="/agents",
    tags=["Agents"]
)


# -----------------------------
# Get All Agents
# -----------------------------
@router.get("/")
def get_agents(
    db: Session = Depends(get_db)
):
    return db.query(Agent).all()


# -----------------------------
# Get One Agent
# -----------------------------
@router.get("/{agent_id}")
def get_agent(
    agent_id: int,
    db: Session = Depends(get_db)
):
    agent = (
        db.query(Agent)
        .filter(Agent.id == agent_id)
        .first()
    )

    if not agent:
        return {"error": "Agent not found"}

    return agent


# -----------------------------
# Run One Agent
# -----------------------------
@router.post("/run")
def execute_agent(
    data: dict,
    db: Session = Depends(get_db)
):

    return run_agent(
        db=db,
        agent_id=data["agent_id"],
        prompt=data["prompt"],
    )

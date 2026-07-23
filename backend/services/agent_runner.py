from sqlalchemy.orm import Session

from models.agent import Agent
from services.ai_provider import ask_ai


def run_agent(
    db: Session,
    agent_id: int,
    prompt: str,
):

    agent = (
        db.query(Agent)
        .filter(Agent.id == agent_id)
        .first()
    )

    if not agent:
        return {
            "error": "Agent not found"
        }

    final_prompt = f"""
{agent.system_prompt}

User Request:

{prompt}
"""

    reply = ask_ai(final_prompt)

    return {
        "agent": agent.name,
        "response": reply,
    }
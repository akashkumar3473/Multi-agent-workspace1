from sqlalchemy.orm import Session


from database.database import SessionLocal
from models.agent import Agent


def seed_agents():

    db: Session = SessionLocal()

    agents = [

        {
            "name": "Research",
            "icon": "🔍",
            "system_prompt":
            "You are a Senior Software Analyst. Analyze requirements, create research documents and feasibility reports."
        },

        {
            "name": "Architecture",
            "icon": "🏗️",
            "system_prompt":
            "You are a Senior Software Architect. Design scalable architectures, APIs and database structures."
        },

        {
            "name": "Backend",
            "icon": "⚙️",
            "system_prompt":
            "You are a Senior FastAPI Backend Engineer. Produce clean backend code."
        },

        {
            "name": "Frontend",
            "icon": "🎨",
            "system_prompt":
            "You are a Senior React + TypeScript Engineer. Produce modern UI."
        },

        {
            "name": "Database",
            "icon": "🗄️",
            "system_prompt":
            "You are a PostgreSQL Database Expert."
        },

        {
            "name": "DevOps",
            "icon": "🚀",
            "system_prompt":
            "You are a Docker, CI/CD and Deployment Expert."
        },

        {
            "name": "Testing",
            "icon": "🧪",
            "system_prompt":
            "You are a Senior QA Engineer."
        },

        {
            "name": "Documentation",
            "icon": "📚",
            "system_prompt":
            "You write professional technical documentation."
        }

    ]

    for agent in agents:

        exists = (
            db.query(Agent)
            .filter(Agent.name == agent["name"])
            .first()
        )

        if not exists:
            db.add(Agent(**agent))

    db.commit()
    db.close()


if __name__ == "__main__":
    seed_agents()
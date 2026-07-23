from fastapi import WebSocket, WebSocketDisconnect
from websocket_manager import manager
from routes.agent_outputs import router as outputs_router
from routes.results import router as results_router
from routes.workflow import router as workflow_router
from routes.documentation import router as documentation_router
from routes.testing import router as testing_router
from routes.architect import router as architect_router
from routes.coding import router as coding_router
from api.research import router as research_router
from api.agent_output import router as agent_output_router
from api.project import router as project_router
from api.auth import router as auth_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import report
from api import export
from api import assistant
from api import stream
import api.chat as chat
from models.chat import Chat
from models.chat_message import ChatMessage

from database.database import engine, Base
from models.user import User
from models.project import Project
from models.chat import Chat
from models.chat_message import ChatMessage
from models.agent import Agent
from models.agent_output import AgentOutput
from api.agent import router as agent_router


# Create tables
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create database tables: {e}")

app = FastAPI(
    title="Multi-Agent AI Workspace",
    description="Multi-agent AI system for code generation and collaboration",
    version="1.0.0"
)
app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    project_router,
    prefix="/projects",
    tags=["Projects"]
)

app.include_router(
    agent_output_router,
    prefix="/agent-output",
    tags=["Agent Output"]
)

app.include_router(
    research_router,
    prefix="/research",
    tags=["Research Agent"]
)

app.include_router(
    architect_router
)

app.include_router(
    coding_router,
    prefix="/coding",
    tags=["Coding Agent"]
)
app.include_router(
    testing_router,
    prefix="/testing",
    tags=["Testing Agent"]
)

app.include_router(
    documentation_router,
    prefix="/documentation",
    tags=["Documentation Agent"]
)

app.include_router(
    workflow_router,
    prefix="/workflow",
    tags=["Workflow Engine"]
)

app.include_router(
    results_router,
    prefix="/results",
    tags=["Results"]
)

app.include_router(
    outputs_router,
    prefix="/outputs",
    tags=["Agent Outputs"]
)

app.include_router(report.router)

app.include_router(export.router)

app.include_router(assistant.router)

app.include_router(stream.router)

app.include_router(chat.router)

app.include_router(agent_router)





# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Multi-Agent AI Workspace Running"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

    @app.websocket("/ws/{project_id}")
    async def websocket_endpoint(
        websocket: WebSocket,
        project_id: int,
    ):
        await manager.connect(project_id, websocket)

        try:
            while True:
                # Keep the connection alive
                await websocket.receive_text()

        except WebSocketDisconnect:
            manager.disconnect(project_id, websocket)
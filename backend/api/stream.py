from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import asyncio
import json

router = APIRouter(
    prefix="/stream",
    tags=["Live Workflow"]
)


@router.get("/{project_id}")
async def stream_workflow(project_id: int):

    async def event_generator():

        agents = [
            "Research",
            "Architecture",
            "Coding",
            "Testing",
            "Documentation"
        ]

        for agent in agents:

            yield f"data: {json.dumps({'agent': agent, 'status': 'running'})}\n\n"

            await asyncio.sleep(3)

            yield f"data: {json.dumps({'agent': agent, 'status': 'completed'})}\n\n"

        yield f"data: {json.dumps({'workflow': 'completed'})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )
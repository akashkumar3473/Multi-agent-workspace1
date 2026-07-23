from fastapi import APIRouter
from pydantic import BaseModel

from services.ai_provider import ask_ai

router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"]
)


class ChatRequest(BaseModel):
    message: str



async def chat(request: ChatRequest):

    prompt = f"""
You are CodeForge AI.

You are an expert software architect, senior full-stack developer,
DevOps engineer, UI/UX designer and technical mentor.

Always answer professionally.

User Message:

{request.message}
"""

    reply = ask_ai(prompt)

    return {
        "reply": reply
    }
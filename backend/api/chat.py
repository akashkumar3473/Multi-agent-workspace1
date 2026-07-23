import asyncio
import json

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from database.database import get_db

from models.chat import Chat
from models.chat_message import ChatMessage

from schemas.chat_schema import ChatMessageRequest

# Updated import statement
from services.ai_provider import ask_ai

router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"]
)

# --------------------------------
# Create New Chat
# --------------------------------

@router.post("/new")
def create_chat(
    db: Session = Depends(get_db)
):
    chat = Chat(
        user_id=1,
        title="New Chat"
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat


# --------------------------------
# Get All Chats
# --------------------------------

@router.get("/all")
def get_all_chats(
    db: Session = Depends(get_db)
):
    return (
        db.query(Chat)
        .order_by(Chat.created_at.desc())
        .all()
    )


# --------------------------------
# Get Messages
# --------------------------------

@router.get("/messages/{chat_id}")
def get_messages(
    chat_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.chat_id == chat_id)
        .order_by(ChatMessage.id.asc())
        .all()
    )


# --------------------------------
# Send Message
# --------------------------------

@router.post("/send/{chat_id}")
async def send_message(
    chat_id: int,
    request: ChatMessageRequest,
    db: Session = Depends(get_db)
):

    chat = (
        db.query(Chat)
        .filter(Chat.id == chat_id)
        .first()
    )

    if not chat:
        return {
            "error": "Chat not found"
        }

    # -------------------------
    # Save User Message
    # -------------------------

    user_message = ChatMessage(
        chat_id=chat_id,
        role="user",
        content=request.message
    )

    db.add(user_message)

    # -------------------------
    # Auto Rename Chat
    # -------------------------

    if chat.title == "New Chat":
        from services.gemini_service import generate_chat_title
        ai_title = generate_chat_title(request.message)
        if ai_title:
            chat.title = ai_title
        else:
            # Fallback to simple truncation if AI fails
            words = request.message.strip().split()
            title = " ".join(words[:6])
            if len(words) > 6:
                title += "..."
            chat.title = title

    db.commit()
    db.refresh(chat)

    # -------------------------
    # Load Full Conversation
    # -------------------------

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.chat_id == chat_id)
        .order_by(ChatMessage.id.asc())
        .all()
    )

    conversation = ""

    for msg in messages:
        if msg.role == "user":
            conversation += f"USER: {msg.content}\n"
        else:
            conversation += f"ASSISTANT: {msg.content}\n"

    prompt = f"""
You are CodeForge AI.

Continue this conversation naturally.

Conversation:

{conversation}

ASSISTANT:
"""

    # -------------------------
    # Ask Gemini
    # -------------------------

    # Already correctly using ask_ai
    reply = ask_ai(prompt)

    # -------------------------
    # Save Assistant Reply
    # -------------------------

    assistant_message = ChatMessage(
        chat_id=chat_id,
        role="assistant",
        content=reply
    )

    db.add(assistant_message)
    db.commit()
    db.refresh(chat)  # Refresh to get the updated title

    return {
        "reply": reply,
        "title": chat.title
    }


# --------------------------------
# Streaming Endpoint
# --------------------------------

@router.get("/stream")
async def stream_chat(message: str):

    async def event_generator():

        # Updated from ask_gemini(message) to ask_ai(message)
        reply = ask_ai(message)

        words = reply.split()

        for word in words:
            yield f"data: {json.dumps({'chunk': word + ' '})}\n\n"
            await asyncio.sleep(0.04)

        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )


# --------------------------------
# Delete Chat
# --------------------------------

@router.delete("/{chat_id}")
def delete_chat(
    chat_id: int,
    db: Session = Depends(get_db)
):

    chat = (
        db.query(Chat)
        .filter(Chat.id == chat_id)
        .first()
    )

    if not chat:
        return {
            "error": "Chat not found"
        }

    # Delete all messages
    (
        db.query(ChatMessage)
        .filter(ChatMessage.chat_id == chat_id)
        .delete()
    )

    # Delete chat
    db.delete(chat)

    db.commit()

    return {
        "message": "Chat deleted successfully"
    }
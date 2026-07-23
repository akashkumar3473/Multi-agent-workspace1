from services.ai_provider import ask_ai

def generate_chat_title(user_message: str):
    """
    Generate a short title for a chat.
    Falls back to the user's first few words if AI is unavailable.
    """

    prompt = f"""
Generate a short chat title (2-5 words).

User message:
{user_message}

Return ONLY the title.
"""

    try:
        title = ask_ai(prompt).strip()

        if not title:
            raise Exception("Empty title")

        if len(title) > 50:
            title = title[:47] + "..."

        return title

    except Exception:
        words = user_message.strip().split()

        fallback = " ".join(words[:6])

        if len(words) > 6:
            fallback += "..."

        return fallback


def generate_research(project_description: str):

    prompt = f"""
You are a Senior Software Architect.

Analyze the following project:

{project_description}

Generate:

1. Functional Requirements
2. Non Functional Requirements
3. Recommended Tech Stack
4. Challenges
5. Development Roadmap
"""

    reply = ask_ai(prompt)
    return reply


def generate_architecture(project_description: str):

    prompt = f"""
You are a Senior Software Architect.

Project:
{project_description}

Generate:

1. System Architecture
2. Database Design
3. API Design
4. Folder Structure
5. Deployment Architecture
"""

    reply = ask_ai(prompt)
    return reply
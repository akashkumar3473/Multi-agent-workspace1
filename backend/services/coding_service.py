from services.ai_provider import ask_ai


def generate_coding_plan(project_title, research_output, architect_output):
    prompt = f"""
You are a Senior Full Stack Engineer.

Project:
{project_title}

Architecture:
{architect_output}

Generate production-ready code.

Return ONLY these files.
frontend/src/App.jsx
frontend/package.json
backend/main.py
backend/requirements.txt
README.md

For every file use this format.

FILE: frontend/src/App.jsx
<code>

FILE: backend/main.py
<code>

FILE: README.md
<code>

Do not explain anything.
Only return code.
"""

    return ask_ai(prompt)
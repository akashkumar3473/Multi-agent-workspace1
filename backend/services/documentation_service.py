from services.ai_provider import ask_ai


def generate_documentation(
    project_title,
    architect_output,
    coding_output,
    testing_output
):

    prompt = f"""
You are a Senior Technical Writer.

Project:
{project_title}

Architecture:
{architect_output}

Coding Plan:
{coding_output}

Testing Plan:
{testing_output}

Generate:

1. Project Overview
2. Features
3. System Architecture
4. Installation Guide
5. API Documentation
6. Database Design
7. Testing Strategy
8. Deployment Guide
9. Future Enhancements
10. Professional README.md
"""

    reply = ask_ai(prompt)
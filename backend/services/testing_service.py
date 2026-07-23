from services.ai_provider import ask_ai


def generate_test_plan(
    project_title,
    coding_output
):

    prompt = f"""
You are a Senior QA Engineer.

Project:
{project_title}

Coding Plan:
{coding_output}

Generate:

1. Unit Test Cases
2. Integration Test Cases
3. API Test Cases
4. Security Test Cases
5. Performance Test Cases
6. Automation Testing Strategy
"""

    reply = ask_ai(prompt)
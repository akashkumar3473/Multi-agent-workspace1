from services.gemini_service import generate_research


def research_project(
    project_description: str
):
    return generate_research(
        project_description
    )
from services.gemini_service import generate_architecture


def architect_project(
    project_description: str
):
    return generate_architecture(
        project_description
    )
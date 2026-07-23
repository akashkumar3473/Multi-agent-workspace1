import os

from services.ai_provider import ask_ai


def generate_file(project_path: str, filename: str, prompt: str):
    """
    Generate a file using AI and save it.
    """

    print(f"Generating {filename}...")

    content = ask_ai(prompt)

    full_path = os.path.join(project_path, filename)

    os.makedirs(os.path.dirname(full_path), exist_ok=True)

    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"{filename} created.")

    return full_path
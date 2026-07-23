from services.gemini_helper import ask_gemini
from services.openai_helper import ask_openai
from services.deepseek_helper import ask_deepseek


PROVIDERS = [
    ("Gemini", ask_gemini),
    ("OpenAI", ask_openai),
    ("DeepSeek", ask_deepseek),
]


def ask_ai(prompt: str):

    errors = []

    for provider_name, provider in PROVIDERS:

        try:

            print(f"Trying {provider_name}...")

            result = provider(prompt)

            print(f"{provider_name} Success")

            return result

        except Exception as e:

            print(f"{provider_name} Failed")

            errors.append(
                f"{provider_name}: {str(e)}"
            )

    raise Exception(
        "\n".join(errors)
    )
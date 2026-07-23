from google import genai
from dotenv import load_dotenv
import os
import time

load_dotenv()

if os.getenv("GEMINI_API_KEY"):
    print("Gemini API Key loaded successfully.")
else:
    print("Gemini API Key not found!")

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def ask_gemini(prompt):

    for i in range(3):

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            return response.text

        except Exception as e:

            error = str(e)

            print(f"Retry Attempt: {i + 1}")
            print("=" * 80)
            print(error)
            print("=" * 80)

            # Quota Exceeded
            if (
                "429" in error
                or "RESOURCE_EXHAUSTED" in error
                or "quota" in error.lower()
            ):
                raise Exception("Gemini quota exceeded")

            # Temporary Gemini Overload
            if "503" in error:
                print("Gemini Busy. Waiting 3 seconds...")
                time.sleep(3)

                if i < 2:
                    continue

                raise Exception("Gemini temporarily unavailable")

            # Any other unexpected exception
            raise Exception(error)

    # Fallback exception if the retry loop finishes without returning or raising earlier
    raise Exception("Gemini Service Temporarily Unavailable")
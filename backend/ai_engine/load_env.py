from dotenv import load_dotenv
import os

load_dotenv()  # Loads environment variables from .env file

gemini_api_key = os.getenv("GEMINI_API_KEY")
print("Gemini API Key:", gemini_api_key)

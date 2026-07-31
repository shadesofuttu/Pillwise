import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

print("Available Gemini models:\n")
try:
    models = client.models.list()
    for model in models:
        print(f"Model: {model.name}")
        print()
except Exception as e:
    print(f"Error listing models: {e}")
    import traceback
    traceback.print_exc()

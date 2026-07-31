import os
import logging
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
import services

# Configure logging to display errors in the console
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pills-pill-backend")

# Load environment variables
load_dotenv()

# Initialize FastAPI application
app = FastAPI(title="PillsPill Backend API", version="1.0.0")

# Add CORS middleware to allow requests from any origin (e.g., frontend host)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fetch API key and initialize GenAI client
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.warning("GEMINI_API_KEY environment variable is not set. API calls will fail.")

# Instantiate client and set it on the services module
client = genai.Client(api_key=api_key)
services.client = client

# Define request schemas using Pydantic
class IdentifyRequest(BaseModel):
    image: str  # Base64 string, might include data URI prefix

class ExplainRequest(BaseModel):
    medicineName: str
    rawText: str

@app.get("/health")
def health_check():
    """Simple health check endpoint to verify backend status."""
    return {"status": "ok"}

@app.post("/api/identify")
def identify(payload: IdentifyRequest):
    """
    POST /api/identify
    Accepts base64 image data and returns identified medicine name + extracted text.
    """
    try:
        result = services.identify_medicine(payload.image)
        return {
            "medicineName": result.medicineName,
            "rawText": result.rawText
        }
    except Exception as e:
        logger.exception("Error during /api/identify execution:")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to identify medicine: {str(e)}"
        )

@app.post("/api/explain")
def explain(payload: ExplainRequest):
    """
    POST /api/explain
    Accepts medicine name and raw text, returning structured, plain-language patient advice.
    """
    try:
        result = services.explain_medicine(payload.medicineName, payload.rawText)
        return {
            "purpose": result.purpose,
            "dosageNote": result.dosageNote,
            "precautions": result.precautions,
            "disclaimer": result.disclaimer
        }
    except Exception as e:
        logger.exception("Error during /api/explain execution:")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate explanation: {str(e)}"
        )

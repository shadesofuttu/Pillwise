import base64
import re
from google.genai import types
from pydantic import BaseModel, Field

client = None   # This will be set from main.py


class IdentifyResponse(BaseModel):
    medicineName: str = Field(description="Name of the medicine.")
    rawText: str = Field(description="Visible text extracted from the package.")
    isMedicine: bool = Field(description="True if the image contains medicine packaging, False otherwise.")


class ExplainResponse(BaseModel):
    purpose: str
    dosageNote: str
    precautions: list[str]
    disclaimer: str


def identify_medicine(base64_image: str) -> IdentifyResponse:
    """
    Identifies medicine from base64 image using Gemini vision model.
    """
    if client is None:
        raise ValueError("Gemini client is not initialized")

    # Remove data URI prefix if present
    match = re.match(r"^data:image/.+;base64,(.*)$", base64_image)
    if match:
        base64_image = match.group(1)

    image_bytes = base64.b64decode(base64_image)

    prompt = (
        "Analyze this image carefully. First, determine if this is a photograph of medicine packaging, pills, tablets, or pharmaceutical products. "
        "If it is NOT medicine (e.g., food, animals, people, random objects, documents), set isMedicine to false and medicineName to 'Not Medicine'. "
        "If it IS medicine packaging: identify the medicine name and extract any visible text such as composition, manufacturer, batch number, and expiry date. "
        "If you cannot confidently identify the specific medicine name, return 'Unknown' as the name but still extract any visible text and set isMedicine to true."
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            prompt,
            types.Part.from_bytes(
                data=image_bytes,
                mime_type="image/jpeg"
            )
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=IdentifyResponse,
        )
    )

    return response.parsed


def explain_medicine(medicine_name: str, raw_text: str, language: str = "English") -> ExplainResponse:
    """
    Uses Gemini to explain medicine usage, dosage, precautions in plain language.
    """
    if client is None:
        raise ValueError("Gemini client is not initialized")

    prompt = f"""
Explain this medicine in plain, non-technical language suitable for reading aloud to someone with no medical background.

Medicine Name: {medicine_name}
Raw Extracted Text: {raw_text}

IMPORTANT: Provide the explanation in {language} language.

Follow these requirements for the output:
- purpose: 1-2 sentences on what it's generally used for.
- dosageNote: describe GENERAL usage pattern only in vague terms (e.g. 'typically taken a few times a day as directed'). NEVER include exact milligram amounts, exact frequency numbers, or maximum daily limits. This is not a prescribing tool and must not sound like one.
- precautions: 2-4 short bullet points, general safety notes only (e.g. interactions to be aware of, when to avoid, when to see a doctor).
- disclaimer: always some variant of 'This is general information only. Please consult a doctor or pharmacist before use.'

All text must be in {language}.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ExplainResponse,
        )
    )

    return response.parsed
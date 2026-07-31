import base64
import re
from pydantic import BaseModel, Field

class IdentifyResponse(BaseModel):
    medicineName: str = Field(description="The identified medicine name, or 'Unknown' if not identifiable.")
    rawText: str = Field(description="All extracted visible text from the packaging.")

class ExplainResponse(BaseModel):
    purpose: str = Field(description="1-2 sentences explaining what the medicine is generally used for in simple, plain language.")
    dosageNote: str = Field(description="General usage pattern in vague terms only. Do NOT include exact milligram amounts or exact frequencies.")
    precautions: list[str] = Field(description="2-4 short bullet points of general safety/precautions.")
    disclaimer: str = Field(description="Standard health safety disclaimer advising consulting a doctor/pharmacist.")

def identify_medicine(base64_image: str) -> IdentifyResponse:
    """
    Mock implementation that returns realistic medicine identification.
    For demo purposes - returns plausible responses based on common medicines.
    """
    # Strip data URI prefix if present
    match = re.match(r"^data:(image/[a-zA-Z0-9+.-]+);base64,(.*)$", base64_image)
    if match:
        data_str = match.group(2)
    else:
        data_str = base64_image
    
    # Use image data hash to consistently return same medicine for same image
    image_hash = hash(data_str[:50]) % 5
    
    mock_medicines = [
        {
            "medicineName": "Paracetamol",
            "rawText": "PARACETAMOL TABLETS 500MG\\nContains: Paracetamol 500mg\\nMfg: Generic Pharma Ltd\\nExp: 12/2025\\nBatch: PAR5002024"
        },
        {
            "medicineName": "Ibuprofen",
            "rawText": "IBUPROFEN 400MG TABLETS\\nActive Ingredient: Ibuprofen 400mg\\nManufacturer: HealthCare Inc\\nExpiry Date: 06/2026\\nBatch No: IBU4001523"
        },
        {
            "medicineName": "Amoxicillin",
            "rawText": "AMOXICILLIN CAPSULES 250MG\\nContains: Amoxicillin Trihydrate 250mg\\nMfg Date: 01/2024\\nExp Date: 01/2027\\nBatch: AMX2502401"
        },
        {
            "medicineName": "Cetirizine",
            "rawText": "CETIRIZINE HYDROCHLORIDE 10MG\\nAntihistamine Tablets\\nManufactured by: AllergyMed Corp\\nExpiry: 09/2026\\nBatch: CET1002345"
        },
        {
            "medicineName": "Metformin",
            "rawText": "METFORMIN HCL 500MG TABLETS\\nDiabetes Medication\\nMfr: DiabetesCare Pharma\\nExp: 03/2027\\nLot: MET5006789"
        }
    ]
    
    response = mock_medicines[image_hash]
    return IdentifyResponse(**response)

def explain_medicine(medicine_name: str, raw_text: str) -> ExplainResponse:
    """
    Mock implementation that returns realistic medicine explanations.
    For demo purposes - returns appropriate information for common medicines.
    """
    # Database of common medicine explanations
    medicine_db = {
        "paracetamol": {
            "purpose": "Paracetamol is commonly used to relieve mild to moderate pain such as headaches, toothaches, and muscle aches. It also helps reduce fever.",
            "dosageNote": "Typically taken every 4 to 6 hours as needed. Do not exceed the recommended daily amount.",
            "precautions": [
                "Do not take with other medicines containing paracetamol to avoid overdose",
                "Avoid alcohol while taking this medicine as it may increase risk of liver damage",
                "Consult a doctor if pain persists for more than a few days",
                "Not suitable for people with severe liver problems"
            ]
        },
        "ibuprofen": {
            "purpose": "Ibuprofen is used to reduce pain, inflammation, and fever. It's effective for headaches, dental pain, menstrual cramps, and minor injuries.",
            "dosageNote": "Usually taken with food a few times daily as directed. Take the lowest effective dose for the shortest time needed.",
            "precautions": [
                "Take with food or milk to reduce stomach upset",
                "Avoid if you have stomach ulcers or severe heart problems",
                "May increase risk of heart attack or stroke with long-term use",
                "Consult a doctor before use if you're on blood thinners"
            ]
        },
        "amoxicillin": {
            "purpose": "Amoxicillin is an antibiotic used to treat bacterial infections such as ear infections, throat infections, pneumonia, and urinary tract infections.",
            "dosageNote": "Taken at regular intervals throughout the day as prescribed. Complete the full course even if you feel better.",
            "precautions": [
                "Finish the entire prescribed course to prevent antibiotic resistance",
                "May cause allergic reactions - stop and seek help if you develop a rash or difficulty breathing",
                "Can reduce effectiveness of birth control pills",
                "Inform your doctor if you have kidney problems"
            ]
        },
        "cetirizine": {
            "purpose": "Cetirizine is an antihistamine used to relieve allergy symptoms such as sneezing, runny nose, itchy or watery eyes, and itching of the nose or throat.",
            "dosageNote": "Usually taken once daily, with or without food. May cause drowsiness in some people.",
            "precautions": [
                "May cause drowsiness - avoid driving until you know how it affects you",
                "Avoid alcohol as it can increase drowsiness",
                "Use with caution if you have kidney problems",
                "Safe for most adults and children over certain ages"
            ]
        },
        "metformin": {
            "purpose": "Metformin is used to control high blood sugar in people with type 2 diabetes. It helps improve how your body uses insulin.",
            "dosageNote": "Taken with meals as directed by your doctor. Start with a low dose that may be gradually increased.",
            "precautions": [
                "Take with food to reduce stomach upset",
                "Monitor blood sugar levels regularly as advised",
                "Avoid excessive alcohol consumption",
                "Inform your doctor before any surgery or medical procedures"
            ]
        }
    }
    
    # Normalize medicine name for lookup
    normalized_name = medicine_name.lower().strip()
    
    # Find matching medicine in database
    for key, data in medicine_db.items():
        if key in normalized_name:
            return ExplainResponse(
                purpose=data["purpose"],
                dosageNote=data["dosageNote"],
                precautions=data["precautions"],
                disclaimer="This is general information only. Please consult a doctor or pharmacist before use."
            )
    
    # Default response for unknown medicines
    return ExplainResponse(
        purpose=f"{medicine_name} is a medication. For specific information about its use, please consult a healthcare professional.",
        dosageNote="Follow the dosage instructions provided by your doctor or pharmacist. Do not exceed the recommended dose.",
        precautions=[
            "Read the patient information leaflet carefully",
            "Store as directed on the packaging",
            "Keep out of reach of children",
            "Do not use after the expiry date"
        ],
        disclaimer="This is general information only. Please consult a doctor or pharmacist before use."
    )

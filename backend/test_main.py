import os
# Mock the API key before importing main to prevent the Google GenAI SDK from raising an error
os.environ["GEMINI_API_KEY"] = "mock_api_key_for_testing"

from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app
import services

client = TestClient(app)

def test_health_check():
    """Verify that the health check endpoint returns status ok."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

@patch("services.identify_medicine")
def test_identify_endpoint(mock_identify):
    """Verify that the identify endpoint properly calls service logic and maps returns."""
    # Setup mock return value
    from services import IdentifyResponse
    mock_identify.return_value = IdentifyResponse(
        medicineName="Ibuprofen",
        rawText="Ibuprofen Tablets 200mg"
    )
    
    # Run request
    response = client.post(
        "/api/identify",
        json={"image": "data:image/jpeg;base64,aGVsbG8="}
    )
    
    assert response.status_code == 200
    assert response.json() == {
        "medicineName": "Ibuprofen",
        "rawText": "Ibuprofen Tablets 200mg"
    }
    mock_identify.assert_called_once_with("data:image/jpeg;base64,aGVsbG8=")

@patch("services.explain_medicine")
def test_explain_endpoint(mock_explain):
    """Verify that the explain endpoint properly calls explanation service logic and maps returns."""
    from services import ExplainResponse
    mock_explain.return_value = ExplainResponse(
        purpose="Used to relieve pain.",
        dosageNote="Typically taken as directed.",
        precautions=["Take with food."],
        disclaimer="Consult a doctor."
    )
    
    response = client.post(
        "/api/explain",
        json={"medicineName": "Ibuprofen", "rawText": "Ibuprofen 200mg"}
    )
    
    assert response.status_code == 200
    assert response.json() == {
        "purpose": "Used to relieve pain.",
        "dosageNote": "Typically taken as directed.",
        "precautions": ["Take with food."],
        "disclaimer": "Consult a doctor."
    }
    mock_explain.assert_called_once_with("Ibuprofen", "Ibuprofen 200mg")

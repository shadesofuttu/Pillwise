import requests
import base64

# Test the health endpoint
print("Testing health endpoint...")
response = requests.get("http://localhost:8000/health")
print(f"Health check: {response.status_code} - {response.json()}")

# Test identify endpoint with a simple base64 encoded image
print("\nTesting identify endpoint...")
# Using a minimal valid JPEG base64 (1x1 pixel red image)
test_image = "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="

try:
    response = requests.post(
        "http://localhost:8000/api/identify",
        json={"image": test_image},
        timeout=30
    )
    print(f"Identify endpoint: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")

# Test explain endpoint
print("\nTesting explain endpoint...")
try:
    response = requests.post(
        "http://localhost:8000/api/explain",
        json={
            "medicineName": "Paracetamol",
            "rawText": "Paracetamol Tablets 500mg"
        },
        timeout=30
    )
    print(f"Explain endpoint: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
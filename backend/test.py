import os
import requests
import json
from pathlib import Path

# Use the standard API endpoint
API_URL = "https://router.huggingface.co/hf-inference/models/umm-maybe/AI-image-detector"

# Check if token exists
hf_token = os.getenv('HF_TOKEN')
if not hf_token:
    print("Error: HF_TOKEN environment variable is not set")
    exit(1)

headers = {
    "Authorization": f"Bearer {hf_token}",
}

def query(filename):
    # Get the directory where this script is located
    script_dir = Path(__file__).parent
    # Construct full path to the image file
    image_path = script_dir / filename
    
    # Check if file exists
    if not image_path.exists():
        raise FileNotFoundError(f"File not found: {image_path}")
    
    # Read image file as binary
    print(f"Reading image from: {image_path}")
    with open(image_path, "rb") as f:
        data = f.read()
    print(f"Image size: {len(data)} bytes")
    
    # Make API request
    response = requests.post(
        API_URL,
        headers={"Content-Type": "image/jpeg", **headers},
        data=data
    )
    
    # Check if request was successful
    if not response.ok:
        print(f"Error: API returned status {response.status_code}")
        print(f"Response: {response.text}")
        response.raise_for_status()
    
    # Try to parse JSON response
    try:
        return response.json()
    except json.JSONDecodeError:
        print(f"Error: Response is not valid JSON")
        print(f"Response text: {response.text}")
        raise

# Run the query
try:
    output = query("cats.jpg")
    print("Success! Output:")
    print(json.dumps(output, indent=2))
except Exception as e:
    print(f"Error: {e}")
    exit(1)
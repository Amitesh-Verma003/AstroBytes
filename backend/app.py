import os
import time
import google.generativeai as genai
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from google.api_core import exceptions

# 1. Setup
load_dotenv()
app = Flask(__name__)
CORS(app)

# 2. Configure API
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("❌ ERROR: GEMINI_API_KEY not found. Please check your .env file.")
else:
    genai.configure(api_key=api_key)

# List of models to try in order of preference
MODELS_TO_TRY = [
    "gemini-2.5-flash-lite",   # Newest high-throughput model
    "gemini-2.5-flash",        # Current stable workhorse
    "gemini-2.0-flash-001",    # Versioned stable 2.0
    "gemini-1.5-flash-8b",     # Fast, small model often under-utilized
    "gemini-3-flash-preview"   # Fallback to next-gen preview if others fail
]

def generate_with_fallback(prompt):
    for model_name in MODELS_TO_TRY:
        print(f"🔄 Attempting to generate with: {model_name}...")
        
        try:
            model = genai.GenerativeModel(
                model_name,
                generation_config={"response_mime_type": "application/json"}
            )
            response = model.generate_content(prompt)
            print(f"✅ Success with {model_name}!")
            return response.text
            
        except exceptions.ResourceExhausted:
            print(f"⚠️ Quota exceeded for {model_name}. Switching to next model...")
            time.sleep(1) # Short pause before next model
            continue
            
        except Exception as e:
            print(f"❌ Error with {model_name}: {e}")
            continue
            
    print("❌ All models failed.")
    return None

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "AI Security Backend"})

@app.route('/api/generate-cases', methods=['POST'])
def generate_cases():
    data = request.json
    req_text = data.get("requirement", "")

    if not req_text:
        return jsonify({"error": "No requirement provided"}), 400

    system_instruction = (
        "You are a Security QA Expert. "
        f"Analyze this requirement: '{req_text}'. "
        "Generate 3 SQL Injection (SQLi) and 3 Broken Object Level Authorization (BOLA) test cases. "
        "Return ONLY a JSON array with keys: id, type, test_scenario, payload, expected_result. "
        "Do not include markdown formatting (like ```json)."
    )

    result_json = generate_with_fallback(system_instruction)

    if result_json:
        # Clean up potential markdown formatting if the model ignored instructions
        clean_json = result_json.replace("```json", "").replace("```", "").strip()
        return clean_json, 200, {'Content-Type': 'application/json'}
    else:
        return jsonify({"error": "All AI models failed. Check backend console."}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port)

from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()

app = Flask(__name__)
# Allow requests from frontend origin
CORS(app) 

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Warning: GEMINI_API_KEY not found in environment variables.")
else:
    genai.configure(api_key=api_key)

def get_gemini_model():
    return genai.GenerativeModel('gemini-2.0-flash-lite', generation_config={"response_mime_type": "application/json"})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "Backend API"})

@app.route('/api/generate-cases', methods=['POST'])
def generate_cases():
    data = request.json
    requirement = data.get('requirement')

    if not requirement:
        return jsonify({"error": "Requirement text is missing"}), 400

    if not api_key:
        return jsonify({"error": "Server configuration error: Gemini API Key missing"}), 500

    try:
        model = get_gemini_model()
        
        prompt = f"""
        You are an expert security engineer. Analyze the following software requirement and generate specific security test cases.
        
        Requirement: "{requirement}"
        
        Task:
        1. Generate 3 SQL Injection (SQLi) test cases.
        2. Generate 3 Broken Object Level Authorization (BOLA) test cases.
        
        Return the output strictly as a JSON object with the following structure:
        {{
          "test_cases": {{
            "sql_injection": [
              {{ "test_case_id": "SQLI-1", "title": "...", "description": "...", "payload": "...", "expected_result": "..." }},
              ...
            ],
            "bola": [
              {{ "test_case_id": "BOLA-1", "title": "...", "description": "...", "payload": "...", "expected_result": "..." }},
              ...
            ]
          }}
        }}
        """

        response = model.generate_content(prompt)
        
        # Parse the response text as JSON to ensure it's valid before returning
        result = json.loads(response.text)
        return jsonify(result)

    except Exception as e:
        print(f"Error generating content: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port)

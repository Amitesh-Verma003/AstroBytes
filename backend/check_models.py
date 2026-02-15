import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load your API key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Error: API Key not found in .env file")
else:
    print(f"✅ Key found: {api_key[:5]}... (hidden)")
    genai.configure(api_key=api_key)

    print("\n🔍 Scanning for available models...")
    try:
        count = 0
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"   🔓 ACCESS GRANTED: {m.name}")
                count += 1
        
        if count == 0:
            print("\n⚠️ No models found. Your API key might be inactive or restricted.")
    except Exception as e:
        print(f"\n❌ Scan Failed: {e}")
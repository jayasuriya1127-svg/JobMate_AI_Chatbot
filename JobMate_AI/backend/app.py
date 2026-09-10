import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY) if API_KEY else None

SYSTEM_PROMPT = """You are JobMate AI, a friendly career assistant.
Help users with job roles, resume improvement, interview questions, skills,
career roadmaps, job-search strategies, and professional communication.
Give practical, beginner-friendly answers. Do not claim to have real-time
job listings unless the user provides a listing or asks for general guidance.
"""

@app.get("/")
def home():
    return jsonify({"message": "JobMate AI Backend is running 🚀"})

@app.get("/health")
def health():
    return jsonify({"status": "ok", "gemini_configured": bool(API_KEY)})

@app.post("/chat")
def chat():
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()

    if not message:
        return jsonify({"error": "Message is required"}), 400

    if not client:
        return jsonify({"error": "GEMINI_API_KEY is not configured in .env"}), 500

    try:
        prompt = SYSTEM_PROMPT + "\n\nUser: " + message
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return jsonify({"reply": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

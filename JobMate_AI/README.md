# JobMate AI Chatbot

A simple AI job assistant using HTML, CSS, JavaScript, Flask and Gemini API.
No Firebase or database is required.

## Run

1. Open PowerShell in `backend`
2. Create/activate a virtual environment if desired:
   `python -m venv venv`
   `venv\Scripts\activate`
3. Install:
   `pip install -r requirements.txt`
4. Put your Gemini API key in `.env`:
   `GEMINI_API_KEY=YOUR_API_KEY`
5. Start:
   `python app.py`
6. Open `frontend/index.html` with Live Server, or run:
   `python -m http.server 5500` from the `frontend` folder.

Backend runs on http://127.0.0.1:5000

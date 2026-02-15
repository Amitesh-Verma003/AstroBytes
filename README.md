# AI Security Test Case Generator

## Project Overview
A full-stack application that accepts user-defined requirements and generates comprehensive security test cases using Google Gemini 1.5 Flash.

## Structure
- `backend/`: Python Flask API
- `frontend/`: React + Vite frontend

## Prerequisites
- **Python 3.8+**: Ensure python is installed and added to PATH.
- **Node.js & npm**: Required for the frontend. Download from [nodejs.org](https://nodejs.org/).

## Setup Instructions

### 1. Backend Setup
Navigate to the `backend` folder and install dependencies:

```bash
cd backend
# Create a virtual environment (optional but recommended)
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

**Configuration**:
- Copy `backend/.env.example` to `backend/.env`.
- Add your `GEMINI_API_KEY` to `backend/.env`.

### 2. Frontend Setup
Navigate to the `frontend` folder and install dependencies:

```bash
cd frontend
npm install
```

## Running the Application

### Option 1: Using the Startup Script (Windows)
Run the `start_dev.bat` file in the root directory. This will open two terminal windows: one for the backend and one for the frontend.

### Option 2: Manual Start

**Terminal 1 (Backend)**:
```bash
cd backend
python app.py
```
*Backend runs on http://localhost:5000*

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
```
*Frontend runs on http://localhost:5173*
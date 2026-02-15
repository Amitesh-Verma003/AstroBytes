@echo off
echo Starting AI Security Project...
echo make sure you have installed python and nodejs

start "Backend Server" cmd /k "cd backend && echo Installing deps... && pip install -r requirements.txt && python app.py"
start "Frontend Server" cmd /k "cd frontend && echo Installing deps... && call npm install && npm run dev"

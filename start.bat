@echo off
echo ==============================================
echo  Starting AI SDLC Analyst Servers
echo ==============================================

echo [1/2] Starting Backend Server on port 3001...
start "Backend API" cmd /k "cd backend && npm run dev"

echo [2/2] Starting Frontend App on port 3000...
start "Frontend UI" cmd /k "cd frontend-app && npm run dev"

echo.
echo Both services are starting in separate windows.
echo - Backend: http://localhost:3001
echo - Frontend: http://localhost:3000
echo.
echo You can close this window now.

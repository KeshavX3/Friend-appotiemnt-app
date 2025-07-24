@echo off
REM Start backend
start cmd /k "cd backend && npm run dev"
REM Start frontend
start cmd /k "cd frontend && npm run dev" 
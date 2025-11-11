@echo off
echo ========================================
echo   Starting Python Backend Server
echo   FastAPI + scikit-learn
echo ========================================
echo.

cd backend

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate

REM Check if requirements are installed
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    pip install -r requirements.txt
    echo.
)

echo Starting FastAPI server on http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
python app.py

pause

@echo off
setlocal
title Mazhi Sheti - Digital Agriculture Ecosystem

echo ===================================================================
echo             MAZHI SHETI (माझी शेती) - AGRI PLATFORM
echo ===================================================================
echo.

:: Verify Node.js availability
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not found on PATH.
    echo Please install Node.js from https://nodejs.org and re-run.
    echo.
    pause
    exit /b 1
)

:: Auto-install dependencies if node_modules is missing
if not exist "node_modules\" (
    echo [INFO] Node modules directory not found. Installing packages...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        echo.
        pause
        exit /b 1
    )
)

:: Ensure local environment configuration exists
if not exist ".env.local" (
    if exist ".env.example" (
        echo [INFO] Creating .env.local template from .env.example...
        copy ".env.example" ".env.local" >nul
    )
)

echo [INFO] Launching Mazhi Sheti server on http://localhost:3000
echo [INFO] Opening web browser...
echo.

:: Automatically open default browser after a brief delay
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

:: Launch Next.js dev server
call npm run dev

pause

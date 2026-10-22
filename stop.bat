@echo off
title Cyber Emerald Portfolio - Stop Server
cd /d "%~dp0"

echo ===================================================
echo   MEMATIKAN SERVER PORT 5173
echo ===================================================

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo [INFO] Menutup proses PID: %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo [OK] Server di port 5173 telah dimatikan.
echo ===================================================
timeout /t 3 >nul
exit

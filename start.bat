@echo off
title Cyber Emerald Portfolio - Local Server
cd /d "%~dp0"

echo ===================================================
echo   CYBER EMERALD PORTFOLIO // SERVER LOCAL
echo ===================================================
echo [INFO] Menyiapkan server lokal di http://127.0.0.1:5173/ ...

REM Periksa apakah dependencies sudah terinstal
if not exist "node_modules\" (
    echo [INFO] Menginstal dependensi awal...
    call npm install
)

REM Buka browser otomatis ke alamat lokal setelah 2 detik
start "" "http://127.0.0.1:5173/"

echo [OK] Menjalankan Vite Dev Server...
echo [PETUNJUK] Tekan CTRL + C di jendela ini untuk mematikan server.
echo ===================================================
echo.

npm run dev
pause

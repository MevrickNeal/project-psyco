@echo off
title Project Psyco: Momo and Lian
cd /d "%~dp0"

echo ========================================================
echo  STARTING PROJECT PSYCO: MOMO AND LIAN (DHAKA EDITION)
echo ========================================================
echo.

set AGY_NODE="C:\Users\Arena\AppData\Roaming\Antigravity\bin\agy-node.cmd"

if exist %AGY_NODE% (
    call %AGY_NODE% server.js
    goto end
)

where node >nul 2>nul
if %errorlevel% equ 0 (
    node server.js
    goto end
)

echo Node not found, starting PowerShell server fallback...
powershell -ExecutionPolicy Bypass -File "%~dp0start_game_server.ps1"

:end
pause

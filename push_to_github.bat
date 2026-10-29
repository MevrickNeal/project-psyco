@echo off
title Push Project Psyco to GitHub
cd /d "%~dp0"
echo ========================================================
echo  PUSHING PROJECT PSYCO v2.0.0 TO GITHUB
echo  Repo: https://github.com/MevrickNeal/project-psyco
echo ========================================================
echo.
"C:\Users\Arena\Downloads\Personal Documents\Hardware Project\Heartbeat Sensor\tools\git\cmd\git.exe" push origin main --tags
echo.
echo If prompted, click 'Sign in with your browser' or enter your GitHub token.
echo.
pause

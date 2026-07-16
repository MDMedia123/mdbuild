@echo off
cd /d "%~dp0"
echo Starting NCR Dashboard server on port 8080...
echo Open your browser to: http://localhost:8080
echo.
python -m http.server 8080
pause

@echo off
cd /d "%~dp0"
echo Starting NCR Dashboard server on port 7655...
echo Open your browser to: http://localhost:7655
echo.
python -m http.server 7655
pause

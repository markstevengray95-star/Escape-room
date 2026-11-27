@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0blender\generate-windows.ps1" -Script generate_characters.py
if errorlevel 1 (
 echo Character generation failed. Read the error above.
) else (
 echo Success. Commit public\models\characters in GitHub Desktop.
)
pause

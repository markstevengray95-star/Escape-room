@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0blender\generate-windows.ps1" -Script generate_bio.py
if errorlevel 1 (
 echo Biology facility generation failed. Read the error above.
) else (
 echo Success. Commit public\models\bio in GitHub Desktop.
)
pause

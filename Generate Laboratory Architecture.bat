@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0blender\generate-windows.ps1" -Script generate_architecture.py
if errorlevel 1 (
 echo Architecture generation failed. Read the error above.
) else (
 echo Success. Commit public\models\lab-architecture in GitHub Desktop.
)
pause

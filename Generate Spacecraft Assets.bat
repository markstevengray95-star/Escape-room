@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0blender\generate-windows.ps1" -Script generate_space.py
if errorlevel 1 (
 echo Spacecraft generation failed. Read the error above.
) else (
 echo Success. Commit public\models\space in GitHub Desktop.
)
pause

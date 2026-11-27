@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0blender\generate-windows.ps1" -Script generate_power.py
if errorlevel 1 (
 echo Power station generation failed. Read the error above.
) else (
 echo Success. Commit public\models\blackout in GitHub Desktop.
)
pause

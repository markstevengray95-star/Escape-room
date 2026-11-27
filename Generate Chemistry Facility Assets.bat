@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0blender\generate-windows.ps1" -Script generate_chem.py
if errorlevel 1 (
 echo Chemistry facility generation failed. Read the error above.
) else (
 echo Success. Commit public\models\chem in GitHub Desktop.
)
pause

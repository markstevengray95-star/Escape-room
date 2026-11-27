@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0blender\generate-windows.ps1"
if errorlevel 1 (
 echo Asset generation failed. Read the error above.
) else (
 echo Success. Commit public\models\lab in GitHub Desktop.
)
pause

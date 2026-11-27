param([ValidateSet('generate_lab.py','generate_architecture.py','generate_space.py','generate_bio.py')][string]$Script='generate_lab.py')
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$exe = $env:BLENDER_EXE
if (-not $exe) {
  $cmd = Get-Command blender.exe -ErrorAction SilentlyContinue
  if ($cmd) { $exe = $cmd.Source }
}
if (-not $exe) {
  $install = Join-Path $env:ProgramFiles "Blender Foundation"
  if (Test-Path $install) {
    $exe = Get-ChildItem $install -Directory | Sort-Object Name -Descending | ForEach-Object { Join-Path $_.FullName "blender.exe" } | Where-Object { Test-Path $_ } | Select-Object -First 1
  }
}
if (-not $exe -or -not (Test-Path $exe)) {
  Write-Host "Blender not found. Set BLENDER_EXE to the full path of blender.exe." -ForegroundColor Red
  exit 1
}
Write-Host "Using Blender: $exe"
& $exe --background --factory-startup --python-exit-code 1 --python (Join-Path $PSScriptRoot $Script)
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

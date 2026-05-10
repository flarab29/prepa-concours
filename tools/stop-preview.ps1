$ErrorActionPreference = "Stop"

$repo = Resolve-Path (Join-Path $PSScriptRoot "..")
$statePath = Join-Path $repo ".tmp\web-preview-server.json"

if (-not (Test-Path $statePath)) {
    Write-Host "Aucun serveur de preview connu."
    exit 0
}

$state = Get-Content -Raw $statePath | ConvertFrom-Json
$process = Get-Process -Id ([int]$state.pid) -ErrorAction SilentlyContinue
if ($process) {
    Stop-Process -Id ([int]$state.pid) -Force
    Write-Host "Serveur de preview arrete."
} else {
    Write-Host "Le serveur de preview etait deja arrete."
}

Remove-Item -LiteralPath $statePath -Force -ErrorAction SilentlyContinue

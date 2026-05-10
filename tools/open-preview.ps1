$ErrorActionPreference = "Stop"

$repo = Resolve-Path (Join-Path $PSScriptRoot "..")
$stateDir = Join-Path $repo ".tmp"
$statePath = Join-Path $stateDir "web-preview-server.json"
if (-not (Test-Path $stateDir)) {
    New-Item -ItemType Directory -Path $stateDir | Out-Null
}

function Open-PreviewUrl([int]$port) {
    $url = "http://127.0.0.1:$port/index.html"
    Start-Process $url
    Write-Host "Preview ouverte : $url"
}

if (Test-Path $statePath) {
    try {
        $state = Get-Content -Raw $statePath | ConvertFrom-Json
        $existing = Get-Process -Id ([int]$state.pid) -ErrorAction SilentlyContinue
        if ($existing) {
            Open-PreviewUrl ([int]$state.port)
            exit 0
        }
    } catch {
        Remove-Item -LiteralPath $statePath -Force -ErrorAction SilentlyContinue
    }
}

function Test-PortFree([int]$port) {
    $listener = $null
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
        $listener.Start()
        return $true
    } catch {
        return $false
    } finally {
        if ($listener) { $listener.Stop() }
    }
}

$port = 8000
while ($port -lt 8050 -and -not (Test-PortFree $port)) {
    $port++
}
if ($port -ge 8050) {
    throw "Aucun port libre trouve entre 8000 et 8049."
}

$python = $null
$args = $null
if (Get-Command py -ErrorAction SilentlyContinue) {
    $python = "py"
    $args = @("-3", "-m", "http.server", "$port", "--bind", "127.0.0.1")
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    $python = "python"
    $args = @("-m", "http.server", "$port", "--bind", "127.0.0.1")
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    $python = "python3"
    $args = @("-m", "http.server", "$port", "--bind", "127.0.0.1")
}

if (-not $python) {
    throw "Python est introuvable. Installe Python, ou lance manuellement un serveur local depuis ce dossier."
}

$process = Start-Process -FilePath $python -ArgumentList $args -WorkingDirectory $repo -WindowStyle Hidden -PassThru
@{ pid = $process.Id; port = $port; startedAt = (Get-Date).ToString("s") } |
    ConvertTo-Json |
    Set-Content -Path $statePath -Encoding UTF8

Start-Sleep -Milliseconds 700
Open-PreviewUrl $port

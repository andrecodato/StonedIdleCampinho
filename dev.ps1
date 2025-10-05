# Script para iniciar Frontend e Backend em desenvolvimento
# Execute com: .\dev.ps1

Write-Host "🌿 Iniciando Stoned Idle Game em modo desenvolvimento..." -ForegroundColor Green
Write-Host ""

# Verificar se Go está instalado
try {
    go version | Out-Null
    $goInstalled = $true
} catch {
    $goInstalled = $false
}

# Verificar se Node.js está instalado
try {
    node --version | Out-Null
    $nodeInstalled = $true
} catch {
    $nodeInstalled = $false
}

if (-not $nodeInstalled) {
    Write-Host "❌ Node.js não encontrado. Instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

if (-not $goInstalled) {
    Write-Host "⚠️  Go não encontrado. O backend não será iniciado." -ForegroundColor Yellow
    Write-Host "📥 Instale o Go em: https://golang.org/dl/" -ForegroundColor Yellow
    Write-Host ""
}

# Iniciar Frontend
Write-Host "🚀 Iniciando Frontend (Next.js)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'frontend'; npm run dev"

Start-Sleep -Seconds 2

# Iniciar Backend (se Go estiver instalado)
if ($goInstalled) {
    Write-Host "🔧 Iniciando Backend (Go)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend'; go mod tidy; go run ."
} else {
    Write-Host "⏭️  Pulando backend (Go não instalado)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Serviços iniciados!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor White
if ($goInstalled) {
    Write-Host "🔌 Backend:  http://localhost:8080" -ForegroundColor White
}
Write-Host ""
Write-Host "⚠️  Para parar os serviços, feche as janelas do terminal que abriram." -ForegroundColor Yellow
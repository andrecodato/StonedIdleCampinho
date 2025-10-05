@echo off
chcp 65001 >nul

echo 🌿 Iniciando Stoned Idle Game em modo desenvolvimento...
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado. Instale o Node.js primeiro.
    pause
    exit /b 1
)

REM Verificar se Go está instalado
go version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Go não encontrado. O backend não será iniciado.
    echo 📥 Instale o Go em: https://golang.org/dl/
    echo.
    set GO_INSTALLED=false
) else (
    set GO_INSTALLED=true
)

REM Iniciar Frontend
echo 🚀 Iniciando Frontend (Next.js)...
start "Frontend - Next.js" cmd /k "cd frontend && npm run dev"

timeout /t 2 /nobreak >nul

REM Iniciar Backend (se Go estiver instalado)
if "%GO_INSTALLED%"=="true" (
    echo 🔧 Iniciando Backend (Go)...
    start "Backend - Go" cmd /k "cd backend && go mod tidy && go run ."
) else (
    echo ⏭️  Pulando backend (Go não instalado)
)

echo.
echo ✅ Serviços iniciados!
echo 📱 Frontend: http://localhost:3000
if "%GO_INSTALLED%"=="true" (
    echo 🔌 Backend:  http://localhost:8080
)
echo.
echo ⚠️  Para parar os serviços, feche as janelas que abriram.
echo.
pause
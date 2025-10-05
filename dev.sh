#!/bin/bash

# Script para iniciar Frontend e Backend em desenvolvimento
# Execute com: ./dev.sh

echo "🌿 Iniciando Stoned Idle Game em modo desenvolvimento..."
echo ""

# Verificar se Go está instalado
if command -v go &> /dev/null; then
    GO_INSTALLED=true
else
    GO_INSTALLED=false
fi

# Verificar se Node.js está instalado
if command -v node &> /dev/null; then
    NODE_INSTALLED=true
else
    NODE_INSTALLED=false
fi

if [ "$NODE_INSTALLED" = false ]; then
    echo "❌ Node.js não encontrado. Instale o Node.js primeiro."
    exit 1
fi

if [ "$GO_INSTALLED" = false ]; then
    echo "⚠️  Go não encontrado. O backend não será iniciado."
    echo "📥 Instale o Go em: https://golang.org/dl/"
    echo ""
fi

# Função para cleanup ao sair
cleanup() {
    echo ""
    echo "🛑 Parando serviços..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Iniciar Frontend
echo "🚀 Iniciando Frontend (Next.js)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

sleep 2

# Iniciar Backend (se Go estiver instalado)
if [ "$GO_INSTALLED" = true ]; then
    echo "🔧 Iniciando Backend (Go)..."
    cd backend
    go mod tidy
    go run . &
    BACKEND_PID=$!
    cd ..
else
    echo "⏭️  Pulando backend (Go não instalado)"
fi

echo ""
echo "✅ Serviços iniciados!"
echo "📱 Frontend: http://localhost:3000"
if [ "$GO_INSTALLED" = true ]; then
    echo "🔌 Backend:  http://localhost:8080"
fi
echo ""
echo "⚠️  Pressione Ctrl+C para parar todos os serviços."

# Aguardar até o usuário pressionar Ctrl+C
wait
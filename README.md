# 🌿 Stoned Idle Game

Um Idle Game temático para maiores de 18 anos, com progressão inspirada na cultura cannabis.

## 🔧 Stack Tecnológica

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: Golang + Gorilla Mux
- **Banco**: PostgreSQL
- **Autenticação**: JWT (MVP: apenas nickname)

## 🎮 Mecânicas do Jogo

### Recurso Principal
- **stonedPoints**: Pontos acumulados pelo jogador

### Progressão de Strains
1. Prensado Mofado (1 ponto/tragada)
2. Prensado Molhado (2 pontos/tragada)
3. Prensadinho (5 pontos/tragada)
4. Prensadinho Verdinho (15 pontos/tragada)
5. Prensadinho Cheiroso (30 pontos/tragada)
6. Capulho 2x1 (60 pontos/tragada)
7. Capulho 5x1 (120 pontos/tragada)
8. Somango (300 pontos/tragada)
9. Manga Rosa (600 pontos/tragada)

## 🚀 Como Executar

### 🎯 Modo Rápido (Recomendado)
Use os scripts para iniciar frontend e backend automaticamente:

**Windows (PowerShell):**
```powershell
.\dev.ps1
```

**Windows (Command Prompt):**
```cmd
dev.bat
```

**Linux/Mac:**
```bash
chmod +x dev.sh
./dev.sh
```

### 📋 Modo Manual

**Frontend (Next.js):**
```bash
cd frontend
npm install
npm run dev
```
Acesse: http://localhost:3000

**Backend (Golang):**
```bash
cd backend
go mod tidy
go run .
```
Acesse: http://localhost:8080

## 📁 Estrutura do Projeto

```
StonedIdle/
├── frontend/           # Aplicação Next.js
│   ├── src/
│   │   ├── app/        # App Router do Next.js
│   │   └── components/ # Componentes React
│   └── package.json
├── backend/            # API em Golang
│   ├── main.go         # Servidor principal
│   ├── handlers.go     # Handlers HTTP
│   └── go.mod
└── README.md
```

## 🔌 API Endpoints

### Autenticação
- `POST /auth/login` - Login com nickname

### Player
- `GET /player/state` - Estado atual do jogador
- `POST /player/progress` - Atualizar pontos

### Health
- `GET /health` - Status da API

## 🗂️ Status Atual (MVP)

### ✅ Implementado
- [x] Tela de login funcional
- [x] Sistema completo de backend (9 endpoints)
- [x] Integração frontend-backend funcionando
- [x] Sistema de pontuação real-time
- [x] Sistema completo de strains (9 diferentes)
- [x] Sistema de upgrades por strain
- [x] Loja de strains com compra/troca
- [x] Sistema passivo para strains avançadas
- [x] Layout moderno inspirado em Cannabis Cultivator
- [x] Painel de recursos (Buds, Plantas)
- [x] Sistema de cooldown e progressão
- [x] Animações e sistema de partículas
- [x] Interface responsiva
- [x] Scripts de desenvolvimento automático

### 🔄 Em Desenvolvimento
- [ ] Cards de upgrades funcionais (Sistema de Irrigação, Solo Premium, etc.)
- [ ] Sistema de recursos avançado (Água, Luz Solar)
- [ ] Persistência em banco de dados PostgreSQL

### 📋 Próximos Passos
1. Implementar funcionalidade dos cards de upgrade
2. Sistema de recursos (Água, Luz Solar) funcional
3. Configurar PostgreSQL
4. Autenticação JWT completa
5. Sistema de conquistas
6. Progressão offline
7. Sistema de ranking/multiplayer

## ⚠️ Importante

- Público-alvo: +18 anos
- Tom: Humor leve e satírico
- Sem apologia direta ao uso de substâncias
- Foco na mecânica de jogo idle/incremental

## 🤝 Contribuindo

1. Clone o repositório
2. Configure o ambiente local
3. Faça suas alterações
4. Teste localmente
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para a comunidade gamer +18**
package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	// Carregar variáveis de ambiente
	if err := godotenv.Load(); err != nil {
		log.Println("Arquivo .env não encontrado, usando variáveis de sistema")
	}

	// Carregar dados salvos
	log.Println("📂 Carregando dados salvos...")
	if err := LoadPlayersFromFile(); err != nil {
		log.Printf("⚠️ Erro ao carregar dados: %v", err)
	}

	// Iniciar auto-save em background (salva a cada 30 segundos)
	go AutoSave(30 * time.Second)
	log.Println("💾 Auto-save iniciado (intervalo: 30s)")

	// Configurar salvamento ao encerrar o servidor
	setupGracefulShutdown()

	// Inicializar banco de dados
	// TODO: Implementar conexão com PostgreSQL
	
	// Configurar rotas
	router := mux.NewRouter()
	
	// Middleware CORS
	router.Use(corsMiddleware)
	
	// Rotas de autenticação
	router.HandleFunc("/auth/login", loginHandler).Methods("POST", "OPTIONS")
	
	// Rotas do player
	router.HandleFunc("/player/state", getPlayerState).Methods("GET", "OPTIONS")
	router.HandleFunc("/player/progress", updateProgress).Methods("POST", "OPTIONS")
	router.HandleFunc("/player/upgrade", upgradeStrain).Methods("POST", "OPTIONS")
	
	// Rotas das strains
	router.HandleFunc("/strains/available", getAvailableStrains).Methods("GET", "OPTIONS")
	router.HandleFunc("/strains/buy", buyStrain).Methods("POST", "OPTIONS")
	router.HandleFunc("/strains/switch", switchStrain).Methods("POST", "OPTIONS")
	
	// Rotas de cultivo
	router.HandleFunc("/cultivo/slots", getCultivoSlots).Methods("GET", "OPTIONS")
	router.HandleFunc("/cultivo/slots", saveCultivoSlots).Methods("POST", "OPTIONS")
	router.HandleFunc("/cultivo/upgrades", getCultivoUpgrades).Methods("GET", "OPTIONS")
	router.HandleFunc("/cultivo/upgrades", saveCultivoUpgrades).Methods("POST", "OPTIONS")
	router.HandleFunc("/cultivo/stats", getCultivoStats).Methods("GET", "OPTIONS")
	router.HandleFunc("/cultivo/stats", saveCultivoStats).Methods("POST", "OPTIONS")
	
	// Rotas de inventário
	router.HandleFunc("/inventory", getInventory).Methods("GET", "OPTIONS")
	router.HandleFunc("/inventory", saveInventory).Methods("POST", "OPTIONS")
	router.HandleFunc("/inventory/add", addInventoryItem).Methods("POST", "OPTIONS")
	
	// Rota de health check
	router.HandleFunc("/health", healthHandler).Methods("GET")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🌿 Stoned Idle Backend rodando na porta %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

// Middleware CORS
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Health check
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "ok", "message": "Stoned Idle Backend is running"}`))
}
// setupGracefulShutdown salva dados quando o servidor é encerrado
func setupGracefulShutdown() {
sigChan := make(chan os.Signal, 1)
signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

go func() {
<-sigChan
log.Println("\n🛑 Encerrando servidor...")
log.Println("💾 Salvando dados antes de sair...")

if err := SavePlayersToFile(); err != nil {
log.Printf("❌ Erro ao salvar dados: %v", err)
} else {
log.Println("✅ Dados salvos com sucesso!")
}

os.Exit(0)
}()
}

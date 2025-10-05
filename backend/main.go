package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	// Carregar variáveis de ambiente
	if err := godotenv.Load(); err != nil {
		log.Println("Arquivo .env não encontrado, usando variáveis de sistema")
	}

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
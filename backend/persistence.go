package main

import (
	"encoding/json"
	"log"
	"os"
	"sync"
	"time"
)

const dataFile = "data/players.json"

var (
	saveMutex sync.Mutex
)

// SavePlayersToFile salva todos os jogadores em arquivo JSON
func SavePlayersToFile() error {
	saveMutex.Lock()
	defer saveMutex.Unlock()

	// Criar diretório data se não existir
	if err := os.MkdirAll("data", 0755); err != nil {
		return err
	}

	// Serializar tempPlayers para JSON (com formatação)
	data, err := json.MarshalIndent(tempPlayers, "", "  ")
	if err != nil {
		return err
	}

	// Escrever no arquivo temporário primeiro (para evitar corrupção)
	tempFile := dataFile + ".tmp"
	if err := os.WriteFile(tempFile, data, 0644); err != nil {
		return err
	}

	// Renomear arquivo temporário para arquivo final (operação atômica)
	return os.Rename(tempFile, dataFile)
}

// LoadPlayersFromFile carrega jogadores do arquivo JSON
func LoadPlayersFromFile() error {
	// Verificar se arquivo existe
	if _, err := os.Stat(dataFile); os.IsNotExist(err) {
		log.Println("Arquivo de dados não encontrado, iniciando com dados vazios")
		return nil // Não é erro, apenas não há dados salvos ainda
	}

	// Ler arquivo
	data, err := os.ReadFile(dataFile)
	if err != nil {
		return err
	}

	// Se arquivo estiver vazio, retornar
	if len(data) == 0 {
		log.Println("Arquivo de dados vazio, iniciando com dados vazios")
		return nil
	}

	// Deserializar JSON para tempPlayers
	if err := json.Unmarshal(data, &tempPlayers); err != nil {
		return err
	}

	log.Printf("✅ Carregados %d jogadores do arquivo", len(tempPlayers))
	return nil
}

// AutoSave salva automaticamente os dados a cada intervalo
func AutoSave(interval time.Duration) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for range ticker.C {
		if err := SavePlayersToFile(); err != nil {
			log.Printf("❌ Erro ao salvar dados automaticamente: %v", err)
		} else {
			log.Printf("💾 Auto-save: %d jogadores salvos", len(tempPlayers))
		}
	}
}

// SaveAsync salva os dados de forma assíncrona (não bloqueia)
func SaveAsync() {
	go func() {
		if err := SavePlayersToFile(); err != nil {
			log.Printf("❌ Erro ao salvar dados: %v", err)
		}
	}()
}

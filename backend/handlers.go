package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

// Estruturas de dados
type Player struct {
	ID            int                    `json:"id"`
	Nickname      string                 `json:"nickname"`
	Level         int                    `json:"level"`
	Experience    int                    `json:"experience"`
	StonedPoints  int                    `json:"stonedPoints"`
	CurrentStrain int                    `json:"currentStrain"`
	PlayerStrains map[int]*PlayerStrain  `json:"playerStrains"` // Strains específicas do player
	CultivoSlots  map[int]*PlantSlot     `json:"cultivoSlots"`  // Slots de cultivo
	CultivoUpgrades map[string]*CultivoUpgrade `json:"cultivoUpgrades"` // Upgrades de cultivo
	CultivoStats  *CultivoStats          `json:"cultivoStats"`  // Estatísticas de cultivo
	Inventory     map[string]*InventoryItem `json:"inventory"`     // Inventário do player
	CreatedAt     time.Time              `json:"createdAt"`
	UpdatedAt     time.Time              `json:"updatedAt"`
}

type PlayerStrain struct {
	ID               int     `json:"id"`
	Name             string  `json:"name"`
	Cost             int     `json:"cost"`
	Multiplier       int     `json:"multiplier"`
	BaseCooldown     float64 `json:"baseCooldown"`
	UpgradeLevel     int     `json:"upgradeLevel"`
	MaxUpgradeLevel  int     `json:"maxUpgradeLevel"`
	UpgradeCost      int     `json:"upgradeCost"`
	IsPassive        bool    `json:"isPassive"`
}

type Strain struct {
	ID               int     `json:"id"`
	Name             string  `json:"name"`
	Cost             int     `json:"cost"`
	Multiplier       int     `json:"multiplier"`
	BaseCooldown     float64 `json:"baseCooldown"`     // Cooldown base em segundos
	UpgradeLevel     int     `json:"upgradeLevel"`     // Nível de upgrade atual
	MaxUpgradeLevel  int     `json:"maxUpgradeLevel"`  // Máximo de upgrades
	UpgradeCost      int     `json:"upgradeCost"`      // Custo do próximo upgrade
	IsPassive        bool    `json:"isPassive"`        // Se é passivo ou não
}

// Estruturas para Cultivo
type PlantSlot struct {
	ID            int       `json:"id"`
	StrainID      string    `json:"strainId"`
	PlantedAt     int64     `json:"plantedAt"`     // Timestamp em ms
	LastWatered   int64     `json:"lastWatered"`   // Timestamp em ms
	CurrentStage  int       `json:"currentStage"`
	IsWilted      bool      `json:"isWilted"`
}

type CultivoUpgrade struct {
	ID       string `json:"id"`
	Level    int    `json:"level"`
}

type CultivoStats struct {
	TotalHarvests    int     `json:"totalHarvests"`
	TotalYield       float64 `json:"totalYield"`
	TotalWatering    int     `json:"totalWatering"`
	WiltedPlants     int     `json:"wiltedPlants"`
	PerfectHarvests  int     `json:"perfectHarvests"`
}

// Estruturas para Inventário
type InventoryItem struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Quantity    int    `json:"quantity"`
	Type        string `json:"type"`        // "flower", "seed", "extract", etc.
	Rarity      string `json:"rarity"`      // "common", "uncommon", "rare", "epic", "legendary"
	Icon        string `json:"icon"`
	StrainID    string `json:"strainId"`    // ID da strain relacionada
}

type LoginRequest struct {
	Nickname string `json:"nickname"`
}

type LoginResponse struct {
	PlayerID int    `json:"playerId"`
	Token    string `json:"token"`
	Message  string `json:"message"`
}

type PlayerStateResponse struct {
	Player Player  `json:"player"`
	Strain Strain  `json:"strain"`
}

type ProgressRequest struct {
	Points int `json:"points"`
}

// Dados base das strains (template)
var baseStrains = []Strain{
	{ID: 1, Name: "Prensado Mofado", Cost: 0, Multiplier: 1, BaseCooldown: 3.0, UpgradeLevel: 0, MaxUpgradeLevel: 10, UpgradeCost: 25, IsPassive: false},
	{ID: 2, Name: "Prensado Molhado", Cost: 50, Multiplier: 2, BaseCooldown: 2.5, UpgradeLevel: 0, MaxUpgradeLevel: 10, UpgradeCost: 100, IsPassive: false},
	{ID: 3, Name: "Prensadinho", Cost: 200, Multiplier: 5, BaseCooldown: 2.0, UpgradeLevel: 0, MaxUpgradeLevel: 10, UpgradeCost: 400, IsPassive: false},
	{ID: 4, Name: "Prensadinho Verdinho", Cost: 1000, Multiplier: 15, BaseCooldown: 1.8, UpgradeLevel: 0, MaxUpgradeLevel: 10, UpgradeCost: 2000, IsPassive: false},
	{ID: 5, Name: "Prensadinho Cheiroso", Cost: 5000, Multiplier: 30, BaseCooldown: 1.5, UpgradeLevel: 0, MaxUpgradeLevel: 10, UpgradeCost: 10000, IsPassive: false},
	{ID: 6, Name: "Capulho 2x1", Cost: 15000, Multiplier: 60, BaseCooldown: 1.2, UpgradeLevel: 0, MaxUpgradeLevel: 10, UpgradeCost: 30000, IsPassive: false},
	{ID: 7, Name: "Capulho 5x1", Cost: 50000, Multiplier: 120, BaseCooldown: 1.0, UpgradeLevel: 0, MaxUpgradeLevel: 10, UpgradeCost: 100000, IsPassive: false},
	{ID: 8, Name: "Somango", Cost: 150000, Multiplier: 300, BaseCooldown: 0.8, UpgradeLevel: 0, MaxUpgradeLevel: 10, UpgradeCost: 300000, IsPassive: false},
	{ID: 9, Name: "Manga Rosa", Cost: 500000, Multiplier: 600, BaseCooldown: 0.5, UpgradeLevel: 0, MaxUpgradeLevel: 10, UpgradeCost: 1000000, IsPassive: false},
}

// Função para criar strain do player baseada na strain base
func createPlayerStrain(baseStrain Strain) *PlayerStrain {
	return &PlayerStrain{
		ID:               baseStrain.ID,
		Name:             baseStrain.Name,
		Cost:             baseStrain.Cost,
		Multiplier:       baseStrain.Multiplier,
		BaseCooldown:     baseStrain.BaseCooldown,
		UpgradeLevel:     0, // SEMPRE começa no nível 0
		MaxUpgradeLevel:  baseStrain.MaxUpgradeLevel,
		UpgradeCost:      baseStrain.UpgradeCost,
		IsPassive:        false, // SEMPRE começa não passiva
	}
}

var tempPlayers = make(map[string]*Player)

// Handler de login
func loginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	if req.Nickname == "" {
		http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
		return
	}

	// Verificar se player já existe (temporário)
	player, exists := tempPlayers[req.Nickname]
	if !exists {
		// Criar novo player com strains inicializadas
		playerStrains := make(map[int]*PlayerStrain)
		// Inicializar apenas a primeira strain
		for _, baseStrain := range baseStrains {
			if baseStrain.ID == 1 { // Apenas Prensado Mofado inicialmente
				playerStrains[baseStrain.ID] = createPlayerStrain(baseStrain)
				break
			}
		}

		player = &Player{
			ID:            len(tempPlayers) + 1,
			Nickname:      req.Nickname,
			Level:         1,
			Experience:    0,
			StonedPoints:  0,
			CurrentStrain: 1, // Prensado Mofado
			PlayerStrains: playerStrains,
			CultivoSlots:  make(map[int]*PlantSlot),
			CultivoUpgrades: make(map[string]*CultivoUpgrade),
			CultivoStats:  &CultivoStats{},
			Inventory:     make(map[string]*InventoryItem),
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		}
		tempPlayers[req.Nickname] = player
		log.Printf("Novo player criado: %s", req.Nickname)
		SaveAsync() // Salvar novo jogador
	} else {
		log.Printf("Player existente logado: %s", req.Nickname)
	}

	// Gerar token temporário
	token := "temp-token-" + req.Nickname + "-" + time.Now().Format("20060102150405")

	response := LoginResponse{
		PlayerID: player.ID,
		Token:    token,
		Message:  "Login realizado com sucesso",
	}

	json.NewEncoder(w).Encode(response)
}

// Handler para obter estado do player
func getPlayerState(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// TODO: Implementar autenticação JWT
	nickname := r.URL.Query().Get("nickname")
	if nickname == "" {
		http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
		return
	}

	player, exists := tempPlayers[nickname]
	if !exists {
		http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
		return
	}

	// Buscar strain atual do player
	currentPlayerStrain, exists := player.PlayerStrains[player.CurrentStrain]
	if !exists {
		http.Error(w, `{"error": "Strain atual do player não encontrada"}`, http.StatusNotFound)
		return
	}

	// Calcular cooldown atual
	currentCooldown := getCurrentCooldownFromPlayerStrain(currentPlayerStrain)
	nextUpgradeCost := getNextUpgradeCostFromPlayerStrain(currentPlayerStrain)

	response := map[string]interface{}{
		"player": *player,
		"strain": *currentPlayerStrain,
		"currentCooldown": currentCooldown,
		"nextUpgradeCost": nextUpgradeCost,
		"canUpgrade": player.StonedPoints >= nextUpgradeCost && currentPlayerStrain.UpgradeLevel < currentPlayerStrain.MaxUpgradeLevel,
	}

	json.NewEncoder(w).Encode(response)
}

// Handler para atualizar progresso
func updateProgress(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// TODO: Implementar autenticação JWT
	nickname := r.URL.Query().Get("nickname")
	if nickname == "" {
		http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
		return
	}

	var req ProgressRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	player, exists := tempPlayers[nickname]
	if !exists {
		http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
		return
	}

	// Atualizar pontos
	player.StonedPoints += req.Points
	player.UpdatedAt = time.Now()

	log.Printf("Player %s agora tem %d pontos", nickname, player.StonedPoints)
	SaveAsync() // Salvar após ganhar pontos

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"newPoints": player.StonedPoints,
	})
}

// Função para calcular cooldown atual baseado no nível de upgrade (PlayerStrain)
func getCurrentCooldownFromPlayerStrain(strain *PlayerStrain) float64 {
	// Reduz 15% do cooldown por nível de upgrade
	reduction := float64(strain.UpgradeLevel) * 0.15
	currentCooldown := strain.BaseCooldown * (1.0 - reduction)
	
	// Mínimo de 0.1 segundos
	if currentCooldown < 0.1 {
		currentCooldown = 0.1
	}
	
	return currentCooldown
}

// Função para calcular custo do próximo upgrade (PlayerStrain)
func getNextUpgradeCostFromPlayerStrain(strain *PlayerStrain) int {
	// Aumenta 50% do custo base por nível
	return strain.UpgradeCost + (strain.UpgradeCost * strain.UpgradeLevel / 2)
}

// Função para verificar se strain deve se tornar passiva (PlayerStrain)
func shouldBecomePassiveFromPlayerStrain(strain *PlayerStrain) bool {
	return getCurrentCooldownFromPlayerStrain(strain) <= 0.2 && strain.UpgradeLevel >= 5
}

// Funções de compatibilidade para Strain (caso ainda sejam usadas)
func getCurrentCooldown(strain *Strain) float64 {
	reduction := float64(strain.UpgradeLevel) * 0.15
	currentCooldown := strain.BaseCooldown * (1.0 - reduction)
	if currentCooldown < 0.1 {
		currentCooldown = 0.1
	}
	return currentCooldown
}

func getNextUpgradeCost(strain *Strain) int {
	return strain.UpgradeCost + (strain.UpgradeCost * strain.UpgradeLevel / 2)
}

func shouldBecomePassive(strain *Strain) bool {
	return getCurrentCooldown(strain) <= 0.2 && strain.UpgradeLevel >= 5
}

// Handler para upgrade de strain
func upgradeStrain(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	nickname := r.URL.Query().Get("nickname")
	if nickname == "" {
		http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
		return
	}

	player, exists := tempPlayers[nickname]
	if !exists {
		http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
		return
	}

	// Encontrar strain atual do player
	currentPlayerStrain, exists := player.PlayerStrains[player.CurrentStrain]
	if !exists {
		http.Error(w, `{"error": "Strain atual do player não encontrada"}`, http.StatusNotFound)
		return
	}

	log.Printf("=== DEBUG UPGRADE BACKEND ===")
	log.Printf("Player: %s", nickname)
	log.Printf("Current strain: %s (ID: %d)", currentPlayerStrain.Name, currentPlayerStrain.ID)
	log.Printf("Current level: %d/%d", currentPlayerStrain.UpgradeLevel, currentPlayerStrain.MaxUpgradeLevel)
	log.Printf("Player points: %d", player.StonedPoints)

	// Verificar se pode fazer upgrade
	if currentPlayerStrain.UpgradeLevel >= currentPlayerStrain.MaxUpgradeLevel {
		log.Printf("Strain já está no nível máximo")
		http.Error(w, `{"error": "Strain já está no nível máximo"}`, http.StatusBadRequest)
		return
	}

	upgradeCost := getNextUpgradeCostFromPlayerStrain(currentPlayerStrain)
	log.Printf("Upgrade cost: %d", upgradeCost)

	if player.StonedPoints < upgradeCost {
		log.Printf("Pontos insuficientes: %d < %d", player.StonedPoints, upgradeCost)
		http.Error(w, `{"error": "Pontos insuficientes para upgrade"}`, http.StatusBadRequest)
		return
	}

	// Fazer o upgrade
	player.StonedPoints -= upgradeCost
	currentPlayerStrain.UpgradeLevel++
	player.UpdatedAt = time.Now()
	SaveAsync() // Salvar após upgrade

	// Verificar se deve se tornar passiva
	if shouldBecomePassiveFromPlayerStrain(currentPlayerStrain) {
		currentPlayerStrain.IsPassive = true
		log.Printf("Strain %s se tornou passiva para o player %s", currentPlayerStrain.Name, nickname)
	}

	log.Printf("Player %s fez upgrade da strain %s para nível %d", nickname, currentPlayerStrain.Name, currentPlayerStrain.UpgradeLevel)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"newPoints": player.StonedPoints,
		"upgradeLevel": currentPlayerStrain.UpgradeLevel,
		"isPassive": currentPlayerStrain.IsPassive,
		"currentCooldown": getCurrentCooldownFromPlayerStrain(currentPlayerStrain),
	})
}

// Handler para listar todas as strains disponíveis
func getAvailableStrains(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	nickname := r.URL.Query().Get("nickname")
	if nickname == "" {
		http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
		return
	}

	player, exists := tempPlayers[nickname]
	if !exists {
		http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
		return
	}

	// Preparar resposta com status de cada strain
	var strainsStatus []map[string]interface{}

	for _, baseStrain := range baseStrains {
		strainStatus := map[string]interface{}{
			"id": baseStrain.ID,
			"name": baseStrain.Name,
			"cost": baseStrain.Cost,
			"multiplier": baseStrain.Multiplier,
			"baseCooldown": baseStrain.BaseCooldown,
			"maxUpgradeLevel": baseStrain.MaxUpgradeLevel,
			"upgradeCost": baseStrain.UpgradeCost,
		}

		// Verificar se o player possui esta strain
		if playerStrain, hasStrain := player.PlayerStrains[baseStrain.ID]; hasStrain {
			strainStatus["owned"] = true
			strainStatus["upgradeLevel"] = playerStrain.UpgradeLevel
			strainStatus["isPassive"] = playerStrain.IsPassive
			strainStatus["currentUpgradeCost"] = getNextUpgradeCostFromPlayerStrain(playerStrain)
			strainStatus["canUpgrade"] = player.StonedPoints >= getNextUpgradeCostFromPlayerStrain(playerStrain) && playerStrain.UpgradeLevel < playerStrain.MaxUpgradeLevel
		} else {
			strainStatus["owned"] = false
			strainStatus["upgradeLevel"] = 0
			strainStatus["isPassive"] = false
			strainStatus["canBuy"] = player.StonedPoints >= baseStrain.Cost
		}

		strainsStatus = append(strainsStatus, strainStatus)
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"strains": strainsStatus,
		"currentStrain": player.CurrentStrain,
		"playerPoints": player.StonedPoints,
	})
}

// Handler para comprar nova strain
func buyStrain(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	nickname := r.URL.Query().Get("nickname")
	if nickname == "" {
		http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
		return
	}

	var req struct {
		StrainID int `json:"strainId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	player, exists := tempPlayers[nickname]
	if !exists {
		http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
		return
	}

	// Verificar se a strain existe
	var targetStrain *Strain
	for _, strain := range baseStrains {
		if strain.ID == req.StrainID {
			targetStrain = &strain
			break
		}
	}

	if targetStrain == nil {
		http.Error(w, `{"error": "Strain não encontrada"}`, http.StatusNotFound)
		return
	}

	// Verificar se já possui a strain
	if _, hasStrain := player.PlayerStrains[req.StrainID]; hasStrain {
		http.Error(w, `{"error": "Player já possui esta strain"}`, http.StatusBadRequest)
		return
	}

	// Verificar se tem pontos suficientes
	if player.StonedPoints < targetStrain.Cost {
		http.Error(w, `{"error": "Pontos insuficientes para comprar esta strain"}`, http.StatusBadRequest)
		return
	}

	// Comprar a strain
	player.StonedPoints -= targetStrain.Cost
	player.PlayerStrains[req.StrainID] = createPlayerStrain(*targetStrain)
	player.UpdatedAt = time.Now()

	log.Printf("Player %s comprou a strain %s por %d pontos", nickname, targetStrain.Name, targetStrain.Cost)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"newPoints": player.StonedPoints,
		"strainName": targetStrain.Name,
	})
}

// Handler para trocar strain ativa
func switchStrain(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	nickname := r.URL.Query().Get("nickname")
	if nickname == "" {
		http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
		return
	}

	var req struct {
		StrainID int `json:"strainId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	player, exists := tempPlayers[nickname]
	if !exists {
		http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
		return
	}

	// Verificar se o player possui a strain
	if _, hasStrain := player.PlayerStrains[req.StrainID]; !hasStrain {
		http.Error(w, `{"error": "Player não possui esta strain"}`, http.StatusBadRequest)
		return
	}

	// Trocar strain ativa
	player.CurrentStrain = req.StrainID
	player.UpdatedAt = time.Now()

	log.Printf("Player %s trocou para a strain %d", nickname, req.StrainID)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"newCurrentStrain": req.StrainID,
	})
}
// ====== CULTIVO HANDLERS ======

// Handler para salvar slots de cultivo
func saveCultivoSlots(w http.ResponseWriter, r *http.Request) {
w.Header().Set("Content-Type", "application/json")

nickname := r.URL.Query().Get("nickname")
if nickname == "" {
http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
return
}

var req struct {
Slots map[int]*PlantSlot `json:"slots"`
}
if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
return
}

player, exists := tempPlayers[nickname]
if !exists {
http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
return
}

player.CultivoSlots = req.Slots
player.UpdatedAt = time.Now()

log.Printf("Slots de cultivo salvos para player %s", nickname)

w.WriteHeader(http.StatusOK)
json.NewEncoder(w).Encode(map[string]interface{}{
"success": true,
})
}

// Handler para obter slots de cultivo
func getCultivoSlots(w http.ResponseWriter, r *http.Request) {
w.Header().Set("Content-Type", "application/json")

nickname := r.URL.Query().Get("nickname")
if nickname == "" {
http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
return
}

player, exists := tempPlayers[nickname]
if !exists {
http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
return
}

json.NewEncoder(w).Encode(map[string]interface{}{
"slots": player.CultivoSlots,
})
}

// Handler para salvar upgrades de cultivo
func saveCultivoUpgrades(w http.ResponseWriter, r *http.Request) {
w.Header().Set("Content-Type", "application/json")

nickname := r.URL.Query().Get("nickname")
if nickname == "" {
http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
return
}

var req struct {
Upgrades map[string]*CultivoUpgrade `json:"upgrades"`
}
if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
return
}

player, exists := tempPlayers[nickname]
if !exists {
http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
return
}

player.CultivoUpgrades = req.Upgrades
player.UpdatedAt = time.Now()

log.Printf("Upgrades de cultivo salvos para player %s", nickname)

w.WriteHeader(http.StatusOK)
json.NewEncoder(w).Encode(map[string]interface{}{
"success": true,
})
}

// Handler para obter upgrades de cultivo
func getCultivoUpgrades(w http.ResponseWriter, r *http.Request) {
w.Header().Set("Content-Type", "application/json")

nickname := r.URL.Query().Get("nickname")
if nickname == "" {
http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
return
}

player, exists := tempPlayers[nickname]
if !exists {
http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
return
}

json.NewEncoder(w).Encode(map[string]interface{}{
"upgrades": player.CultivoUpgrades,
})
}

// Handler para salvar estatísticas de cultivo
func saveCultivoStats(w http.ResponseWriter, r *http.Request) {
w.Header().Set("Content-Type", "application/json")

nickname := r.URL.Query().Get("nickname")
if nickname == "" {
http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
return
}

var req struct {
Stats *CultivoStats `json:"stats"`
}
if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
return
}

player, exists := tempPlayers[nickname]
if !exists {
http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
return
}

player.CultivoStats = req.Stats
player.UpdatedAt = time.Now()

log.Printf("Estatísticas de cultivo salvas para player %s", nickname)

w.WriteHeader(http.StatusOK)
json.NewEncoder(w).Encode(map[string]interface{}{
"success": true,
})
}

// Handler para obter estatísticas de cultivo
func getCultivoStats(w http.ResponseWriter, r *http.Request) {
w.Header().Set("Content-Type", "application/json")

nickname := r.URL.Query().Get("nickname")
if nickname == "" {
http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
return
}

player, exists := tempPlayers[nickname]
if !exists {
http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
return
}

json.NewEncoder(w).Encode(map[string]interface{}{
"stats": player.CultivoStats,
})
}

// ====== INVENTORY HANDLERS ======

// Handler para adicionar item ao inventário
func addInventoryItem(w http.ResponseWriter, r *http.Request) {
w.Header().Set("Content-Type", "application/json")

nickname := r.URL.Query().Get("nickname")
if nickname == "" {
http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
return
}

var req struct {
Item *InventoryItem `json:"item"`
}
if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
return
}

player, exists := tempPlayers[nickname]
if !exists {
http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
return
}

// Se o item já existe, aumenta a quantidade
if existingItem, exists := player.Inventory[req.Item.ID]; exists {
existingItem.Quantity += req.Item.Quantity
} else {
player.Inventory[req.Item.ID] = req.Item
}

player.UpdatedAt = time.Now()

log.Printf("Player %s adicionou %dx %s ao inventário", nickname, req.Item.Quantity, req.Item.Name)

w.WriteHeader(http.StatusOK)
json.NewEncoder(w).Encode(map[string]interface{}{
"success": true,
"inventory": player.Inventory,
})
}

// Handler para obter inventário
func getInventory(w http.ResponseWriter, r *http.Request) {
w.Header().Set("Content-Type", "application/json")

nickname := r.URL.Query().Get("nickname")
if nickname == "" {
http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
return
}

player, exists := tempPlayers[nickname]
if !exists {
http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
return
}

json.NewEncoder(w).Encode(map[string]interface{}{
"inventory": player.Inventory,
})
}

// Handler para salvar inventário completo
func saveInventory(w http.ResponseWriter, r *http.Request) {
w.Header().Set("Content-Type", "application/json")

nickname := r.URL.Query().Get("nickname")
if nickname == "" {
http.Error(w, `{"error": "Nickname é obrigatório"}`, http.StatusBadRequest)
return
}

var req struct {
Inventory map[string]*InventoryItem `json:"inventory"`
}
if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
return
}

player, exists := tempPlayers[nickname]
if !exists {
http.Error(w, `{"error": "Player não encontrado"}`, http.StatusNotFound)
return
}

	player.Inventory = req.Inventory
	player.UpdatedAt = time.Now()

	log.Printf("Inventário salvo para player %s", nickname)
	SaveAsync() // Salvar inventáriow.WriteHeader(http.StatusOK)
json.NewEncoder(w).Encode(map[string]interface{}{
"success": true,
})
}

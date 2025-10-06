// Serviço para comunicação com a API
const API_BASE_URL = 'http://localhost:8080';

interface LoginResponse {
  playerId: number;
  token: string;
  message: string;
}

interface Player {
  id: number;
  nickname: string;
  level: number;
  experience: number;
  stonedPoints: number;
  currentStrain: number;
  createdAt: string;
  updatedAt: string;
}

interface Strain {
  id: number;
  name: string;
  cost: number;
  multiplier: number;
  baseCooldown: number;
  upgradeLevel: number;
  maxUpgradeLevel: number;
  upgradeCost: number;
  isPassive: boolean;
}

interface PlayerStateResponse {
  player: Player;
  strain: Strain;
  currentCooldown: number;
  nextUpgradeCost: number;
  canUpgrade: boolean;
}

interface UpgradeResponse {
  success: boolean;
  newPoints: number;
  upgradeLevel: number;
  isPassive: boolean;
  currentCooldown: number;
}

interface ProgressResponse {
  success: boolean;
  newPoints: number;
}

interface StrainStatus {
  id: number;
  name: string;
  cost: number;
  multiplier: number;
  baseCooldown: number;
  maxUpgradeLevel: number;
  upgradeCost: number;
  owned: boolean;
  upgradeLevel: number;
  isPassive: boolean;
  currentUpgradeCost?: number;
  canUpgrade?: boolean;
  canBuy?: boolean;
}

interface AvailableStrainsResponse {
  strains: StrainStatus[];
  currentStrain: number;
  playerPoints: number;
}

interface BuyStrainResponse {
  success: boolean;
  newPoints: number;
  strainName: string;
}

interface SwitchStrainResponse {
  success: boolean;
  newCurrentStrain: number;
}

// Interfaces para Cultivo
interface PlantSlot {
  id: number;
  strainId: string;
  plantedAt: number;
  lastWatered: number;
  currentStage: number;
  isWilted: boolean;
}

interface CultivoUpgrade {
  id: string;
  level: number;
}

interface CultivoStats {
  totalHarvests: number;
  totalYield: number;
  totalWatering: number;
  wiltedPlants: number;
  perfectHarvests: number;
}

interface SaveCultivoResponse {
  success: boolean;
}

interface GetCultivoSlotsResponse {
  slots: Record<number, PlantSlot>;
}

interface GetCultivoUpgradesResponse {
  upgrades: Record<string, CultivoUpgrade>;
}

interface GetCultivoStatsResponse {
  stats: CultivoStats;
}

// Interfaces para Inventário
interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  type: string; // "flower", "seed", "extract", etc.
  rarity: string; // "common", "uncommon", "rare", "epic", "legendary"
  icon: string;
  strainId: string;
}

interface GetInventoryResponse {
  inventory: Record<string, InventoryItem>;
}

interface AddInventoryItemResponse {
  success: boolean;
  inventory: Record<string, InventoryItem>;
}

interface SaveInventoryResponse {
  success: boolean;
}

class ApiService {
  // Login do jogador
  static async login(nickname: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Obter estado do jogador
  static async getPlayerState(nickname: string): Promise<PlayerStateResponse> {
    const response = await fetch(`${API_BASE_URL}/player/state?nickname=${encodeURIComponent(nickname)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Atualizar progresso (tragar)
  static async updateProgress(nickname: string, points: number): Promise<ProgressResponse> {
    const response = await fetch(`${API_BASE_URL}/player/progress?nickname=${encodeURIComponent(nickname)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ points }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Fazer upgrade da strain atual
  static async upgradeStrain(nickname: string): Promise<UpgradeResponse> {
    const response = await fetch(`${API_BASE_URL}/player/upgrade?nickname=${encodeURIComponent(nickname)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Listar todas as strains disponíveis
  static async getAvailableStrains(nickname: string): Promise<AvailableStrainsResponse> {
    const response = await fetch(`${API_BASE_URL}/strains/available?nickname=${encodeURIComponent(nickname)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Comprar nova strain
  static async buyStrain(nickname: string, strainId: number): Promise<BuyStrainResponse> {
    const response = await fetch(`${API_BASE_URL}/strains/buy?nickname=${encodeURIComponent(nickname)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ strainId }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Trocar strain ativa
  static async switchStrain(nickname: string, strainId: number): Promise<SwitchStrainResponse> {
    const response = await fetch(`${API_BASE_URL}/strains/switch?nickname=${encodeURIComponent(nickname)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ strainId }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Health check da API
  static async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // ====== CULTIVO METHODS ======

  // Salvar slots de cultivo
  static async saveCultivoSlots(nickname: string, slots: Record<number, PlantSlot>): Promise<SaveCultivoResponse> {
    const response = await fetch(`${API_BASE_URL}/cultivo/slots?nickname=${encodeURIComponent(nickname)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slots }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Obter slots de cultivo
  static async getCultivoSlots(nickname: string): Promise<GetCultivoSlotsResponse> {
    const response = await fetch(`${API_BASE_URL}/cultivo/slots?nickname=${encodeURIComponent(nickname)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Salvar upgrades de cultivo
  static async saveCultivoUpgrades(nickname: string, upgrades: Record<string, CultivoUpgrade>): Promise<SaveCultivoResponse> {
    const response = await fetch(`${API_BASE_URL}/cultivo/upgrades?nickname=${encodeURIComponent(nickname)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ upgrades }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Obter upgrades de cultivo
  static async getCultivoUpgrades(nickname: string): Promise<GetCultivoUpgradesResponse> {
    const response = await fetch(`${API_BASE_URL}/cultivo/upgrades?nickname=${encodeURIComponent(nickname)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Salvar estatísticas de cultivo
  static async saveCultivoStats(nickname: string, stats: CultivoStats): Promise<SaveCultivoResponse> {
    const response = await fetch(`${API_BASE_URL}/cultivo/stats?nickname=${encodeURIComponent(nickname)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stats }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Obter estatísticas de cultivo
  static async getCultivoStats(nickname: string): Promise<GetCultivoStatsResponse> {
    const response = await fetch(`${API_BASE_URL}/cultivo/stats?nickname=${encodeURIComponent(nickname)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // ====== INVENTORY METHODS ======

  // Obter inventário
  static async getInventory(nickname: string): Promise<GetInventoryResponse> {
    const response = await fetch(`${API_BASE_URL}/inventory?nickname=${encodeURIComponent(nickname)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Adicionar item ao inventário
  static async addInventoryItem(nickname: string, item: InventoryItem): Promise<AddInventoryItemResponse> {
    const response = await fetch(`${API_BASE_URL}/inventory/add?nickname=${encodeURIComponent(nickname)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  // Salvar inventário completo
  static async saveInventory(nickname: string, inventory: Record<string, InventoryItem>): Promise<SaveInventoryResponse> {
    const response = await fetch(`${API_BASE_URL}/inventory?nickname=${encodeURIComponent(nickname)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inventory }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return response.json();
  }
}

export default ApiService;
export type { 
  LoginResponse, 
  Player, 
  Strain, 
  PlayerStateResponse, 
  ProgressResponse, 
  UpgradeResponse,
  StrainStatus,
  AvailableStrainsResponse,
  BuyStrainResponse,
  SwitchStrainResponse,
  InventoryItem,
  GetInventoryResponse,
  AddInventoryItemResponse,
  SaveInventoryResponse
};

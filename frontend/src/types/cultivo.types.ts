export interface PlantStage {
  id: string;
  name: string;
  icon: string;
  duration: number; // em segundos
  description: string;
}

export interface Strain {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  levelRequired: number;
  plantTime: number; // tempo total de crescimento em segundos
  wateringInterval: number; // intervalo de rega em segundos
  yield: {
    min: number;
    max: number;
  };
  expPerHarvest: number;
  seedCost: number;
  sellPrice: number;
  description: string;
  stages: PlantStage[];
  unlocked?: boolean;
}

export interface PlantSlot {
  id: string;
  strain: Strain | null;
  plantedAt: number | null;
  currentStage: number;
  lastWatered: number | null;
  isWilted: boolean;
  progress: number; // 0-100
}

export interface CultivoUpgrade {
  id: string;
  name: string;
  icon: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number;
  effect: {
    type: 'yield' | 'speed' | 'quality' | 'slots' | 'auto-water';
    value: number;
  };
  unlocked: boolean;
}

export interface CultivoStats {
  totalHarvests: number;
  totalYield: number;
  totalXP: number;
  bestStrain: string | null;
  perfectHarvests: number;
  wiltedPlants: number;
}

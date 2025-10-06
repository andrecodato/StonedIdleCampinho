import { Strain, PlantStage, CultivoUpgrade } from '@/types/cultivo.types';

// Estágios de crescimento padrão
export const PLANT_STAGES: PlantStage[] = [
  {
    id: 'seed',
    name: 'Semente',
    icon: '🌱',
    duration: 30, // 30 segundos
    description: 'Semente plantada, aguardando germinação',
  },
  {
    id: 'sprout',
    name: 'Broto',
    icon: '🌿',
    duration: 60, // 1 minuto
    description: 'Pequeno broto começando a crescer',
  },
  {
    id: 'vegetative',
    name: 'Vegetativo',
    icon: '🍀',
    duration: 90, // 1.5 minutos
    description: 'Planta crescendo folhas e caule',
  },
  {
    id: 'flowering',
    name: 'Floração',
    icon: '🌸',
    duration: 120, // 2 minutos
    description: 'Flores começando a aparecer',
  },
  {
    id: 'mature',
    name: 'Madura',
    icon: '🌺',
    duration: 90, // 1.5 minutos
    description: 'Planta madura, pronta para colheita',
  },
  {
    id: 'ready',
    name: 'Pronta',
    icon: '✨',
    duration: 0,
    description: 'Pronta para colheita!',
  },
];

// Strains disponíveis
export const STRAINS: Omit<Strain, 'unlocked'>[] = [
  {
    id: 'capulho',
    name: 'Capulho',
    icon: '🌱',
    rarity: 'common',
    levelRequired: 1,
    plantTime: 300, // 5 minutos
    wateringInterval: 60, // regar a cada 1 minuto
    yield: { min: 1, max: 3 },
    expPerHarvest: 10,
    seedCost: 0, // Grátis para iniciantes
    sellPrice: 5,
    description: 'Semente comum de prensado',
    stages: PLANT_STAGES,
  },
  {
    id: 'somango',
    name: 'Somango',
    icon: '🍇',
    rarity: 'uncommon',
    levelRequired: 5,
    plantTime: 480, // 8 minutos
    wateringInterval: 90,
    yield: { min: 3, max: 6 },
    expPerHarvest: 25,
    seedCost: 50,
    sellPrice: 15,
    description: 'Primeira strain que a rapazeada degustou',
    stages: PLANT_STAGES,
  },
  {
    id: 'whiteWidow',
    name: 'White Widow',
    icon: '❄️',
    rarity: 'uncommon',
    levelRequired: 10,
    plantTime: 540, // 9 minutos
    wateringInterval: 120,
    yield: { min: 4, max: 8 },
    expPerHarvest: 40,
    seedCost: 100,
    sellPrice: 25,
    description: 'Conhecida por seus tricomas brancos abundantes',
    stages: PLANT_STAGES,
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    icon: '🫐',
    rarity: 'rare',
    levelRequired: 15,
    plantTime: 600, // 10 minutos
    wateringInterval: 90,
    yield: { min: 6, max: 12 },
    expPerHarvest: 60,
    seedCost: 200,
    sellPrice: 40,
    description: 'Sabor doce e efeito relaxante',
    stages: PLANT_STAGES,
  },
  {
    id: 'sourDiesel',
    name: 'Sour Diesel',
    icon: '⚡',
    rarity: 'rare',
    levelRequired: 20,
    plantTime: 660, // 11 minutos
    wateringInterval: 120,
    yield: { min: 8, max: 15 },
    expPerHarvest: 80,
    seedCost: 350,
    sellPrice: 60,
    description: 'Energizante e com aroma diesel característico',
    stages: PLANT_STAGES,
  },
  {
    id: 'girlScoutCookies',
    name: 'Girl Scout Cookies',
    icon: '🍪',
    rarity: 'epic',
    levelRequired: 30,
    plantTime: 720, // 12 minutos
    wateringInterval: 150,
    yield: { min: 10, max: 20 },
    expPerHarvest: 120,
    seedCost: 600,
    sellPrice: 100,
    description: 'Sabor doce e efeito potente',
    stages: PLANT_STAGES,
  },
  {
    id: 'gorillаGlue',
    name: 'Gorilla Glue',
    icon: '🦍',
    rarity: 'epic',
    levelRequired: 40,
    plantTime: 780, // 13 minutos
    wateringInterval: 180,
    yield: { min: 12, max: 25 },
    expPerHarvest: 150,
    seedCost: 900,
    sellPrice: 150,
    description: 'Extremamente pegajosa e potente',
    stages: PLANT_STAGES,
  },
  {
    id: 'zkittlez',
    name: 'Zkittlez',
    icon: '🌈',
    rarity: 'legendary',
    levelRequired: 50,
    plantTime: 900, // 15 minutos
    wateringInterval: 200,
    yield: { min: 15, max: 35 },
    expPerHarvest: 200,
    seedCost: 1500,
    sellPrice: 250,
    description: 'Sabores frutados incríveis, strain premiada',
    stages: PLANT_STAGES,
  },
  {
    id: 'wedding Cake',
    name: 'Wedding Cake',
    icon: '🎂',
    rarity: 'legendary',
    levelRequired: 60,
    plantTime: 960, // 16 minutos
    wateringInterval: 220,
    yield: { min: 20, max: 45 },
    expPerHarvest: 250,
    seedCost: 2500,
    sellPrice: 400,
    description: 'Doce como um bolo, efeito duradouro',
    stages: PLANT_STAGES,
  },
  {
    id: 'runtz',
    name: 'Runtz',
    icon: '🍬',
    rarity: 'legendary',
    levelRequired: 75,
    plantTime: 1080, // 18 minutos
    wateringInterval: 240,
    yield: { min: 25, max: 60 },
    expPerHarvest: 350,
    seedCost: 4000,
    sellPrice: 650,
    description: 'Strain lendária com sabor de candy',
    stages: PLANT_STAGES,
  },
];

// Upgrades de cultivo
export const CULTIVO_UPGRADES: Omit<CultivoUpgrade, 'unlocked'>[] = [
  {
    id: 'extraSlot1',
    name: 'Estufa Pequena',
    icon: '🏠',
    description: 'Adiciona +1 slot de plantio',
    level: 0,
    maxLevel: 1,
    cost: 100,
    effect: { type: 'slots', value: 1 },
  },
  {
    id: 'extraSlot2',
    name: 'Estufa Média',
    icon: '🏡',
    description: 'Adiciona +2 slots de plantio',
    level: 0,
    maxLevel: 1,
    cost: 500,
    effect: { type: 'slots', value: 2 },
  },
  {
    id: 'extraSlot3',
    name: 'Estufa Grande',
    icon: '🏘️',
    description: 'Adiciona +3 slots de plantio',
    level: 0,
    maxLevel: 1,
    cost: 2000,
    effect: { type: 'slots', value: 3 },
  },
  {
    id: 'yieldBoost',
    name: 'Fertilizante Premium',
    icon: '💊',
    description: '+10% rendimento por nível',
    level: 0,
    maxLevel: 5,
    cost: 200,
    effect: { type: 'yield', value: 10 },
  },
  {
    id: 'speedBoost',
    name: 'Luz UV Potente',
    icon: '💡',
    description: '+5% velocidade de crescimento por nível',
    level: 0,
    maxLevel: 10,
    cost: 300,
    effect: { type: 'speed', value: 5 },
  },
  {
    id: 'autoWater',
    name: 'Sistema de Irrigação',
    icon: '💧',
    description: 'Rega automática a cada 2 minutos',
    level: 0,
    maxLevel: 1,
    cost: 1000,
    effect: { type: 'auto-water', value: 120 },
  },
  {
    id: 'qualityBoost',
    name: 'Controle de Clima',
    icon: '🌡️',
    description: '+5% chance de colheita perfeita por nível',
    level: 0,
    maxLevel: 5,
    cost: 500,
    effect: { type: 'quality', value: 5 },
  },
];

// Cores por raridade
export const RARITY_COLORS = {
  common: 'text-gray-400 border-gray-500',
  uncommon: 'text-green-400 border-green-500',
  rare: 'text-blue-400 border-blue-500',
  epic: 'text-purple-400 border-purple-500',
  legendary: 'text-yellow-400 border-yellow-500',
};

export const RARITY_GLOW = {
  common: '',
  uncommon: 'shadow-green-500/50',
  rare: 'shadow-blue-500/50',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-yellow-500/50 animate-pulse',
};

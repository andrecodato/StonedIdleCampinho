import { ActionData } from '@/types/game.types';

export const CULTIVO_ACTIONS: Omit<ActionData, 'count'>[] = [
  { 
    id: 'normal', 
    name: 'Árvore Normal', 
    icon: '🌳', 
    exp: 10, 
    time: 3000, 
    reward: 1, 
    level: 1, 
    maxCount: 999999 
  },
  { 
    id: 'carvalho', 
    name: 'Carvalho', 
    icon: '🌲', 
    exp: 15, 
    time: 4000, 
    reward: 2, 
    level: 1, 
    maxCount: 83 
  },
  { 
    id: 'salgueiro', 
    name: 'Salgueiro', 
    icon: '🌿', 
    exp: 23, 
    time: 5000, 
    reward: 3, 
    level: 5, 
    maxCount: 83 
  },
  { 
    id: 'teca', 
    name: 'Teca', 
    icon: '🎋', 
    exp: 31, 
    time: 6000, 
    reward: 4, 
    level: 10, 
    maxCount: 83 
  },
  { 
    id: 'bordo', 
    name: 'Bordo', 
    icon: '🍁', 
    exp: 42, 
    time: 8000, 
    reward: 5, 
    level: 15, 
    maxCount: 83, 
    locked: true 
  },
  { 
    id: 'mogno', 
    name: 'Mogno', 
    icon: '🌳', 
    exp: 63, 
    time: 10000, 
    reward: 7, 
    level: 25, 
    maxCount: 83, 
    locked: true 
  },
];

export type TabType = 
  | 'cultivo' 
  | 'culinaria' 
  | 'artesanato' 
  | 'quimica' 
  | 'comercio' 
  | 'exploracao' 
  | 'inventario'
  | 'agricultura' 
  | 'municipio' 
  | 'loja';

export interface ActionData {
  id: string;
  name: string;
  icon: string;
  exp: number;
  time: number;
  reward: number;
  level: number;
  count: number;
  maxCount: number;
  locked?: boolean;
}

export interface SkillData {
  id: string;
  name: string;
  icon: string;
  level: number;
  maxLevel: number;
  exp: number;
  maxExp: number;
}

export interface ResourceData {
  id: string;
  name: string;
  icon: string;
  amount: number;
}

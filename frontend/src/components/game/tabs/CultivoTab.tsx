import { Player } from '@/services/api';
import { ActionData } from '@/types/game.types';
import { ActionGrid } from '../actions/ActionGrid';
import { CULTIVO_ACTIONS } from '@/constants/actions';

interface CultivoTabProps {
  player: Player | null;
  activeAction: string | null;
  progress: number;
  onAction: (action: ActionData) => void;
  disabled: boolean;
}

export const CultivoTab = ({ 
  player, 
  activeAction, 
  progress, 
  onAction, 
  disabled 
}: CultivoTabProps) => {
  // Adiciona count aos actions
  const cultivoActions: ActionData[] = CULTIVO_ACTIONS.map((action, index) => ({
    ...action,
    count: index === 0 ? (player?.stonedPoints || 0) : 0,
  }));

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-2">🌲 Corte de Lenha</h2>
        <p className="text-gray-400 text-sm">
          Informações sobre suas ações de corte serão exibidas aqui.
        </p>
      </div>

      <ActionGrid
        actions={cultivoActions}
        activeAction={activeAction}
        progress={progress}
        onAction={onAction}
        disabled={disabled}
      />
    </>
  );
};

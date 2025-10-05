import { ActionData } from '@/types/game.types';
import { ActionCard } from './ActionCard';

interface ActionGridProps {
  actions: ActionData[];
  activeAction: string | null;
  progress: number;
  onAction: (action: ActionData) => void;
  disabled: boolean;
}

export const ActionGrid = ({ 
  actions, 
  activeAction, 
  progress, 
  onAction, 
  disabled 
}: ActionGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <ActionCard
          key={action.id}
          action={action}
          isActive={activeAction === action.id}
          progress={progress}
          onAction={onAction}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

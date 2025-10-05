import { ActionData } from '@/types/game.types';
import { ActionProgress } from './ActionProgress';
import { LockIndicator } from '../common/LockIndicator';

interface ActionCardProps {
  action: ActionData;
  isActive: boolean;
  progress: number;
  onAction: (action: ActionData) => void;
  disabled: boolean;
}

export const ActionCard = ({ 
  action, 
  isActive, 
  progress, 
  onAction, 
  disabled 
}: ActionCardProps) => {
  const isLocked = action.locked;

  return (
    <div
      className={`bg-[#2d3142] rounded-lg border-2 transition-all ${
        isActive 
          ? 'border-green-500' 
          : isLocked 
          ? 'border-red-600 opacity-50' 
          : 'border-gray-700 hover:border-green-600'
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-3">
          <button
            onClick={() => !isLocked && onAction(action)}
            disabled={isActive || isLocked || disabled}
            className="text-6xl mb-2 hover:scale-110 transition-transform disabled:opacity-50"
          >
            {action.icon}
          </button>
          <h3 className="font-bold text-white mb-1">{action.name}</h3>
          <p className="text-xs text-gray-400">
            {action.exp} de EXP de Habilidade / ⏱️ {(action.time / 1000).toFixed(1)} segundos
          </p>
        </div>

        {/* Progress Bar */}
        {isActive && <ActionProgress progress={progress} />}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">🏆</span>
            <span className="text-white font-bold">{action.count}</span>
          </div>
          <span className="text-gray-400">{action.count} / {action.maxCount}</span>
        </div>

        {/* Lock indicator */}
        {isLocked && <LockIndicator level={action.level} />}
      </div>
    </div>
  );
};

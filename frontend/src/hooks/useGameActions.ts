import { useState } from 'react';
import ApiService from '@/services/api';
import { ActionData } from '@/types/game.types';

export const useGameActions = (playerNickname: string, onComplete: (reward: number) => void) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [actionProgress, setActionProgress] = useState(0);
  const [canPerformAction, setCanPerformAction] = useState(true);

  const handleAction = async (action: ActionData) => {
    if (!canPerformAction || activeAction) return;

    setActiveAction(action.id);
    setCanPerformAction(false);
    setActionProgress(0);

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / action.time) * 100, 100);
      setActionProgress(progress);

      if (progress < 100) {
        requestAnimationFrame(animate);
      } else {
        completeAction(action.reward, action.exp);
      }
    };

    requestAnimationFrame(animate);
  };

  const completeAction = async (reward: number, expReward: number) => {
    try {
      const result = await ApiService.updateProgress(playerNickname, reward);
      if (result.success) {
        onComplete(result.newPoints);
      }
    } catch (error) {
      console.error('Erro ao completar ação:', error);
    } finally {
      setActiveAction(null);
      setCanPerformAction(true);
      setActionProgress(0);
    }
  };

  return {
    activeAction,
    actionProgress,
    canPerformAction,
    handleAction,
  };
};

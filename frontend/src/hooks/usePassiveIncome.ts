import { useEffect } from 'react';
import ApiService, { Player, Strain } from '@/services/api';

export const usePassiveIncome = (
  strain: Strain | null,
  player: Player | null,
  playerNickname: string,
  onUpdate: (newPoints: number) => void
) => {
  useEffect(() => {
    if (!strain?.isPassive || !player) return;

    const interval = setInterval(async () => {
      try {
        const result = await ApiService.updateProgress(playerNickname, strain.multiplier);
        if (result.success) {
          onUpdate(result.newPoints);
        }
      } catch (error) {
        console.error('Erro na geração passiva:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [strain?.isPassive, strain?.multiplier, playerNickname, player?.id]);
};

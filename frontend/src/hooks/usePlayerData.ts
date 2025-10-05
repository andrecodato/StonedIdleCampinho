import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApiService, { Player, Strain, PlayerStateResponse } from '@/services/api';

export const usePlayerData = () => {
  const [playerNickname, setPlayerNickname] = useState('');
  const [player, setPlayer] = useState<Player | null>(null);
  const [strain, setStrain] = useState<Strain | null>(null);
  const [gameState, setGameState] = useState<PlayerStateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadPlayerData = async (nickname: string) => {
    try {
      const data = await ApiService.getPlayerState(nickname);
      setPlayer(data.player);
      setStrain(data.strain);
      setGameState(data);
    } catch (error) {
      console.error('Erro ao carregar dados do jogador:', error);
      router.push('/');
    }
  };

  useEffect(() => {
    const nickname = localStorage.getItem('playerNickname');
    const playerId = localStorage.getItem('playerId');
    
    if (!nickname || !playerId) {
      router.push('/');
      return;
    }

    setPlayerNickname(nickname);
    loadPlayerData(nickname).finally(() => setIsLoading(false));
  }, [router]);

  const updatePlayer = (updates: Partial<Player>) => {
    setPlayer(prev => prev ? { ...prev, ...updates } : null);
  };

  return {
    playerNickname,
    player,
    strain,
    gameState,
    isLoading,
    loadPlayerData,
    updatePlayer,
  };
};

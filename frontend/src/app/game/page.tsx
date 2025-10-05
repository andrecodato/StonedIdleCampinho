'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TabType } from '@/types/game.types';
import { usePlayerData } from '@/hooks/usePlayerData';
import { useGameActions } from '@/hooks/useGameActions';
import { usePassiveIncome } from '@/hooks/usePassiveIncome';
import { GameLayout } from '@/components/game/layout/GameLayout';
import { LoadingScreen } from '@/components/game/common/LoadingScreen';
import { CultivoTab } from '@/components/game/tabs/CultivoTab';
import { AgriculturaTab } from '@/components/game/tabs/AgriculturaTab';
import { MunicipioTab } from '@/components/game/tabs/MunicipioTab';
import { LojaTab } from '@/components/game/tabs/LojaTab';

export default function GamePage() {
  const [activeTab, setActiveTab] = useState<TabType>('cultivo');
  const router = useRouter();

  // Hooks customizados
  const { 
    playerNickname, 
    player, 
    strain, 
    isLoading, 
    updatePlayer 
  } = usePlayerData();

  const { 
    activeAction, 
    actionProgress, 
    canPerformAction, 
    handleAction 
  } = useGameActions(playerNickname, (newPoints) => {
    updatePlayer({ stonedPoints: newPoints });
  });

  usePassiveIncome(strain, player, playerNickname, (newPoints) => {
    updatePlayer({ stonedPoints: newPoints });
  });

  const handleLogout = () => {
    localStorage.removeItem('playerNickname');
    localStorage.removeItem('playerId');
    router.push('/');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'cultivo':
        return (
          <CultivoTab
            player={player}
            activeAction={activeAction}
            progress={actionProgress}
            onAction={handleAction}
            disabled={!canPerformAction}
          />
        );
      case 'agricultura':
        return <AgriculturaTab />;
      case 'municipio':
        return <MunicipioTab />;
      case 'loja':
        return <LojaTab />;
      default:
        return null;
    }
  };

  return (
    <GameLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      playerNickname={playerNickname}
      player={player}
      onLogout={handleLogout}
    >
      {renderTabContent()}
    </GameLayout>
  );
}

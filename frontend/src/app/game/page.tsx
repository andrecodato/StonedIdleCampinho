'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TabType } from '@/types/game.types';
import { usePlayerData } from '@/hooks/usePlayerData';
import { useGameActions } from '@/hooks/useGameActions';
import { usePassiveIncome } from '@/hooks/usePassiveIncome';
import { useInventory } from '@/hooks/useInventory';
import { GameLayout } from '@/components/game/layout/GameLayout';
import { LoadingScreen } from '@/components/game/common/LoadingScreen';
import { CultivoTab } from '@/components/game/tabs/CultivoTab';
import { AgriculturaTab } from '@/components/game/tabs/AgriculturaTab';
import { MunicipioTab } from '@/components/game/tabs/MunicipioTab';
import { LojaTab } from '@/components/game/tabs/LojaTab';
import { InventoryTab } from '@/components/game/tabs/InventoryTab';

export default function GamePage() {
  const [activeTab, setActiveTab] = useState<TabType>('cultivo');
  const [cultivoLevel, setCultivoLevel] = useState(1);
  const [cultivoXP, setCultivoXP] = useState(0);
  const [cultivoXPToNext, setCultivoXPToNext] = useState(100);
  const router = useRouter();

  // Hooks customizados
  const { 
    playerNickname, 
    player, 
    strain, 
    isLoading, 
    updatePlayer 
  } = usePlayerData();

  const { inventory, addItem } = useInventory();

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

  // Callback estável para atualizar buds
  const handleUpdateBuds = useCallback((amount: number) => {
    updatePlayer({ stonedPoints: (player?.stonedPoints || 0) + amount });
  }, [player?.stonedPoints, updatePlayer]);

  // Callbacks estáveis para atualizar XP e nível
  const handleLevelChange = useCallback((level: number) => {
    setCultivoLevel(level);
  }, []);

  const handleXPChange = useCallback((xp: number) => {
    setCultivoXP(xp);
  }, []);

  const handleXPToNextChange = useCallback((xpToNext: number) => {
    setCultivoXPToNext(xpToNext);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'cultivo':
        return (
          <CultivoTab
            player={player}
            onUpdateBuds={handleUpdateBuds}
            onAddInventoryItem={addItem}
            onLevelChange={handleLevelChange}
            onXPChange={handleXPChange}
            onXPToNextChange={handleXPToNextChange}
          />
        );
      case 'culinaria':
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍪</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Culinária Canábica</h2>
            <p className="text-gray-400">Em breve! Prepare brownies, chás e óleos deliciosos.</p>
          </div>
        );
      case 'artesanato':
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔨</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Artesanato</h2>
            <p className="text-gray-400">Em breve! Crie bongs, pipes e vaporizadores personalizados.</p>
          </div>
        );
      case 'quimica':
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚗️</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Química & Extração</h2>
            <p className="text-gray-400">Em breve! Produza concentrados, óleos e tinturas premium.</p>
          </div>
        );
      case 'comercio':
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Comércio</h2>
            <p className="text-gray-400">Em breve! Venda seus produtos e expanda seu negócio.</p>
          </div>
        );
      case 'exploracao':
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Exploração</h2>
            <p className="text-gray-400">Em breve! Descubra novas sementes e locais secretos.</p>
          </div>
        );
      case 'inventario':
        return <InventoryTab inventory={inventory} />;
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
      cultivoLevel={cultivoLevel}
      cultivoXP={cultivoXP}
      cultivoXPToNext={cultivoXPToNext}
      onLogout={handleLogout}
    >
      {renderTabContent()}
    </GameLayout>
  );
}

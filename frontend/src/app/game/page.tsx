'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ApiService, { Player, Strain, PlayerStateResponse } from '@/services/api';
import StrainSprite from '@/components/StrainSprite';
import ParticleSystem from '@/components/ParticleSystem';
import StrainShop from '@/components/StrainShop';

export default function GamePage() {
  const [playerNickname, setPlayerNickname] = useState('');
  const [player, setPlayer] = useState<Player | null>(null);
  const [strain, setStrain] = useState<Strain | null>(null);
  const [gameState, setGameState] = useState<PlayerStateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTragarLoading, setIsTragarLoading] = useState(false);
  const [isUpgradeLoading, setIsUpgradeLoading] = useState(false);
  const [cooldownProgress, setCooldownProgress] = useState(0);
  const [canTragar, setCanTragar] = useState(true);
  const [showParticles, setShowParticles] = useState(false);
  const [activeTab, setActiveTab] = useState<'game' | 'shop'>('game');
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

  // Sistema passivo - gera pontos automaticamente para strains passivas
  useEffect(() => {
    if (!strain?.isPassive || !player) return;

    const interval = setInterval(async () => {
      try {
        const result = await ApiService.updateProgress(playerNickname, strain.multiplier);
        if (result.success) {
          setPlayer(prev => prev ? { ...prev, stonedPoints: result.newPoints } : null);
        }
      } catch (error) {
        console.error('Erro na geração passiva:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [strain?.isPassive, strain?.multiplier, playerNickname, player?.id]);

  // Atualizar gameState quando os pontos do player mudarem
  useEffect(() => {
    if (!player || !strain || !gameState) return;

    const canUpgrade = player.stonedPoints >= gameState.nextUpgradeCost && strain.upgradeLevel < strain.maxUpgradeLevel;
    
    if (canUpgrade !== gameState.canUpgrade) {
      setGameState(prev => prev ? { ...prev, canUpgrade } : null);
    }
  }, [player?.stonedPoints, strain?.upgradeLevel, gameState?.nextUpgradeCost, gameState?.canUpgrade]);

  const startCooldown = (duration: number) => {
    setCanTragar(false);
    setCooldownProgress(0);
    
    const startTime = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / (duration * 1000)) * 100, 100);
      
      setCooldownProgress(progress);
      
      if (progress >= 100) {
        setCanTragar(true);
        setCooldownProgress(0);
      } else {
        requestAnimationFrame(updateProgress);
      }
    };
    
    requestAnimationFrame(updateProgress);
  };

  const handleTragar = async () => {
    if (!player || !strain || !gameState || isTragarLoading || !canTragar) return;

    setIsTragarLoading(true);
    try {
      const result = await ApiService.updateProgress(playerNickname, strain.multiplier);
      
      if (result.success) {
        setPlayer(prev => prev ? { ...prev, stonedPoints: result.newPoints } : null);
        
        const canUpgrade = result.newPoints >= gameState.nextUpgradeCost && strain.upgradeLevel < strain.maxUpgradeLevel;
        setGameState(prev => prev ? { ...prev, canUpgrade } : null);
        
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 100);
        
        if (!strain.isPassive) {
          startCooldown(gameState.currentCooldown);
        }
      }
    } catch (error) {
      console.error('Erro ao tragar:', error);
      alert('Erro ao tragar! Verifique sua conexão.');
    } finally {
      setIsTragarLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!player || !strain || !gameState || isUpgradeLoading || !gameState.canUpgrade) {
      return;
    }

    setIsUpgradeLoading(true);
    try {
      const result = await ApiService.upgradeStrain(playerNickname);
      
      if (result.success) {
        setPlayer(prev => prev ? { ...prev, stonedPoints: result.newPoints } : null);
        setStrain(prev => prev ? { 
          ...prev, 
          upgradeLevel: result.upgradeLevel,
          isPassive: result.isPassive 
        } : null);
        
        await loadPlayerData(playerNickname);
      }
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error);
      alert('Erro ao fazer upgrade! Verifique se você tem pontos suficientes.');
    } finally {
      setIsUpgradeLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('playerNickname');
    localStorage.removeItem('playerId');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center text-green-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-blue-50 p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-600 mb-2">🌿 Cannabis Cultivator 🌿</h1>
        <p className="text-green-700">Cultive, colha e expanda sua operação</p>
        <div className="flex justify-center gap-4 mt-4">
          <span className="text-sm text-green-600">Jogador: {playerNickname}</span>
          <button
            onClick={handleLogout}
            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      {activeTab === 'shop' ? (
        <div>
          {/* Close Shop Button */}
          <div className="text-center mb-6">
            <button
              onClick={() => setActiveTab('game')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
            >
              📊 Fechar Loja
            </button>
          </div>
          <StrainShop 
            playerNickname={playerNickname} 
            onStrainChange={() => loadPlayerData(playerNickname)}
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Main Game Layout */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Left Sidebar - Resources */}
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-200">
                <h2 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
                  📊 Recursos
                </h2>
                
                <div className="space-y-4">
                  {/* Buds */}
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">🌿</span>
                      <span className="font-medium text-green-700">Buds</span>
                    </div>
                    <span className="font-bold text-green-800 text-xl">
                      {player?.stonedPoints?.toLocaleString() || 0}
                    </span>
                  </div>

                  {/* Plantas */}
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">🌱</span>
                      <span className="font-medium text-green-700">Plantas</span>
                    </div>
                    <span className="font-bold text-green-800 text-xl">1</span>
                  </div>

                  {/* Estatísticas */}
                  <div className="bg-green-50 rounded-lg p-3 mt-6">
                    <div className="text-sm text-green-600 mb-2">Por clique:</div>
                    <div className="font-bold text-green-800">
                      {strain?.multiplier || 1}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-sm text-green-600 mb-2">Por segundo:</div>
                    <div className="font-bold text-green-800">
                      {strain?.isPassive ? (strain.multiplier || 0) : '0.0'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Area - Cultivation */}
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-green-200 text-center">
                
                {/* Plant Animation Area */}
                <div className="mb-8 relative">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center shadow-inner">
                    <div className="text-8xl animate-pulse">🌿</div>
                  </div>
                  
                  {/* Particle System */}
                  {showParticles && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <ParticleSystem 
                          key={Math.random()} 
                          isActive={showParticles}
                          points={strain?.multiplier || 1}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Harvest Button */}
                <button
                  onClick={handleTragar}
                  disabled={!canTragar || isTragarLoading}
                  className={`
                    px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 mb-6
                    ${canTragar && !isTragarLoading
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }
                  `}
                >
                  {isTragarLoading ? '⏳ Colhendo...' : '🌿 Colher Buds'}
                </button>

                {/* Progress Bars */}
                <div className="space-y-4">
                  {/* Water Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">💧</span>
                        <span className="text-sm font-medium text-blue-700">Água</span>
                      </div>
                      <span className="text-sm font-bold text-blue-800">100%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  {/* Light Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-600">☀️</span>
                        <span className="text-sm font-medium text-yellow-700">Luz Solar</span>
                      </div>
                      <span className="text-sm font-bold text-yellow-800">100%</span>
                    </div>
                    <div className="w-full bg-yellow-200 rounded-full h-3">
                      <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Current Strain Info */}
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-200">
                <h2 className="text-xl font-bold text-green-600 mb-4">🌿 Strain Atual</h2>
                
                <div className="text-center mb-4">
                  <StrainSprite 
                    strainId={strain?.id || 1} 
                    isPassive={strain?.isPassive}
                    isActive={true}
                    size="large"
                  />
                  <h3 className="font-bold text-green-700 mt-2">{strain?.name || 'Carregando...'}</h3>
                  <p className="text-sm text-green-600">
                    Nível {strain?.upgradeLevel || 0}/{strain?.maxUpgradeLevel || 0}
                  </p>
                </div>

                {/* Upgrade Section */}
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-sm text-green-600 mb-1">Custo do Upgrade:</div>
                    <div className="font-bold text-green-800">
                      {gameState?.nextUpgradeCost?.toLocaleString() || 0} Buds
                    </div>
                  </div>

                  <button
                    onClick={handleUpgrade}
                    disabled={!gameState?.canUpgrade || isUpgradeLoading}
                    className={`
                      w-full py-3 px-4 rounded-lg font-bold transition-colors
                      ${gameState?.canUpgrade && !isUpgradeLoading
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {isUpgradeLoading ? '⏳ Fazendo Upgrade...' : '⬆️ Fazer Upgrade'}
                  </button>

                  {/* Test Button */}
                  <button 
                    onClick={async () => {
                      try {
                        const result = await ApiService.updateProgress(playerNickname, 100);
                        if (result.success) {
                          setPlayer(prev => prev ? { ...prev, stonedPoints: result.newPoints } : null);
                          
                          if (gameState && strain) {
                            const canUpgrade = result.newPoints >= gameState.nextUpgradeCost && strain.upgradeLevel < strain.maxUpgradeLevel;
                            setGameState(prev => prev ? { ...prev, canUpgrade } : null);
                          }
                        }
                      } catch (error) {
                        console.error('Erro ao adicionar pontos de teste:', error);
                      }
                    }}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    🧪 +100 Buds (Teste)
                  </button>
                </div>
              </div>

              {/* Shop Button */}
              <button
                onClick={() => setActiveTab('shop')}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
              >
                🏪 Abrir Loja
              </button>
            </div>
          </div>

          {/* Bottom Section - Upgrade Cards */}
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Sistema de Irrigação */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-3xl">💧</span>
                  </div>
                  <h3 className="font-bold text-blue-700">Sistema de Irrigação</h3>
                  <p className="text-sm text-blue-600 mt-2">Recupera água automaticamente</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600">Nível:</span>
                    <span className="font-bold text-blue-800">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600">Efeito:</span>
                    <span className="font-bold text-blue-800">+0.5 água/seg</span>
                  </div>
                </div>
                
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  💰 10 Buds
                </button>
              </div>

              {/* Solo Premium */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-yellow-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-3xl">🌱</span>
                  </div>
                  <h3 className="font-bold text-yellow-700">Solo Premium</h3>
                  <p className="text-sm text-yellow-600 mt-2">Aumenta a produção por clique</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-600">Nível:</span>
                    <span className="font-bold text-yellow-800">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-600">Efeito:</span>
                    <span className="font-bold text-yellow-800">+1 bud/clique</span>
                  </div>
                </div>
                
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  💰 25 Buds
                </button>
              </div>

              {/* Lâmpadas de Cultivo */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-3xl">💡</span>
                  </div>
                  <h3 className="font-bold text-orange-700">Lâmpadas de Cultivo</h3>
                  <p className="text-sm text-orange-600 mt-2">Recupera luz solar automaticamente</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600">Nível:</span>
                    <span className="font-bold text-orange-800">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600">Efeito:</span>
                    <span className="font-bold text-orange-800">+0.3 luz/seg</span>
                  </div>
                </div>
                
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  💰 50 Buds
                </button>
              </div>

              {/* Estufa */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-3xl">🏠</span>
                  </div>
                  <h3 className="font-bold text-green-700">Estufa</h3>
                  <p className="text-sm text-green-600 mt-2">Adiciona mais plantas e produção passiva</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Nível:</span>
                    <span className="font-bold text-green-800">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Efeito:</span>
                    <span className="font-bold text-green-800">+1 planta, +0.5 buds/seg</span>
                  </div>
                </div>
                
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  💰 100 Buds
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
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
      // Se não conseguir carregar, redirecionar para login
      router.push('/');
    }
  };

  useEffect(() => {
    // Verificar se o usuário está logado
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
    }, 1000); // Gera pontos a cada segundo para strains passivas

    return () => clearInterval(interval);
  }, [strain?.isPassive, strain?.multiplier, playerNickname, player?.id]);

  // Atualizar gameState quando os pontos do player mudarem
  useEffect(() => {
    if (!player || !strain || !gameState) return;

    // Recalcular se pode fazer upgrade baseado nos pontos atuais
    const canUpgrade = player.stonedPoints >= gameState.nextUpgradeCost && strain.upgradeLevel < strain.maxUpgradeLevel;
    
    // Atualizar gameState se o status de upgrade mudou
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
        // Atualizar estado local
        setPlayer(prev => prev ? { ...prev, stonedPoints: result.newPoints } : null);
        
        // Atualizar gameState com os novos pontos
        const canUpgrade = result.newPoints >= gameState.nextUpgradeCost && strain.upgradeLevel < strain.maxUpgradeLevel;
        setGameState(prev => prev ? { ...prev, canUpgrade } : null);
        
        // Mostrar partículas
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 100);
        
        // Iniciar cooldown se não for passiva
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
    console.log('=== DEBUG UPGRADE ===');
    console.log('player:', player);
    console.log('strain:', strain);
    console.log('gameState:', gameState);
    console.log('canUpgrade:', gameState?.canUpgrade);
    console.log('isUpgradeLoading:', isUpgradeLoading);
    
    if (!player || !strain || !gameState || isUpgradeLoading || !gameState.canUpgrade) {
      console.log('Conditions not met for upgrade');
      return;
    }

    setIsUpgradeLoading(true);
    try {
      console.log('Calling upgradeStrain API...');
      const result = await ApiService.upgradeStrain(playerNickname);
      console.log('Upgrade result:', result);
      
      if (result.success) {
        console.log('Upgrade successful, reloading player data...');
        // Recarregar dados completos
        await loadPlayerData(playerNickname);
      }
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error);
      alert('Erro ao fazer upgrade! Verifique sua conexão.');
    } finally {
      setIsUpgradeLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('playerNickname');
    localStorage.removeItem('playerId');
    localStorage.removeItem('token');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Stoned Idle Logo"
                width={60}
                height={60}
                className="drop-shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Stoned Idle</h1>
                <p className="text-green-200">Bem-vindo, {playerNickname}!</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('game')}
              className={`flex-1 py-4 px-6 font-bold rounded-l-2xl transition-colors ${
                activeTab === 'game'
                  ? 'bg-green-600 text-white'
                  : 'bg-transparent text-green-200 hover:bg-white/10'
              }`}
            >
              🎮 Jogo Principal
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`flex-1 py-4 px-6 font-bold rounded-r-2xl transition-colors ${
                activeTab === 'shop'
                  ? 'bg-green-600 text-white'
                  : 'bg-transparent text-green-200 hover:bg-white/10'
              }`}
            >
              🏪 Loja de Strains
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'game' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resources Panel */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">🌿 Recursos</h2>
            
            <div className="space-y-4">
              {/* Buds */}
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌿</span>
                  <span className="text-green-200 font-medium">Buds</span>
                </div>
                <span className="text-2xl font-bold text-green-300">
                  {player?.stonedPoints?.toLocaleString() || 0}
                </span>
              </div>

              {/* Produção por clique */}
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-green-300 mb-1">Por clique:</div>
                <div className="text-lg font-bold text-orange-300">
                  +{strain?.multiplier || 0}
                </div>
              </div>

              {/* Produção por segundo (se strain for passiva) */}
              {strain?.isPassive && (
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-purple-300 mb-1">Por segundo:</div>
                  <div className="text-lg font-bold text-purple-400">
                    +{strain?.multiplier || 0}
                  </div>
                </div>
              )}

              {/* Status da strain */}
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-blue-300 mb-2">Status da Strain:</div>
                <div className="flex items-center gap-2">
                  {strain?.isPassive ? (
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                      ⚡ PASSIVA
                    </span>
                  ) : (
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                      🖱️ MANUAL
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Player Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">📊 Status do Cultivo</h2>
            
            {/* Strain atual com sprite */}
            <div className="flex items-center gap-4 mb-4 p-3 bg-white/5 rounded-lg">
              <StrainSprite 
                strainId={strain?.id || 1} 
                isPassive={strain?.isPassive}
                isActive={true}
                size="large"
              />
              <div className="flex-1">
                <h3 className="font-bold text-yellow-300 text-lg">{strain?.name || 'Carregando...'}</h3>
                <p className="text-green-200 text-sm">
                  Nível {strain?.upgradeLevel || 0}/{strain?.maxUpgradeLevel || 0}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-green-100">
                <span>Cooldown Atual:</span>
                <span className="font-bold text-purple-300">
                  {strain?.isPassive ? '🌿 Passiva!' : `⏱️ ${gameState?.currentCooldown?.toFixed(1) || 0}s`}
                </span>
              </div>
            </div>
          </div>

          {/* Game Actions */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">🎮 Ações</h2>
            <div className="space-y-4">
              {/* Botão Tragar com indicador de upgrade */}
              <div className="relative">
                <div className={`relative ${gameState?.canUpgrade ? 'upgrade-indicator' : ''}`}>
                  <button 
                    onClick={handleTragar}
                    disabled={isTragarLoading || (!canTragar && !strain?.isPassive)}
                    className="tragar-button w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors text-xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      '--progress': `${cooldownProgress}%`
                    } as React.CSSProperties & { '--progress': string }}
                  >
                    {/* Sistema de partículas */}
                    <ParticleSystem 
                      isActive={showParticles} 
                      points={strain?.multiplier || 0}
                    />
                    {/* Barra de progresso do cooldown */}
                    {!canTragar && !strain?.isPassive && (
                      <div 
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400/40 via-green-300/50 to-green-400/40 transition-all duration-100 ease-linear"
                        style={{ width: `${cooldownProgress}%` }}
                      />
                    )}
                    
                    <span className="button-content flex items-center">
                      {/* Sprite da strain no botão */}
                      <StrainSprite 
                        strainId={strain?.id || 1} 
                        isPassive={strain?.isPassive}
                        size="small"
                        className="mr-3"
                      />
                      
                      {isTragarLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                          Tragando...
                        </>
                      ) : strain?.isPassive ? (
                        <>🌿 Passiva (+{strain?.multiplier || 0})</>
                      ) : !canTragar ? (
                        <>⏳ Cooldown... (+{strain?.multiplier || 0})</>
                      ) : (
                        <>💨 Tragar (+{strain?.multiplier || 0})</>
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {/* Botão Upgrade */}
              <button 
                onClick={handleUpgrade}
                disabled={isUpgradeLoading || !gameState?.canUpgrade}
                className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isUpgradeLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Upgrading...
                  </>
                ) : (
                  <>
                    ⬆️ Upgrade - {gameState?.nextUpgradeCost?.toLocaleString() || 0} pontos
                    <span className="ml-2 text-sm opacity-80">
                      (Reduz cooldown em 15%)
                    </span>
                  </>
                )}
              </button>
              
              {/* Info sobre próximo upgrade */}
              {gameState?.canUpgrade && (
                <div className="text-center text-green-200 text-sm bg-green-900/30 p-2 rounded-lg">
                  💡 Próximo nível: {(strain?.upgradeLevel || 0) + 1}/{strain?.maxUpgradeLevel || 0}
                  <br />
                  Cooldown ficará: {((gameState?.currentCooldown || 0) * 0.85).toFixed(1)}s
                </div>
              )}
              
              {/* Botão de teste - remover em produção */}
              <button 
                onClick={async () => {
                  try {
                    const result = await ApiService.updateProgress(playerNickname, 100);
                    if (result.success) {
                      setPlayer(prev => prev ? { ...prev, stonedPoints: result.newPoints } : null);
                      
                      // Atualizar gameState com os novos pontos
                      if (gameState && strain) {
                        const canUpgrade = result.newPoints >= gameState.nextUpgradeCost && strain.upgradeLevel < strain.maxUpgradeLevel;
                        setGameState(prev => prev ? { ...prev, canUpgrade } : null);
                      }
                    }
                  } catch (error) {
                    console.error('Erro ao adicionar pontos de teste:', error);
                  }
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                🧪 +100 Pontos (Teste)
              </button>
            </div>
          </div>
          </div>
        ) : (
          <StrainShop 
            playerNickname={playerNickname} 
            onStrainChange={() => loadPlayerData(playerNickname)}
          />
        )}
      </div>
    </div>
  );
}
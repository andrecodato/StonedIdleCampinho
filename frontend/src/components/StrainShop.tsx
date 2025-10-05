'use client';

import { useState, useEffect } from 'react';
import ApiService, { StrainStatus, AvailableStrainsResponse } from '@/services/api';
import StrainSprite from './StrainSprite';

interface StrainShopProps {
  playerNickname: string;
  onStrainChange: () => void;
}

export default function StrainShop({ playerNickname, onStrainChange }: StrainShopProps) {
  const [strains, setStrains] = useState<StrainStatus[]>([]);
  const [currentStrain, setCurrentStrain] = useState<number>(1);
  const [playerPoints, setPlayerPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadStrains = async () => {
    try {
      const data: AvailableStrainsResponse = await ApiService.getAvailableStrains(playerNickname);
      setStrains(data.strains);
      setCurrentStrain(data.currentStrain);
      setPlayerPoints(data.playerPoints);
    } catch (error) {
      console.error('Erro ao carregar strains:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStrains();
  }, [playerNickname]);

  const handleBuyStrain = async (strainId: number) => {
    try {
      await ApiService.buyStrain(playerNickname, strainId);
      await loadStrains();
      onStrainChange();
    } catch (error) {
      console.error('Erro ao comprar strain:', error);
      alert('Erro ao comprar strain! Verifique se você tem pontos suficientes.');
    }
  };

  const handleSwitchStrain = async (strainId: number) => {
    try {
      await ApiService.switchStrain(playerNickname, strainId);
      await loadStrains();
      onStrainChange();
    } catch (error) {
      console.error('Erro ao trocar strain:', error);
      alert('Erro ao trocar strain!');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">🌿 Loja de Strains</h2>
        <div className="text-right">
          <div className="text-sm text-green-200">Seus Buds</div>
          <div className="text-2xl font-bold text-yellow-400">{playerPoints.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {strains.map((strain) => (
          <div
            key={strain.id}
            className={`
              relative bg-gradient-to-br from-green-800/50 to-green-900/50 rounded-xl p-4 border-2 transition-all duration-300 hover:scale-105
              ${strain.id === currentStrain ? 'border-yellow-400 ring-2 ring-yellow-400/50' : 'border-white/20'}
              ${strain.owned ? 'bg-gradient-to-br from-green-700/70 to-green-800/70' : 'bg-gradient-to-br from-gray-700/50 to-gray-800/50'}
            `}
          >
            {/* Badge da strain atual */}
            {strain.id === currentStrain && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                ATIVA
              </div>
            )}

            {/* Sprite da strain */}
            <div className="flex justify-center mb-3">
              <StrainSprite strainId={strain.id} size="large" />
            </div>

            {/* Nome da strain */}
            <h3 className="text-lg font-bold text-white text-center mb-2">
              {strain.name}
            </h3>

            {/* Informações da strain */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-green-200">
                <span>Produção:</span>
                <span>+{strain.multiplier}/clique</span>
              </div>
              
              {strain.owned ? (
                <>
                  <div className="flex justify-between text-blue-200">
                    <span>Nível:</span>
                    <span>{strain.upgradeLevel}/{strain.maxUpgradeLevel}</span>
                  </div>
                  
                  {strain.isPassive && (
                    <div className="text-center text-purple-300 font-bold">
                      ⚡ PASSIVA ⚡
                    </div>
                  )}
                  
                  <div className="flex justify-between text-orange-200">
                    <span>Cooldown:</span>
                    <span>{strain.baseCooldown}s</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-yellow-200">
                  <span>Custo:</span>
                  <span>{strain.cost.toLocaleString()} Buds</span>
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="mt-4 space-y-2">
              {strain.owned ? (
                <>
                  {strain.id !== currentStrain && (
                    <button
                      onClick={() => handleSwitchStrain(strain.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      🔄 Ativar Strain
                    </button>
                  )}
                  
                  {strain.canUpgrade && (
                    <div className="text-center">
                      <div className="text-xs text-green-300 mb-1">
                        Próximo upgrade: {strain.currentUpgradeCost?.toLocaleString()} Buds
                      </div>
                      <div className="text-xs text-blue-300">
                        Upgrade disponível no painel principal!
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleBuyStrain(strain.id)}
                  disabled={!strain.canBuy}
                  className={`
                    w-full font-bold py-2 px-4 rounded-lg transition-colors
                    ${
                      strain.canBuy
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {strain.canBuy ? '💰 Comprar' : '❌ Sem Buds'}
                </button>
              )}
            </div>

            {/* Indicador de desbloqueio */}
            {!strain.owned && strain.cost > 0 && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl mb-2">🔒</div>
                  <div className="text-sm font-bold">
                    {strain.cost.toLocaleString()} Buds
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Estatísticas */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-xs text-green-300">Strains Possuídas</div>
          <div className="text-xl font-bold text-white">
            {strains.filter(s => s.owned).length}/{strains.length}
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-xs text-purple-300">Strains Passivas</div>
          <div className="text-xl font-bold text-white">
            {strains.filter(s => s.owned && s.isPassive).length}
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-xs text-blue-300">Total de Upgrades</div>
          <div className="text-xl font-bold text-white">
            {strains.reduce((total, s) => total + (s.owned ? s.upgradeLevel : 0), 0)}
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-xs text-yellow-300">Produção Total</div>
          <div className="text-xl font-bold text-white">
            +{strains.reduce((total, s) => total + (s.owned ? s.multiplier : 0), 0)}/clique
          </div>
        </div>
      </div>
    </div>
  );
}
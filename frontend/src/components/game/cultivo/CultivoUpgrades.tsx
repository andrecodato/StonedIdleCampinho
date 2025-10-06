import { CultivoUpgrade } from '@/types/cultivo.types';

interface CultivoUpgradesProps {
  upgrades: CultivoUpgrade[];
  onPurchase: (upgradeId: string) => void;
  playerBuds: number;
}

export const CultivoUpgrades = ({
  upgrades,
  onPurchase,
  playerBuds,
}: CultivoUpgradesProps) => {
  return (
    <div className="bg-[#2d3142] rounded-lg p-4">
      <h3 className="text-lg font-bold text-green-400 mb-3">
        ⚙️ Upgrades de Cultivo
      </h3>
      <div className="space-y-3">
        {upgrades.map((upgrade) => {
          const canAfford = playerBuds >= upgrade.cost;
          const isMaxLevel = upgrade.level >= upgrade.maxLevel;
          const nextCost = upgrade.cost * Math.pow(1.5, upgrade.level);

          return (
            <div
              key={upgrade.id}
              className="bg-gray-800/50 rounded-lg p-3 border-2 border-gray-700"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{upgrade.icon}</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">{upgrade.name}</h4>
                    <p className="text-xs text-gray-400">{upgrade.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">
                    Nível {upgrade.level}/{upgrade.maxLevel}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-gray-400">Efeito:</span>{' '}
                  <span className="text-green-400">
                    {upgrade.effect.type === 'yield' && `+${upgrade.effect.value}% Rendimento`}
                    {upgrade.effect.type === 'speed' && `+${upgrade.effect.value}% Velocidade`}
                    {upgrade.effect.type === 'quality' && `+${upgrade.effect.value}% Qualidade`}
                    {upgrade.effect.type === 'slots' && `+${upgrade.effect.value} Slots`}
                    {upgrade.effect.type === 'auto-water' && 'Rega Automática'}
                  </span>
                </div>
                <button
                  onClick={() => onPurchase(upgrade.id)}
                  disabled={!canAfford || isMaxLevel || !upgrade.unlocked}
                  className={`px-3 py-1 rounded font-bold text-xs transition-colors ${
                    isMaxLevel
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : !upgrade.unlocked
                      ? 'bg-red-900 text-red-400 cursor-not-allowed'
                      : canAfford
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isMaxLevel ? 'MAX' : !upgrade.unlocked ? '🔒 Bloqueado' : `💰 ${Math.floor(nextCost)}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

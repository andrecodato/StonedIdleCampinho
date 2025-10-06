import { Strain } from '@/types/cultivo.types';
import { RARITY_COLORS } from '@/constants/cultivo';

interface StrainSelectorProps {
  strains: Strain[];
  selectedStrain: Strain | null;
  onSelect: (strain: Strain) => void;
  playerLevel: number;
  playerBuds: number;
}

export const StrainSelector = ({
  strains,
  selectedStrain,
  onSelect,
  playerLevel,
  playerBuds,
}: StrainSelectorProps) => {
  return (
    <div className="bg-[#2d3142] rounded-lg p-4 mb-6">
      <h3 className="text-lg font-bold text-green-400 mb-3">
        🌱 Selecionar Strain para Plantar
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {strains.map((strain) => {
          const isLocked = !strain.unlocked || playerLevel < strain.levelRequired;
          const canAfford = playerBuds >= strain.seedCost;
          const isSelected = selectedStrain?.id === strain.id;

          return (
            <button
              key={strain.id}
              onClick={() => !isLocked && canAfford && onSelect(strain)}
              disabled={isLocked || !canAfford}
              className={`p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-green-500 bg-green-900/30'
                  : isLocked
                  ? 'border-red-600 opacity-50 cursor-not-allowed'
                  : !canAfford
                  ? 'border-yellow-600 opacity-70'
                  : 'border-gray-700 hover:border-green-600'
              }`}
            >
              <div className="text-4xl mb-1">{strain.icon}</div>
              <div className="text-xs font-bold text-white truncate">
                {strain.name}
              </div>
              <div className={`text-xs ${RARITY_COLORS[strain.rarity]}`}>
                {strain.rarity}
              </div>
              <div className="text-xs text-blue-400 mt-0.5">
                ⭐ {strain.expPerHarvest} XP
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {isLocked ? (
                  <span className="text-red-400">🔒 Lv.{strain.levelRequired}</span>
                ) : (
                  <span className={canAfford ? 'text-green-400' : 'text-yellow-400'}>
                    💰 {strain.seedCost}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {selectedStrain && (
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{selectedStrain.icon}</span>
            <div>
              <h4 className="font-bold text-white">{selectedStrain.name}</h4>
              <p className={`text-xs ${RARITY_COLORS[selectedStrain.rarity]}`}>
                {selectedStrain.rarity.toUpperCase()}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-2">{selectedStrain.description}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Tempo:</span>{' '}
              <span className="text-white">{Math.floor(selectedStrain.plantTime / 60)} min</span>
            </div>
            <div>
              <span className="text-gray-400">Rendimento:</span>{' '}
              <span className="text-green-400">
                {selectedStrain.yield.min}-{selectedStrain.yield.max} 🌿
              </span>
            </div>
            <div>
              <span className="text-gray-400">EXP:</span>{' '}
              <span className="text-blue-400">{selectedStrain.expPerHarvest}</span>
            </div>
            <div>
              <span className="text-gray-400">Venda:</span>{' '}
              <span className="text-yellow-400">💰 {selectedStrain.sellPrice}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { PlantSlot, Strain } from '@/types/cultivo.types';
import { RARITY_COLORS, RARITY_GLOW } from '@/constants/cultivo';

interface PlantSlotCardProps {
  slot: PlantSlot;
  onPlant: (slotId: string) => void;
  onWater: (slotId: string) => void;
  onHarvest: (slotId: string) => void;
  availableStrains: Strain[];
  selectedStrain: Strain | null;
}

export const PlantSlotCard = ({
  slot,
  onPlant,
  onWater,
  onHarvest,
  availableStrains,
  selectedStrain,
}: PlantSlotCardProps) => {
  const isEmpty = !slot.strain;
  const isReady = slot.progress >= 100;
  const needsWater = slot.lastWatered && 
    Date.now() - slot.lastWatered > (slot.strain?.wateringInterval || 60) * 1000;

  const getCurrentStageIcon = () => {
    if (!slot.strain) return '📦';
    if (slot.isWilted) return '💀';
    if (isReady) return '✨';
    return slot.strain.stages[slot.currentStage]?.icon || '🌱';
  };

  const getCurrentStageName = () => {
    if (!slot.strain) return 'Slot Vazio';
    if (slot.isWilted) return 'Planta Murcha';
    if (isReady) return 'Pronta para Colheita!';
    return slot.strain.stages[slot.currentStage]?.name || 'Crescendo';
  };

  return (
    <div
      className={`bg-[#2d3142] rounded-lg border-2 p-4 transition-all ${
        isEmpty
          ? 'border-gray-700 hover:border-green-600'
          : slot.isWilted
          ? 'border-red-600'
          : isReady
          ? `border-green-500 ${RARITY_GLOW[slot.strain?.rarity || 'common']}`
          : needsWater
          ? 'border-yellow-500'
          : 'border-gray-700'
      }`}
    >
      {/* Ícone da Planta */}
      <div className="text-center mb-3">
        <div className="text-6xl mb-2">{getCurrentStageIcon()}</div>
        <h3 className="font-bold text-white mb-1">
          {slot.strain?.name || 'Slot Vazio'}
        </h3>
        <p className="text-xs text-gray-400">{getCurrentStageName()}</p>
      </div>

      {/* Barra de Progresso */}
      {!isEmpty && !slot.isWilted && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Crescimento</span>
            <span>{Math.floor(slot.progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 transition-all duration-300 ${
                isReady ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${slot.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Info da Strain */}
      {!isEmpty && slot.strain && (
        <div className="mb-3 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Raridade:</span>
            <span className={RARITY_COLORS[slot.strain.rarity]}>
              {slot.strain.rarity.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Rendimento:</span>
            <span className="text-green-400">
              {slot.strain.yield.min}-{slot.strain.yield.max} 🌿
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Recompensa XP:</span>
            <span className="text-blue-400">
              ⭐ {slot.strain.expPerHarvest} XP
            </span>
          </div>
        </div>
      )}

      {/* Alerta de Água */}
      {needsWater && !slot.isWilted && (
        <div className="mb-3 bg-yellow-900/30 rounded p-2 text-center">
          <p className="text-xs text-yellow-400">💧 Precisa de água!</p>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="space-y-2">
        {isEmpty ? (
          <button
            onClick={() => onPlant(slot.id)}
            disabled={!selectedStrain}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {selectedStrain ? `Plantar ${selectedStrain.name}` : 'Selecione uma Strain'}
          </button>
        ) : slot.isWilted ? (
          <button
            onClick={() => onHarvest(slot.id)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            🗑️ Remover Planta
          </button>
        ) : isReady ? (
          <button
            onClick={() => onHarvest(slot.id)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors animate-pulse"
          >
            ✂️ Colher
          </button>
        ) : (
          <button
            onClick={() => onWater(slot.id)}
            disabled={!needsWater}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            💧 Regar
          </button>
        )}
      </div>
    </div>
  );
};

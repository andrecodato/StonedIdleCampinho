import { Player, InventoryItem } from '@/services/api';
import { useCultivo } from '@/hooks/useCultivo';
import { PlantSlotCard } from '../cultivo/PlantSlotCard';
import { StrainSelector } from '../cultivo/StrainSelector';
import { CultivoUpgrades } from '../cultivo/CultivoUpgrades';
import { CultivoStatsDisplay } from '../cultivo/CultivoStatsDisplay';
import { useEffect } from 'react';

interface CultivoTabProps {
  player: Player | null;
  onUpdateBuds: (amount: number) => void;
  onAddInventoryItem: (item: InventoryItem) => Promise<void>;
  onLevelChange?: (level: number) => void;
  onXPChange?: (xp: number) => void;
  onXPToNextChange?: (xpToNext: number) => void;
}

export const CultivoTab = ({ 
  player, 
  onUpdateBuds, 
  onAddInventoryItem, 
  onLevelChange,
  onXPChange,
  onXPToNextChange
}: CultivoTabProps) => {
  const playerLevel = player?.level || 1;
  
  const {
    slots,
    availableStrains,
    selectedStrain,
    setSelectedStrain,
    upgrades,
    stats,
    handlePlant,
    handleWater,
    handleHarvest,
    handlePurchaseUpgrade,
  } = useCultivo(playerLevel, player?.stonedPoints || 0, onUpdateBuds, onAddInventoryItem);

  // Calcular nível do Cultivo baseado no XP real acumulado
  useEffect(() => {
    if (stats.totalXP >= 0) {
      // Usar o XP REAL acumulado das colheitas (cada strain tem seu expPerHarvest)
      const totalXP = stats.totalXP;
      
      // Calcular nível baseado em XP total
      // XP necessário para próximo nível: level * 100
      let calculatedLevel = 1;
      let xpUsed = 0;
      
      while (xpUsed + (calculatedLevel * 100) <= totalXP && calculatedLevel < 99) {
        xpUsed += calculatedLevel * 100;
        calculatedLevel++;
      }
      
      const currentLevelXP = totalXP - xpUsed;
      const xpForNextLevel = calculatedLevel * 100;
      
      if (onLevelChange) {
        onLevelChange(Math.min(calculatedLevel, 99));
      }
      if (onXPChange) {
        onXPChange(currentLevelXP);
      }
      if (onXPToNextChange) {
        onXPToNextChange(calculatedLevel >= 99 ? 100 : xpForNextLevel);
      }
    }
  }, [stats.totalXP, onLevelChange, onXPChange, onXPToNextChange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-green-400 mb-2">� Cultivo de Cannabis</h2>
        <p className="text-gray-400">
          Plante, regue e colha diferentes strains para ganhar buds e experiência!
        </p>
      </div>

      {/* Estatísticas */}
      <CultivoStatsDisplay stats={stats} />

      {/* Seletor de Strains */}
      <StrainSelector
        strains={availableStrains}
        selectedStrain={selectedStrain}
        onSelect={setSelectedStrain}
        playerLevel={playerLevel}
        playerBuds={player?.stonedPoints || 0}
      />

      {/* Grid de Slots de Plantio */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-3">🏡 Slots de Cultivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map((slot) => (
            <PlantSlotCard
              key={slot.id}
              slot={slot}
              onPlant={handlePlant}
              onWater={handleWater}
              onHarvest={handleHarvest}
              availableStrains={availableStrains}
              selectedStrain={selectedStrain}
            />
          ))}
        </div>
      </div>

      {/* Upgrades */}
      <CultivoUpgrades
        upgrades={upgrades}
        onPurchase={handlePurchaseUpgrade}
        playerBuds={player?.stonedPoints || 0}
      />
    </div>
  );
};

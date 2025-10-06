import { useState, useEffect, useCallback } from 'react';
import { PlantSlot, Strain, CultivoUpgrade, CultivoStats } from '@/types/cultivo.types';
import { STRAINS, CULTIVO_UPGRADES } from '@/constants/cultivo';
import ApiService, { InventoryItem } from '@/services/api';

export const useCultivo = (
  playerLevel: number, 
  playerBuds: number, 
  onUpdateBuds: (amount: number) => void,
  onAddInventoryItem: (item: InventoryItem) => Promise<void>
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [slots, setSlots] = useState<PlantSlot[]>([
    { id: '1', strain: null, plantedAt: null, currentStage: 0, lastWatered: null, isWilted: false, progress: 0 },
    { id: '2', strain: null, plantedAt: null, currentStage: 0, lastWatered: null, isWilted: false, progress: 0 },
    { id: '3', strain: null, plantedAt: null, currentStage: 0, lastWatered: null, isWilted: false, progress: 0 },
  ]);

  const [availableStrains, setAvailableStrains] = useState<Strain[]>(() =>
    STRAINS.map((s) => ({ ...s, unlocked: s.levelRequired <= playerLevel }))
  );

  const [upgrades, setUpgrades] = useState<CultivoUpgrade[]>(() =>
    CULTIVO_UPGRADES.map((u) => ({ ...u, unlocked: true }))
  );

  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);

  const [stats, setStats] = useState<CultivoStats>({
    totalHarvests: 0,
    totalYield: 0,
    totalXP: 0,
    bestStrain: null,
    perfectHarvests: 0,
    wiltedPlants: 0,
  });

  // Load cultivo data from backend on mount
  useEffect(() => {
    const loadCultivoData = async () => {
      try {
        const nickname = localStorage.getItem('playerNickname');
        if (!nickname) return;

        // Load slots
        const slotsResponse = await ApiService.getCultivoSlots(nickname);
        if (slotsResponse.slots && Object.keys(slotsResponse.slots).length > 0) {
          const slotsArray = Object.values(slotsResponse.slots).map(slot => ({
            id: slot.id.toString(),
            strain: STRAINS.find(s => s.id === slot.strainId) || null,
            plantedAt: slot.plantedAt || null,
            currentStage: slot.currentStage,
            lastWatered: slot.lastWatered || null,
            isWilted: slot.isWilted,
            progress: 0, // Will be recalculated
          }));
          setSlots(slotsArray);
        }

        // Load upgrades
        const upgradesResponse = await ApiService.getCultivoUpgrades(nickname);
        if (upgradesResponse.upgrades && Object.keys(upgradesResponse.upgrades).length > 0) {
          setUpgrades(prev =>
            prev.map(u => {
              const saved = upgradesResponse.upgrades[u.id];
              return saved ? { ...u, level: saved.level } : u;
            })
          );
        }

        // Load stats
        const statsResponse = await ApiService.getCultivoStats(nickname);
        if (statsResponse.stats) {
          setStats({
            totalHarvests: statsResponse.stats.totalHarvests || 0,
            totalYield: statsResponse.stats.totalYield || 0,
            totalXP: 0, // XP será recalculado baseado nas colheitas
            bestStrain: null, // Backend doesn't store this field
            perfectHarvests: statsResponse.stats.perfectHarvests || 0,
            wiltedPlants: statsResponse.stats.wiltedPlants || 0,
          });
        }

        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading cultivo data:', error);
        setIsLoaded(true);
      }
    };

    loadCultivoData();
  }, []);

  // Save slots to backend when they change
  useEffect(() => {
    if (!isLoaded) return;

    const saveSlotsToBackend = async () => {
      try {
        const nickname = localStorage.getItem('playerNickname');
        if (!nickname) return;

        const slotsRecord: Record<number, { id: number; strainId: string; plantedAt: number; lastWatered: number; currentStage: number; isWilted: boolean }> = {};
        slots.forEach((slot, index) => {
          slotsRecord[index] = {
            id: parseInt(slot.id),
            strainId: slot.strain?.id || '',
            plantedAt: slot.plantedAt || 0,
            lastWatered: slot.lastWatered || 0,
            currentStage: slot.currentStage,
            isWilted: slot.isWilted,
          };
        });

        await ApiService.saveCultivoSlots(nickname, slotsRecord);
      } catch (error) {
        console.error('Error saving cultivo slots:', error);
      }
    };

    const debounceTimer = setTimeout(saveSlotsToBackend, 1000);
    return () => clearTimeout(debounceTimer);
  }, [slots, isLoaded]);

  // Save upgrades to backend when they change
  useEffect(() => {
    if (!isLoaded) return;

    const saveUpgradesToBackend = async () => {
      try {
        const nickname = localStorage.getItem('playerNickname');
        if (!nickname) return;

        const upgradesRecord: Record<string, { id: string; level: number }> = {};
        upgrades.forEach(u => {
          upgradesRecord[u.id] = {
            id: u.id,
            level: u.level,
          };
        });

        await ApiService.saveCultivoUpgrades(nickname, upgradesRecord);
      } catch (error) {
        console.error('Error saving cultivo upgrades:', error);
      }
    };

    const debounceTimer = setTimeout(saveUpgradesToBackend, 1000);
    return () => clearTimeout(debounceTimer);
  }, [upgrades, isLoaded]);

  // Save stats to backend when they change
  useEffect(() => {
    if (!isLoaded) return;

    const saveStatsToBackend = async () => {
      try {
        const nickname = localStorage.getItem('playerNickname');
        if (!nickname) return;

        await ApiService.saveCultivoStats(nickname, {
          totalHarvests: stats.totalHarvests,
          totalYield: stats.totalYield,
          totalWatering: 0, // Not tracked in frontend yet
          wiltedPlants: stats.wiltedPlants,
          perfectHarvests: stats.perfectHarvests,
        });
      } catch (error) {
        console.error('Error saving cultivo stats:', error);
      }
    };

    const debounceTimer = setTimeout(saveStatsToBackend, 1000);
    return () => clearTimeout(debounceTimer);
  }, [stats, isLoaded]);

  // Calcular bônus de upgrades
  const getYieldBonus = useCallback(() => {
    const yieldUpgrade = upgrades.find((u) => u.effect.type === 'yield');
    return yieldUpgrade ? (yieldUpgrade.level * yieldUpgrade.effect.value) / 100 : 0;
  }, [upgrades]);

  const getSpeedBonus = useCallback(() => {
    const speedUpgrade = upgrades.find((u) => u.effect.type === 'speed');
    return speedUpgrade ? (speedUpgrade.level * speedUpgrade.effect.value) / 100 : 0;
  }, [upgrades]);

  const getTotalSlots = useCallback(() => {
    const baseSlots = 3;
    const slotUpgrades = upgrades.filter((u) => u.effect.type === 'slots' && u.level > 0);
    return baseSlots + slotUpgrades.reduce((acc, u) => acc + u.effect.value * u.level, 0);
  }, [upgrades]);

  // Atualizar progresso das plantas
  useEffect(() => {
    const interval = setInterval(() => {
      setSlots((prevSlots) =>
        prevSlots.map((slot) => {
          if (!slot.strain || !slot.plantedAt || slot.isWilted) return slot;

          const now = Date.now();
          const elapsed = (now - slot.plantedAt) / 1000; // segundos
          const totalTime = slot.strain.plantTime * (1 - getSpeedBonus());
          const newProgress = Math.min((elapsed / totalTime) * 100, 100);

          // Verificar se precisa de água
          const timeSinceWatered = slot.lastWatered ? (now - slot.lastWatered) / 1000 : elapsed;
          const needsWater = timeSinceWatered > slot.strain.wateringInterval;

          // Murchar se não regar a tempo (2x o intervalo)
          const isWilted = timeSinceWatered > slot.strain.wateringInterval * 2;

          // Atualizar estágio atual
          let currentStage = 0;
          let accumulatedTime = 0;
          for (let i = 0; i < slot.strain.stages.length - 1; i++) {
            accumulatedTime += slot.strain.stages[i].duration;
            if (elapsed >= accumulatedTime) {
              currentStage = i + 1;
            }
          }

          return {
            ...slot,
            progress: isWilted ? slot.progress : newProgress,
            currentStage,
            isWilted,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [getSpeedBonus]);

  // Plantar
  const handlePlant = useCallback(
    (slotId: string) => {
      if (!selectedStrain || playerBuds < selectedStrain.seedCost) return;

      setSlots((prev) =>
        prev.map((slot) =>
          slot.id === slotId
            ? {
                ...slot,
                strain: selectedStrain,
                plantedAt: Date.now(),
                lastWatered: Date.now(),
                currentStage: 0,
                progress: 0,
                isWilted: false,
              }
            : slot
        )
      );

      onUpdateBuds(-selectedStrain.seedCost);
    },
    [selectedStrain, playerBuds, onUpdateBuds]
  );

  // Regar
  const handleWater = useCallback((slotId: string) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, lastWatered: Date.now() } : slot
      )
    );
  }, []);

  // Colher
  const handleHarvest = useCallback(
    (slotId: string) => {
      setSlots((prev) =>
        prev.map((slot) => {
          if (slot.id !== slotId || !slot.strain) return slot;

          if (slot.isWilted) {
            // Planta murcha - sem recompensa
            setStats((s) => ({ ...s, wiltedPlants: s.wiltedPlants + 1 }));
          } else if (slot.progress >= 100) {
            // Colheita bem-sucedida
            const baseYield = Math.floor(
              Math.random() * (slot.strain.yield.max - slot.strain.yield.min + 1) +
                slot.strain.yield.min
            );
            const bonusYield = Math.floor(baseYield * getYieldBonus());
            const totalYield = baseYield + bonusYield;

            onUpdateBuds(totalYield);

            // Adicionar flores ao inventário
            const flowerItem: InventoryItem = {
              id: `flower_${slot.strain.id}`,
              name: `Flor de ${slot.strain.name}`,
              description: `Flores secas de ${slot.strain.name} de alta qualidade`,
              quantity: totalYield,
              type: 'flower',
              rarity: slot.strain.rarity,
              icon: '🌿',
              strainId: slot.strain.id,
            };
            onAddInventoryItem(flowerItem);

            const isPerfect = slot.progress === 100 && !slot.isWilted;
            const xpGained = slot.strain.expPerHarvest;
            setStats((s) => ({
              ...s,
              totalHarvests: s.totalHarvests + 1,
              totalYield: s.totalYield + totalYield,
              totalXP: s.totalXP + xpGained,
              perfectHarvests: isPerfect ? s.perfectHarvests + 1 : s.perfectHarvests,
              bestStrain: s.bestStrain || slot.strain?.name || null,
            }));
          }

          return {
            ...slot,
            strain: null,
            plantedAt: null,
            lastWatered: null,
            currentStage: 0,
            progress: 0,
            isWilted: false,
          };
        })
      );
    },
    [getYieldBonus, onUpdateBuds, onAddInventoryItem]
  );

  // Comprar upgrade
  const handlePurchaseUpgrade = useCallback(
    (upgradeId: string) => {
      const upgrade = upgrades.find((u) => u.id === upgradeId);
      if (!upgrade || upgrade.level >= upgrade.maxLevel) return;

      const cost = upgrade.cost * Math.pow(1.5, upgrade.level);
      if (playerBuds < cost) return;

      setUpgrades((prev) =>
        prev.map((u) =>
          u.id === upgradeId ? { ...u, level: u.level + 1 } : u
        )
      );

      onUpdateBuds(-Math.floor(cost));

      // Se for upgrade de slot, adicionar novos slots
      if (upgrade.effect.type === 'slots') {
        const newSlots: PlantSlot[] = [];
        for (let i = 0; i < upgrade.effect.value; i++) {
          newSlots.push({
            id: `${slots.length + i + 1}`,
            strain: null,
            plantedAt: null,
            currentStage: 0,
            lastWatered: null,
            isWilted: false,
            progress: 0,
          });
        }
        setSlots((prev) => [...prev, ...newSlots]);
      }
    },
    [upgrades, playerBuds, onUpdateBuds, slots.length]
  );

  return {
    slots: slots.slice(0, getTotalSlots()),
    availableStrains,
    selectedStrain,
    setSelectedStrain,
    upgrades,
    stats,
    handlePlant,
    handleWater,
    handleHarvest,
    handlePurchaseUpgrade,
  };
};

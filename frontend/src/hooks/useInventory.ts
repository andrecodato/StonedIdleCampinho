import { useState, useEffect, useCallback } from 'react';
import ApiService, { InventoryItem } from '@/services/api';

export const useInventory = () => {
  const [inventory, setInventory] = useState<Record<string, InventoryItem>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar inventário do backend
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const nickname = localStorage.getItem('playerNickname');
        if (!nickname) return;

        const response = await ApiService.getInventory(nickname);
        setInventory(response.inventory || {});
        setIsLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar inventário:', error);
        setIsLoaded(true);
      }
    };

    loadInventory();
  }, []);

  // Adicionar item ao inventário
  const addItem = useCallback(async (item: InventoryItem) => {
    try {
      const nickname = localStorage.getItem('playerNickname');
      if (!nickname) return;

      const response = await ApiService.addInventoryItem(nickname, item);
      setInventory(response.inventory);
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  }, []);

  // Salvar inventário (debounced)
  useEffect(() => {
    if (!isLoaded) return;

    const saveInventory = async () => {
      try {
        const nickname = localStorage.getItem('playerNickname');
        if (!nickname) return;

        await ApiService.saveInventory(nickname, inventory);
      } catch (error) {
        console.error('Erro ao salvar inventário:', error);
      }
    };

    const debounceTimer = setTimeout(saveInventory, 1000);
    return () => clearTimeout(debounceTimer);
  }, [inventory, isLoaded]);

  return {
    inventory,
    addItem,
    isLoaded,
  };
};

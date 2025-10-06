import { useState } from 'react';
import { InventoryItem } from '@/services/api';

interface InventoryPanelProps {
  inventory: Record<string, InventoryItem>;
}

const RARITY_COLORS: Record<string, string> = {
  common: 'text-gray-400 border-gray-600',
  uncommon: 'text-green-400 border-green-600',
  rare: 'text-blue-400 border-blue-600',
  epic: 'text-purple-400 border-purple-600',
  legendary: 'text-yellow-400 border-yellow-600',
};

export const InventoryPanel = ({ inventory }: InventoryPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const items = Object.values(inventory);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Agrupa itens por tipo
  const flowerItems = items.filter(item => item.type === 'flower');

  return (
    <div className="border-b border-gray-700">
      {/* Header - sempre visível */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🎒</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Inventário</p>
            <p className="text-xs text-gray-400">{totalItems} itens</p>
          </div>
        </div>
        <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Conteúdo expansível */}
      {isExpanded && (
        <div className="px-4 py-3 bg-[#1a1d29] space-y-2 max-h-64 overflow-y-auto">
          {flowerItems.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-2">
              Nenhum item ainda. Comece plantando!
            </p>
          ) : (
            flowerItems.map(item => (
              <div
                key={item.id}
                className={`flex items-center gap-2 p-2 rounded border ${RARITY_COLORS[item.rarity] || RARITY_COLORS.common}`}
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${RARITY_COLORS[item.rarity]?.split(' ')[0] || 'text-gray-400'}`}>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{item.description}</p>
                </div>
                <span className="text-xs font-bold text-white bg-gray-700 px-2 py-1 rounded">
                  x{item.quantity}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

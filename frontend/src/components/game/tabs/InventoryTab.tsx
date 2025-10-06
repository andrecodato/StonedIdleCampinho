import { InventoryItem } from '@/services/api';

const RARITY_COLORS: Record<string, string> = {
  common: 'border-gray-500 bg-gray-900/50',
  uncommon: 'border-green-500 bg-green-900/20',
  rare: 'border-blue-500 bg-blue-900/20',
  epic: 'border-purple-500 bg-purple-900/20',
  legendary: 'border-yellow-500 bg-yellow-900/20',
};

const RARITY_TEXT_COLORS: Record<string, string> = {
  common: 'text-gray-400',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
};

interface InventoryTabProps {
  inventory: Record<string, InventoryItem>;
}

export const InventoryTab = ({ inventory }: InventoryTabProps) => {
  const flowerItems = Object.values(inventory).filter(item => item.type === 'flower');
  const otherItems = Object.values(inventory).filter(item => item.type !== 'flower');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-green-400 mb-2">🎒 Inventário</h2>
        <p className="text-gray-400">
          {Object.keys(inventory).length} tipos de itens coletados
        </p>
      </div>

      {/* Flores */}
      {flowerItems.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
            <span>🌿</span>
            <span>Flores</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {flowerItems.map((item) => (
              <div
                key={item.id}
                className={`border-2 rounded-lg p-4 transition-all hover:scale-105 ${
                  RARITY_COLORS[item.rarity] || RARITY_COLORS.common
                }`}
              >
                <div className="text-4xl mb-2 text-center">{item.icon}</div>
                <div className="text-center">
                  <h4 className={`font-bold mb-1 ${RARITY_TEXT_COLORS[item.rarity] || RARITY_TEXT_COLORS.common}`}>
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">{item.description}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-2xl font-bold text-white">{item.quantity}</span>
                    <span className="text-xs text-gray-500">unidades</span>
                  </div>
                  <div className="mt-2">
                    <span className={`text-xs uppercase tracking-wider ${RARITY_TEXT_COLORS[item.rarity] || RARITY_TEXT_COLORS.common}`}>
                      {item.rarity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Outros Itens */}
      {otherItems.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
            <span>📦</span>
            <span>Outros Itens</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {otherItems.map((item) => (
              <div
                key={item.id}
                className={`border-2 rounded-lg p-4 transition-all hover:scale-105 ${
                  RARITY_COLORS[item.rarity] || RARITY_COLORS.common
                }`}
              >
                <div className="text-4xl mb-2 text-center">{item.icon}</div>
                <div className="text-center">
                  <h4 className={`font-bold mb-1 ${RARITY_TEXT_COLORS[item.rarity] || RARITY_TEXT_COLORS.common}`}>
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">{item.description}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-2xl font-bold text-white">{item.quantity}</span>
                    <span className="text-xs text-gray-500">unidades</span>
                  </div>
                  <div className="mt-2">
                    <span className={`text-xs uppercase tracking-wider ${RARITY_TEXT_COLORS[item.rarity] || RARITY_TEXT_COLORS.common}`}>
                      {item.rarity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {Object.keys(inventory).length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎒</div>
          <h3 className="text-xl font-bold text-gray-400 mb-2">Inventário Vazio</h3>
          <p className="text-gray-500">
            Colha suas plantas para começar a coletar flores e outros itens!
          </p>
        </div>
      )}
    </div>
  );
};

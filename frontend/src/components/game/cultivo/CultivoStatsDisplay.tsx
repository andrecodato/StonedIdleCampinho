import { CultivoStats } from '@/types/cultivo.types';

interface CultivoStatsDisplayProps {
  stats: CultivoStats;
}

export const CultivoStatsDisplay = ({ stats }: CultivoStatsDisplayProps) => {
  return (
    <div className="bg-[#2d3142] rounded-lg p-4 mb-6">
      <h3 className="text-lg font-bold text-green-400 mb-3">📊 Estatísticas de Cultivo</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.totalHarvests}</div>
          <div className="text-xs text-gray-400">Colheitas Totais</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{stats.totalYield}</div>
          <div className="text-xs text-gray-400">Buds Colhidos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.perfectHarvests}</div>
          <div className="text-xs text-gray-400">Colheitas Perfeitas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">{stats.wiltedPlants}</div>
          <div className="text-xs text-gray-400">Plantas Murchas</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-purple-400 truncate">
            {stats.bestStrain || 'N/A'}
          </div>
          <div className="text-xs text-gray-400">Melhor Strain</div>
        </div>
      </div>
    </div>
  );
};

import Image from 'next/image';
import { TabType } from '@/types/game.types';
import { PlayerInfo } from './PlayerInfo';

interface GameSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  playerNickname: string;
  onLogout: () => void;
}

export const GameSidebar = ({ 
  activeTab, 
  onTabChange, 
  playerNickname, 
  onLogout 
}: GameSidebarProps) => {
  return (
    <div className="w-48 bg-[#252836] border-r border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-center">
        <Image 
          src="/logo.png" 
          alt="Cannabis Cultivator Logo" 
          width={120} 
          height={120}
          className="object-contain"
          priority
        />
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 py-4">
        <div className="mb-6">
          <p className="px-4 text-xs text-gray-500 uppercase tracking-wider mb-2">Combate</p>
          <button className="w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2">
            <span>⚔️</span>
            <span className="text-sm">Nível de Combate 3</span>
          </button>
        </div>

        <div className="mb-6">
          <p className="px-4 text-xs text-gray-500 uppercase tracking-wider mb-2">Passivo</p>
          <button
            onClick={() => onTabChange('cultivo')}
            className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2 ${
              activeTab === 'cultivo' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>🌲</span>
            <span className="text-sm">Corte de Lenha</span>
            <span className="ml-auto text-xs">(SS / 99)</span>
          </button>
          <button
            onClick={() => onTabChange('agricultura')}
            className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2 ${
              activeTab === 'agricultura' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>🌾</span>
            <span className="text-sm">Agricultura</span>
            <span className="ml-auto text-xs">(1 / 99)</span>
          </button>
          <button
            onClick={() => onTabChange('municipio')}
            className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2 ${
              activeTab === 'municipio' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>🏛️</span>
            <span className="text-sm">Município</span>
            <span className="ml-auto text-xs">(5 / 99)</span>
          </button>
        </div>

        <div>
          <p className="px-4 text-xs text-gray-500 uppercase tracking-wider mb-2">Outros</p>
          <button
            onClick={() => onTabChange('loja')}
            className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2 ${
              activeTab === 'loja' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>🏪</span>
            <span className="text-sm">Loja</span>
          </button>
        </div>
      </nav>

      <PlayerInfo nickname={playerNickname} onLogout={onLogout} />
    </div>
  );
};

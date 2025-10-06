import Image from 'next/image';
import { TabType } from '@/types/game.types';
import { PlayerInfo } from './PlayerInfo';

interface GameSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  playerNickname: string;
  cultivoLevel?: number;
  onLogout: () => void;
}

export const GameSidebar = ({ 
  activeTab, 
  onTabChange, 
  playerNickname,
  cultivoLevel = 1,
  onLogout 
}: GameSidebarProps) => {
  return (
    <div className="w-48 bg-[#252836] border-r border-gray-700 flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-center flex-shrink-0">
        <Image 
          src="/logo.png" 
          alt="Cannabis Cultivator Logo" 
          width={120} 
          height={120}
          className="object-contain"
          priority
        />
      </div>

      {/* Menu de Navegação com Scroll */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="mb-6">
          <p className="px-4 text-xs text-gray-500 uppercase tracking-wider mb-2">Combate</p>
          <button className="w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed" disabled>
            <span>⚔️</span>
            <span className="text-sm">Combate</span>
            <span className="ml-auto text-xs">(1 / 99)</span>
          </button>
        </div>

        <div className="mb-6">
          <p className="px-4 text-xs text-gray-500 uppercase tracking-wider mb-2">Skills Passivas</p>
          
          {/* Cultivo */}
          <button
            onClick={() => onTabChange('cultivo')}
            className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2 ${
              activeTab === 'cultivo' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>🪴</span>
            <span className="text-sm">Cultivo</span>
            <span className="ml-auto text-xs">({cultivoLevel} / 99)</span>
          </button>

          {/* Culinária Canábica */}
          <button
            onClick={() => onTabChange('culinaria')}
            className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2 ${
              activeTab === 'culinaria' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>�</span>
            <span className="text-sm">Culinária</span>
            <span className="ml-auto text-xs">(1 / 99)</span>
          </button>

          {/* Artesanato */}
          <button
            onClick={() => onTabChange('artesanato')}
            className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2 ${
              activeTab === 'artesanato' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>🔨</span>
            <span className="text-sm">Artesanato</span>
            <span className="ml-auto text-xs">(1 / 99)</span>
          </button>

          {/* Química/Extração */}
          <button
            onClick={() => onTabChange('quimica')}
            className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2 ${
              activeTab === 'quimica' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>⚗️</span>
            <span className="text-sm">Química</span>
            <span className="ml-auto text-xs">(1 / 99)</span>
          </button>

          {/* Comércio */}
          <button
            onClick={() => onTabChange('comercio')}
            className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2 ${
              activeTab === 'comercio' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>💰</span>
            <span className="text-sm">Comércio</span>
            <span className="ml-auto text-xs">(1 / 99)</span>
          </button>

          {/* Exploração */}
          <button
            onClick={() => onTabChange('exploracao')}
            className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2 ${
              activeTab === 'exploracao' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>🗺️</span>
            <span className="text-sm">Exploração</span>
            <span className="ml-auto text-xs">(1 / 99)</span>
          </button>
        </div>

        <div className="mb-6">
          <p className="px-4 text-xs text-gray-500 uppercase tracking-wider mb-2">Hobbies</p>
          
          <button className="w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2 opacity-50" disabled>
            <span>🧘</span>
            <span className="text-xs">Jardinagem Zen</span>
          </button>

          <button className="w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2 opacity-50" disabled>
            <span>👨‍🍳</span>
            <span className="text-xs">Chef Alternativo</span>
          </button>

          <button className="w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2 opacity-50" disabled>
            <span>🎨</span>
            <span className="text-xs">Artista do Bong</span>
          </button>
        </div>

        <div>
          <p className="px-4 text-xs text-gray-500 uppercase tracking-wider mb-2">Outros</p>
          <button
            onClick={() => onTabChange('inventario')}
            className={`w-full px-4 py-2 text-left transition-colors flex items-center gap-2 ${
              activeTab === 'inventario' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>🎒</span>
            <span className="text-sm">Inventário</span>
          </button>
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

import { TabType } from '@/types/game.types';
import { GameSidebar } from './GameSidebar';
import { GameHeader } from './GameHeader';
import { Player } from '@/services/api';

interface GameLayoutProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  playerNickname: string;
  player: Player | null;
  onLogout: () => void;
  children: React.ReactNode;
}

export const GameLayout = ({ 
  activeTab, 
  onTabChange, 
  playerNickname, 
  player,
  onLogout, 
  children 
}: GameLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#1a1d29] text-white flex">
      <GameSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        playerNickname={playerNickname}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col">
        <GameHeader player={player} />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

import { TabType } from '@/types/game.types';
import { GameSidebar } from './GameSidebar';
import { GameHeader } from './GameHeader';
import { SkillLevelBar } from './SkillLevelBar';
import { Player } from '@/services/api';

interface GameLayoutProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  playerNickname: string;
  player: Player | null;
  cultivoLevel?: number;
  cultivoXP?: number;
  cultivoXPToNext?: number;
  onLogout: () => void;
  children: React.ReactNode;
}

export const GameLayout = ({ 
  activeTab, 
  onTabChange, 
  playerNickname, 
  player,
  cultivoLevel = 1,
  cultivoXP = 0,
  cultivoXPToNext = 100,
  onLogout, 
  children 
}: GameLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#1a1d29] text-white flex">
      <GameSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        playerNickname={playerNickname}
        cultivoLevel={cultivoLevel}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col ml-48">
        <SkillLevelBar
          skillName="Cultivo de Cannabis"
          skillIcon="🪴"
          currentLevel={cultivoLevel}
          currentXP={cultivoXP}
          xpToNextLevel={cultivoXPToNext}
        />
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

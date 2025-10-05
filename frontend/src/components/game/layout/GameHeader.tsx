import { Player } from '@/services/api';
import { SkillLevel } from '../resources/SkillLevel';
import { ResourceDisplay } from '../resources/ResourceDisplay';
import { ExperienceBar } from '../resources/ExperienceBar';

interface GameHeaderProps {
  player: Player | null;
}

export const GameHeader = ({ player }: GameHeaderProps) => {
  return (
    <div className="bg-[#2d3142] border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <SkillLevel 
            icon="🌿" 
            level="SS" 
            maxLevel={99} 
          />

          <div className="flex items-center gap-6">
            <ResourceDisplay 
              label="Buds" 
              value={player?.stonedPoints || 0}
              valueClassName="text-yellow-400"
            />
            <ResourceDisplay 
              label="Machado Atual" 
              value="Machado de Bronze"
              valueClassName="text-gray-300 text-sm"
            />
          </div>
        </div>

        <ExperienceBar 
          currentExp={1475844}
          maxExp={1629200}
          percentage={90}
        />
      </div>
    </div>
  );
};

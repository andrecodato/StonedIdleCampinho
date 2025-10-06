interface SkillLevelBarProps {
  skillName: string;
  skillIcon: string;
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  maxLevel?: number;
}

export const SkillLevelBar = ({
  skillName,
  skillIcon,
  currentLevel,
  currentXP,
  xpToNextLevel,
  maxLevel = 99,
}: SkillLevelBarProps) => {
  const progress = (currentXP / xpToNextLevel) * 100;
  const isMaxLevel = currentLevel >= maxLevel;

  return (
    <div className="bg-[#252836] border-b border-gray-700 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Skill Icon & Name */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <span className="text-2xl">{skillIcon}</span>
          <div>
            <h3 className="text-sm font-bold text-green-400">{skillName}</h3>
            <p className="text-xs text-gray-400">
              Nível {currentLevel} / {maxLevel}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1">
          <div className="relative h-8 bg-gray-700 rounded-full overflow-hidden">
            {/* Progress Fill */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300 ease-out"
              style={{ width: `${isMaxLevel ? 100 : progress}%` }}
            >
              {/* Shine Effect */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>

            {/* Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-lg">
                {isMaxLevel ? (
                  'NÍVEL MÁXIMO'
                ) : (
                  <>
                    {currentXP.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP ({progress.toFixed(1)}%)
                  </>
                )}
              </span>
            </div>
          </div>

          {/* XP Remaining */}
          {!isMaxLevel && (
            <p className="text-xs text-gray-400 mt-1 text-center">
              {(xpToNextLevel - currentXP).toLocaleString()} XP para o próximo nível
            </p>
          )}
        </div>

        {/* Level Badge */}
        <div className="min-w-[80px] text-right">
          <div className="inline-flex items-center gap-1 bg-green-600 px-3 py-1.5 rounded-full">
            <span className="text-xs font-bold">LVL</span>
            <span className="text-xl font-bold">{currentLevel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

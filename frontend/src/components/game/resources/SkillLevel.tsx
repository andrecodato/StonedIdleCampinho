interface SkillLevelProps {
  icon: string;
  level: string;
  maxLevel: number;
}

export const SkillLevel = ({ icon, level, maxLevel }: SkillLevelProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">Nível de Habilidade</p>
        <p className="text-lg font-bold text-green-400">{level} / {maxLevel}</p>
      </div>
    </div>
  );
};

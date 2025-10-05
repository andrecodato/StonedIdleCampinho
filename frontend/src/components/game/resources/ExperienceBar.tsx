interface ExperienceBarProps {
  currentExp: number;
  maxExp: number;
  percentage: number;
}

export const ExperienceBar = ({ currentExp, maxExp, percentage }: ExperienceBarProps) => {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>EXP de Habilidade</span>
        <span>{currentExp.toLocaleString()} / {maxExp.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

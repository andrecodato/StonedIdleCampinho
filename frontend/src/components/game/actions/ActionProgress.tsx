interface ActionProgressProps {
  progress: number;
}

export const ActionProgress = ({ progress }: ActionProgressProps) => {
  return (
    <div className="mb-3">
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-green-500 h-3 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

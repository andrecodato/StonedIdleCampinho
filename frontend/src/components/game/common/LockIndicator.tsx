interface LockIndicatorProps {
  level: number;
}

export const LockIndicator = ({ level }: LockIndicatorProps) => {
  return (
    <div className="bg-red-900/30 rounded p-2 text-center">
      <p className="text-xs text-red-400">🔒 Nível {level}</p>
    </div>
  );
};

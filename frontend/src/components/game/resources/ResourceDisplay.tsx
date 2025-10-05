interface ResourceDisplayProps {
  label: string;
  value: string | number;
  valueClassName?: string;
}

export const ResourceDisplay = ({ 
  label, 
  value, 
  valueClassName = 'text-yellow-400' 
}: ResourceDisplayProps) => {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-lg font-bold ${valueClassName}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
};

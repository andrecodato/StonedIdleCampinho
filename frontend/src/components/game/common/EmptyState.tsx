interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

export const EmptyState = ({ 
  icon = '🚧', 
  title, 
  description = 'Esta seção estará disponível em breve!' 
}: EmptyStateProps) => {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-400 mb-2">{title}</h2>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

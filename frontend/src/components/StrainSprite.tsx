import React from 'react';

interface StrainSpriteProps {
  strainId: number;
  isPassive?: boolean;
  isActive?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const StrainSprite: React.FC<StrainSpriteProps> = ({ 
  strainId, 
  isPassive = false, 
  isActive = false, 
  size = 'medium',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16', 
    large: 'w-24 h-24'
  };

  const spriteClasses = [
    'strain-sprite',
    `strain-sprite-${strainId}`,
    sizeClasses[size],
    isPassive ? 'passive' : '',
    isActive ? 'active' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={spriteClasses}
      data-strain-id={strainId}
      style={{
        imageRendering: 'pixelated',
      }}
      title={`Strain ${strainId} ${isPassive ? '(Passiva)' : ''}`}
    >
      {/* Fallback text quando sprite não carregar */}
      <span className="sr-only">S{strainId}</span>
    </div>
  );
};

export default StrainSprite;
import React, { useEffect, useState } from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  points: number;
}

interface ParticleSystemProps {
  isActive: boolean;
  points: number;
  className?: string;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ isActive, points, className = '' }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!isActive) return;

    // Criar novas partículas
    const newParticles: Particle[] = [];
    const particleCount = Math.min(points / 10, 8); // Máximo 8 partículas

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
        x: 50 + (Math.random() - 0.5) * 20, // Centro com variação
        y: 50 + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 100, // Velocidade horizontal
        vy: -Math.random() * 80 - 20, // Velocidade vertical (para cima)
        life: 0,
        maxLife: 1000 + Math.random() * 500, // 1-1.5 segundos
        points: points,
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  }, [isActive, points]);

  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx * 0.016, // 60fps
            y: particle.y + particle.vy * 0.016,
            vy: particle.vy + 100 * 0.016, // Gravidade
            life: particle.life + 16, // Incrementar vida
          }))
          .filter(particle => particle.life < particle.maxLife)
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [particles.length]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map(particle => {
        const opacity = 1 - (particle.life / particle.maxLife);
        const scale = 0.5 + (particle.life / particle.maxLife) * 0.5;
        
        return (
          <div
            key={particle.id}
            className="absolute text-green-400 font-bold text-sm select-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity,
              transform: `translate(-50%, -50%) scale(${scale})`,
              textShadow: '0 0 4px rgba(34, 197, 94, 0.8)',
            }}
          >
            +{particle.points}
          </div>
        );
      })}
    </div>
  );
};

export default ParticleSystem;
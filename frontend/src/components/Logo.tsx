import React from 'react';
import { Heart } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 bg-primary/20 rounded-2xl animate-pulse-ring" />
        <div className="relative flex items-center justify-center w-full h-full bg-primary rounded-2xl shadow-health">
          <Heart className="w-1/2 h-1/2 text-primary-foreground fill-primary-foreground" />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold text-foreground tracking-tight`}>
            Eldocare
          </span>
        <span className="text-xs text-muted-foreground font-medium tracking-wide">
          Health System
        </span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { RiskLevel } from '@/types';
import { getRiskColor, getRiskLabel } from '@/lib/triage-engine';
import { AlertTriangle, AlertCircle, Info, XCircle } from 'lucide-react';

interface RiskBadgeProps {
  risk: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ risk, size = 'md', showIcon = true }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSize = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  const Icon = {
    low: Info,
    medium: AlertCircle,
    high: AlertTriangle,
    critical: XCircle,
  }[risk];

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${sizeClasses[size]} ${getRiskColor(risk)}`}
    >
      {showIcon && <Icon size={iconSize[size]} />}
      {getRiskLabel(risk)}
    </span>
  );
};

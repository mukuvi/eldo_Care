import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'critical';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  variant = 'default' 
}) => {
  const variantClasses = {
    default: 'bg-card border-border',
    primary: 'bg-primary/5 border-primary/20',
    success: 'bg-success/5 border-success/20',
    warning: 'bg-warning/5 border-warning/20',
    critical: 'bg-critical/5 border-critical/20',
  };

  const iconClasses = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    critical: 'bg-critical/10 text-critical',
  };

  return (
    <div className={`stat-card border-2 ${variantClasses[variant]} animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.positive ? 'text-success' : 'text-critical'}`}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${iconClasses[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

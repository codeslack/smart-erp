import React from 'react';
import { Card } from 'flowbite-react';
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  change?: string | number;
  trend?: 'up' | 'down' | 'neutral';
  timeframe?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  trend = 'neutral',
  timeframe = 'vs last month',
  className = '',
}) => {
  return (
    <Card className={`border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center text-sm">
          {trend === 'up' && (
            <span className="flex items-center font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="mr-1 h-4 w-4" />
              {change}
            </span>
          )}
          {trend === 'down' && (
            <span className="flex items-center font-semibold text-rose-600 dark:text-rose-400">
              <TrendingDown className="mr-1 h-4 w-4" />
              {change}
            </span>
          )}
          {trend === 'neutral' && (
            <span className="flex items-center font-medium text-gray-500 dark:text-gray-400">
              <Minus className="mr-1 h-4 w-4" />
              {change}
            </span>
          )}
          {timeframe && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{timeframe}</span>
          )}
        </div>
      )}
    </Card>
  );
};

'use client';

import React from 'react';
import { Badge } from '@/app/components/ui/badge';
import { Zap } from 'lucide-react';

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export function MatchScore({ score, size = 'md', showPercentage = true }: MatchScoreProps) {
  const getColor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const sizeMap = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold text-white ${getColor()} ${sizeMap[size]}`}
    >
      {score}
      {showPercentage && <span className="text-xs">%</span>}
    </div>
  );
}

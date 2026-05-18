'use client';

import React from 'react';
import { Card } from '@/app/components/ui/card';
import { TrendingUp, Users, Briefcase, CheckCircle2 } from 'lucide-react';

interface StatCardData {
  label: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
}

interface RecruiterStatsCardsProps {
  stats: StatCardData[];
}

export function RecruiterStatsCards({ stats }: RecruiterStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <Card key={idx} className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
              {stat.change !== undefined && (
                <p className={`text-sm font-medium mt-2 ${
                  stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change >= 0 ? '+' : ''}{stat.change}% vs mes anterior
                </p>
              )}
            </div>
            <div className="text-2xl opacity-50">{stat.icon}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

'use client';

import React from 'react';
import type { ScoreBreakdown as ScoreBreakdownType } from '@/types';
import { Card } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType;
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  const categories = [
    {
      name: 'Habilidades',
      score: breakdown.skills,
      icon: '🎯',
    },
    {
      name: 'Experiencia',
      score: breakdown.experience,
      icon: '💼',
    },
    ...(breakdown.salary ? [{ name: 'Salario', score: breakdown.salary, icon: '💰' }] : []),
    ...(breakdown.workMode ? [{ name: 'Modalidad', score: breakdown.workMode, icon: '📍' }] : []),
    ...(breakdown.location ? [{ name: 'Ubicación', score: breakdown.location, icon: '🌍' }] : []),
    ...(breakdown.availability ? [{ name: 'Disponibilidad', score: breakdown.availability, icon: '⏰' }] : []),
  ];

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Desglose de puntuación</h3>
      <div className="space-y-4">
        {categories.map((category, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <span>{category.icon}</span>
                {category.name}
              </span>
              <span className="text-sm font-bold text-primary">{Math.round(category.score.score)}%</span>
            </div>
            <Progress value={category.score.score} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Peso: {Math.round(category.score.weight * 100)}%</p>
          </div>
        ))}

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">{Math.round(breakdown.total)}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

'use client';

import React from 'react';
import { Card } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { CheckCircle2, Circle, Award } from 'lucide-react';

interface GamificationPanelProps {
  completionPercentage: number;
  badges: { name: string; icon: string; unlocked: boolean }[];
  missions: { title: string; completed: boolean; reward: number }[];
  points: number;
}

export function CandidateGamificationPanel({
  completionPercentage,
  badges,
  missions,
  points,
}: GamificationPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Completion Card */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Completitud del Perfil</h3>
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#3b82f6"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(completionPercentage / 100) * 351} 351`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <div className="text-3xl font-bold">{completionPercentage}%</div>
              <div className="text-xs text-muted-foreground">completado</div>
            </div>
          </div>
        </div>
        <Button className="w-full">Completar Perfil</Button>
      </Card>

      {/* Badges Card */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Award size={18} />
          Insignias ({badges.filter((b) => b.unlocked).length}/{badges.length})
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg text-center ${
                badge.unlocked ? 'bg-primary/10 border border-primary' : 'bg-muted opacity-50'
              }`}
            >
              <div className="text-2xl mb-1">{badge.icon}</div>
              <p className="text-xs font-medium">{badge.name}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Missions Card */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Misiones Activas</h3>
        <div className="space-y-3">
          {missions.map((mission, idx) => (
            <div key={idx} className="flex items-start gap-3">
              {mission.completed ? (
                <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle size={20} className="text-muted-foreground flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{mission.title}</p>
                <p className="text-xs text-muted-foreground">+{mission.reward} puntos</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm">
            <span className="font-semibold text-primary">{points}</span> puntos totales
          </p>
        </div>
      </Card>
    </div>
  );
}

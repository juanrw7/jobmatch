'use client';

import React from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface FollowUpSuggestion {
  id: string;
  title: string;
  action: string;
  daysUntilDeadline: number;
  type: 'APPLICATION' | 'INTERVIEW' | 'PROFILE';
}

interface FollowUpAgentCardProps {
  suggestions: FollowUpSuggestion[];
  onTakeAction: (id: string) => void;
}

export function FollowUpAgentCard({ suggestions, onTakeAction }: FollowUpAgentCardProps) {
  const getUrgency = (days: number) => {
    if (days <= 1) return { color: 'destructive', label: 'Urgente' };
    if (days <= 3) return { color: 'default', label: 'Pronto' };
    return { color: 'secondary', label: 'Normal' };
  };

  const typeEmojis: Record<string, string> = {
    APPLICATION: '📋',
    INTERVIEW: '💼',
    PROFILE: '👤',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-3xl">📞</div>
        <div>
          <h3 className="font-semibold">Agente de Seguimiento</h3>
          <p className="text-sm text-muted-foreground">Próximos pasos recomendados</p>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => {
          const urgency = getUrgency(suggestion.daysUntilDeadline);

          return (
            <div key={suggestion.id} className="p-4 border border-border rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span>{typeEmojis[suggestion.type]}</span>
                  <div>
                    <p className="font-medium text-sm">{suggestion.title}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.action}</p>
                  </div>
                </div>
                <Badge variant={urgency.color as any} className="text-xs">
                  {urgency.label}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  En {suggestion.daysUntilDeadline} día{suggestion.daysUntilDeadline !== 1 ? 's' : ''}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onTakeAction(suggestion.id)}
                  className="gap-2"
                >
                  Actuar
                  <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {suggestions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No hay acciones pendientes</p>
        </div>
      )}
    </Card>
  );
}

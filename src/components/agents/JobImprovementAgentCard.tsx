'use client';

import React from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface JobImprovementSuggestion {
  id: string;
  type: 'DESCRIPTION' | 'SKILLS' | 'SALARY' | 'BENEFITS';
  suggestion: string;
  currentValue?: string;
  suggestedValue?: string;
}

interface JobImprovementAgentCardProps {
  suggestions: JobImprovementSuggestion[];
  onApply: (id: string) => void;
}

export function JobImprovementAgentCard({ suggestions, onApply }: JobImprovementAgentCardProps) {
  const typeLabels: Record<string, string> = {
    DESCRIPTION: 'Descripción',
    SKILLS: 'Habilidades',
    SALARY: 'Salario',
    BENEFITS: 'Beneficios',
  };

  const typeIcons: Record<string, string> = {
    DESCRIPTION: '📝',
    SKILLS: '🎯',
    SALARY: '💰',
    BENEFITS: '🎁',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-3xl">🚀</div>
        <div>
          <h3 className="font-semibold">Agente de Mejora de Vacantes</h3>
          <p className="text-sm text-muted-foreground">Sugiere mejoras para tus publicaciones</p>
        </div>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span>{typeIcons[suggestion.type]}</span>
              <Badge variant="outline">{typeLabels[suggestion.type]}</Badge>
            </div>
            <p className="text-sm mb-3">{suggestion.suggestion}</p>

            {suggestion.currentValue && suggestion.suggestedValue && (
              <div className="mb-3 grid grid-cols-2 gap-3 p-3 bg-muted rounded">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Actual</p>
                  <p className="text-sm">{suggestion.currentValue}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Sugerido</p>
                  <p className="text-sm text-green-600">{suggestion.suggestedValue}</p>
                </div>
              </div>
            )}

            <Button size="sm" onClick={() => onApply(suggestion.id)}>
              Aplicar sugerencia
            </Button>
          </div>
        ))}
      </div>

      {suggestions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Tus vacantes están optimizadas!</p>
        </div>
      )}
    </Card>
  );
}

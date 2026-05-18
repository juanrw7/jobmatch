'use client';

import React from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Suggestion {
  id: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  description: string;
}

interface ProfileAgentCardProps {
  suggestions: Suggestion[];
  onDismiss: (id: string) => void;
  onAction: (id: string) => void;
}

export function ProfileAgentCard({ suggestions, onDismiss, onAction }: ProfileAgentCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 border-l-4 border-red-500';
      case 'MEDIUM':
        return 'bg-yellow-100 border-l-4 border-yellow-500';
      case 'LOW':
        return 'bg-blue-100 border-l-4 border-blue-500';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-3xl">👤</div>
        <div>
          <h3 className="font-semibold">Agente de Perfil</h3>
          <p className="text-sm text-muted-foreground">Detecta datos faltantes y sugerencias</p>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className={`p-4 rounded-lg ${getPriorityColor(suggestion.priority)}`}>
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium text-sm">{suggestion.title}</p>
              <span className="text-xs font-bold">{suggestion.priority}</span>
            </div>
            <p className="text-sm mb-3">{suggestion.description}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => onAction(suggestion.id)}>
                Tomar acción
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDismiss(suggestion.id)}
              >
                Descartar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {suggestions.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Tu perfil está completo!</p>
        </div>
      )}
    </Card>
  );
}

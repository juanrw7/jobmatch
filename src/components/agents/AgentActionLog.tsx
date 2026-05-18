'use client';

import React from 'react';
import { AgentAction } from '@/types';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface AgentActionLogProps {
  actions: AgentAction[];
  maxItems?: number;
}

export function AgentActionLog({ actions, maxItems = 10 }: AgentActionLogProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Registro de Acciones</h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {actions.slice(0, maxItems).map((action) => (
          <div key={action.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <div className="mt-1">
              {action.success ? (
                <CheckCircle2 size={18} className="text-green-500" />
              ) : (
                <XCircle size={18} className="text-red-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">{action.action}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(action.timestamp).toLocaleString('es-CO')}
                </span>
              </div>
              {action.result && (
                <p className="text-sm text-muted-foreground">{action.result}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {actions.length === 0 && (
        <div className="text-center py-8">
          <Clock size={32} className="text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground">Sin acciones registradas</p>
        </div>
      )}
    </Card>
  );
}

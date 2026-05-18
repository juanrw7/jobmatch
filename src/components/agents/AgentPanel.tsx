'use client';

import React from 'react';
import { Agent, AgentAction } from '@/types';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Zap, Play, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface AgentPanelProps {
  agents: Agent[];
  onRunAgent: (agentId: string) => void;
}

export function AgentPanel({ agents, onRunAgent }: AgentPanelProps) {
  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'IDLE':
        return <Clock size={16} />;
      case 'RUNNING':
        return <Zap size={16} className="animate-spin" />;
      case 'COMPLETED':
        return <CheckCircle2 size={16} className="text-green-500" />;
      case 'ERROR':
        return <AlertCircle size={16} className="text-red-500" />;
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'IDLE':
        return 'bg-gray-100 text-gray-800';
      case 'RUNNING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'ERROR':
        return 'bg-red-100 text-red-800';
    }
  };

  const agentIcons: Record<string, string> = {
    PROFILE: '👤',
    RECOMMENDATIONS: '⭐',
    APPLICATION: '📝',
    FOLLOW_UP: '📞',
    JOB_IMPROVEMENT: '🚀',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <Card key={agent.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{agentIcons[agent.type] || '🤖'}</div>
              <div>
                <h3 className="font-semibold">{agent.name}</h3>
                <p className="text-xs text-muted-foreground">{agent.description}</p>
              </div>
            </div>
          </div>

          <Badge className={`flex items-center gap-1 w-fit mb-4 ${getStatusColor(agent.status)}`}>
            {getStatusIcon(agent.status)}
            <span className="capitalize">{agent.status}</span>
          </Badge>

          {agent.lastRun && (
            <p className="text-xs text-muted-foreground mb-4">
              Última ejecución: {new Date(agent.lastRun).toLocaleString('es-CO')}
            </p>
          )}

          <Button
            onClick={() => onRunAgent(agent.id)}
            disabled={agent.status === 'RUNNING'}
            className="w-full"
          >
            {agent.status === 'RUNNING' ? 'Ejecutando...' : 'Ejecutar'}
          </Button>
        </Card>
      ))}
    </div>
  );
}

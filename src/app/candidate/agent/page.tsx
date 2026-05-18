'use client';

import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { AgentPanel } from '@/components/agents/AgentPanel';
import { AgentActionLog } from '@/components/agents/AgentActionLog';
import { ProfileAgentCard } from '@/components/agents/ProfileAgentCard';
import { FollowUpAgentCard } from '@/components/agents/FollowUpAgentCard';
import type { Agent, AgentAction } from '@/types';

// Mock agents data
const mockAgents: Agent[] = [
  {
    id: '1',
    type: 'PROFILE',
    name: 'Agente de Perfil',
    description: 'Detecta datos faltantes en tu perfil',
    icon: '👤',
    status: 'IDLE',
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    type: 'RECOMMENDATIONS',
    name: 'Agente de Recomendaciones',
    description: 'Encuentra vacantes que te coincidan',
    icon: '⭐',
    status: 'IDLE',
    lastRun: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '3',
    type: 'APPLICATION',
    name: 'Agente de Postulación',
    description: 'Asiste en el proceso de candidatura',
    icon: '📝',
    status: 'IDLE',
  },
  {
    id: '4',
    type: 'FOLLOW_UP',
    name: 'Agente de Seguimiento',
    description: 'Sugiere próximos pasos',
    icon: '📞',
    status: 'IDLE',
  },
];

const mockActions: AgentAction[] = [
  {
    id: '1',
    agentId: '1',
    type: 'SCAN',
    action: 'Perfil escaneado',
    result: 'Se encontraron 3 campos faltantes',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    success: true,
  },
  {
    id: '2',
    agentId: '2',
    type: 'SEARCH',
    action: 'Búsqueda de vacantes',
    result: '12 nuevas recomendaciones encontradas',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    success: true,
  },
];

const profileSuggestions = [
  {
    id: '1',
    priority: 'HIGH' as const,
    title: 'Habilidades incompletas',
    description: 'Agrega más habilidades técnicas para mejorar tu visibilidad',
  },
  {
    id: '2',
    priority: 'MEDIUM' as const,
    title: 'Foto de perfil',
    description: 'Sube una foto profesional para aumentar confianza',
  },
];

const followUpSuggestions = [
  {
    id: '1',
    title: 'Seguimiento a entrevista',
    action: 'Envía un mensaje a Design Studio',
    daysUntilDeadline: 1,
    type: 'INTERVIEW' as const,
  },
  {
    id: '2',
    title: 'Revisar feedback',
    action: 'Tech Corp envió comentarios sobre tu aplicación',
    daysUntilDeadline: 3,
    type: 'APPLICATION' as const,
  },
];

export default function CandidateAgentPage() {
  const handleRunAgent = (agentId: string) => {
    console.log('Running agent:', agentId);
  };

  const handleDismissSuggestion = (id: string) => {
    console.log('Dismissed suggestion:', id);
  };

  const handleActionSuggestion = (id: string) => {
    console.log('Taking action on suggestion:', id);
  };

  const handleFollowUpAction = (id: string) => {
    console.log('Taking follow up action:', id);
  };

  return (
    <RoleGuard allowedRoles={['CANDIDATE']}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Agentes de Automatización</h1>
            <p className="text-muted-foreground">
              Automatización inteligente para mejorar tus oportunidades.
            </p>
          </div>

          {/* Agent Panel */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Agentes Disponibles</h2>
            <AgentPanel agents={mockAgents} onRunAgent={handleRunAgent} />
          </div>

          {/* Main Agents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProfileAgentCard
              suggestions={profileSuggestions}
              onDismiss={handleDismissSuggestion}
              onAction={handleActionSuggestion}
            />
            <FollowUpAgentCard
              suggestions={followUpSuggestions}
              onTakeAction={handleFollowUpAction}
            />
          </div>

          {/* Action Log */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Historial de Acciones</h2>
            <AgentActionLog actions={mockActions} />
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}

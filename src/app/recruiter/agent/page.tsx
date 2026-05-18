'use client';

import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { JobImprovementAgentCard } from '@/components/agents/JobImprovementAgentCard';
import { AgentActionLog } from '@/components/agents/AgentActionLog';
import type { AgentAction } from '@/types';
import { Card } from '@/app/components/ui/card';

// Mock data
const mockSuggestions = [
  {
    id: '1',
    type: 'DESCRIPTION' as const,
    suggestion: 'Agrega más detalles sobre el equipo y proyectos',
    currentValue: 'Buscamos un Senior Developer...',
    suggestedValue: 'Buscamos un Senior Developer para trabajar en nuestros proyectos de FinTech. Te integrarás en un equipo de 8 personas...',
  },
  {
    id: '2',
    type: 'SKILLS' as const,
    suggestion: 'Agrupa habilidades por nivel de importancia',
    currentValue: 'React, TypeScript, Node.js',
    suggestedValue: 'Esencial: React, TypeScript. Deseable: Node.js, PostgreSQL',
  },
  {
    id: '3',
    type: 'SALARY' as const,
    suggestion: 'Aumenta el rango salarial para atraer más talento',
    currentValue: '4M - 6M COP',
    suggestedValue: '5M - 8M COP',
  },
];

const mockActions: AgentAction[] = [
  {
    id: '1',
    agentId: '1',
    type: 'ANALYZE',
    action: 'Análisis de vacante',
    result: 'Vacante optimizable, 3 sugerencias disponibles',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    success: true,
  },
];

export default function RecruiterAgentPage() {
  const handleApplySuggestion = (id: string) => {
    console.log('Apply suggestion:', id);
  };

  return (
    <RoleGuard allowedRoles={['RECRUITER']}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Agentes de Automatización</h1>
            <p className="text-muted-foreground">
              Mejora automáticamente tus vacantes y procesos de selección.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <JobImprovementAgentCard
                suggestions={mockSuggestions}
                onApply={handleApplySuggestion}
              />
            </div>

            <div>
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Información</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <span className="font-semibold">Vacantes analizadas:</span> 12
                  </li>
                  <li>
                    <span className="font-semibold">Sugerencias aplicadas:</span> 8
                  </li>
                  <li>
                    <span className="font-semibold">Mejora de postulaciones:</span> +24%
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Registro de Actividad</h2>
            <AgentActionLog actions={mockActions} />
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}

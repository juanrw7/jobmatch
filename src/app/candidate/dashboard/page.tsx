'use client';

import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { CandidateGamificationPanel } from '@/components/candidate/CandidateGamificationPanel';
import { ApplicationStatusBoard } from '@/components/candidate/ApplicationStatusBoard';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Mock data
const mockApplications = [
  {
    id: '1',
    jobTitle: 'Senior React Developer',
    company: 'Tech Corp',
    status: 'RECOMMENDED' as const,
    appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    jobTitle: 'Full Stack Engineer',
    company: 'StartupXYZ',
    status: 'APPLIED' as const,
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    jobTitle: 'Frontend Lead',
    company: 'Design Studio',
    status: 'INTERVIEW' as const,
    appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

export default function CandidateDashboardPage() {
  return (
    <RoleGuard allowedRoles={['CANDIDATE']}>
      <AppShell>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard de Candidato</h1>
            <p className="text-muted-foreground">
              Bienvenido de vuelta, Juan. Aquí está tu progreso.
            </p>
          </div>

          {/* Gamification Panel */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Tu Progreso</h2>
            <CandidateGamificationPanel
              completionPercentage={65}
              badges={[
                { name: 'First Step', icon: '👣', unlocked: true },
                { name: 'Profile Master', icon: '👤', unlocked: false },
                { name: 'Job Hunter', icon: '🎯', unlocked: true },
              ]}
              missions={[
                { title: 'Completa tu perfil', completed: false, reward: 50 },
                { title: 'Sube tu CV', completed: true, reward: 25 },
                { title: 'Realiza una postulación', completed: true, reward: 30 },
              ]}
              points={105}
            />
          </div>

          {/* Application Status */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Estado de Postulaciones</h2>
            <ApplicationStatusBoard applications={mockApplications} />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Perfil incompleto</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Completa tu perfil para aumentar tus posibilidades de matching.
              </p>
              <Link href="/candidate/profile">
                <Button className="w-full gap-2">
                  Ir a Perfil <ArrowRight size={16} />
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Ver recomendaciones</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tienes 12 nuevas recomendaciones de vacantes.
              </p>
              <Link href="/candidate/recommendations">
                <Button className="w-full gap-2">
                  Ver Vacantes <ArrowRight size={16} />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}

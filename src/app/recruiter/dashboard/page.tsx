'use client';

import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { RecruiterStatsCards } from '@/components/recruiter/RecruiterStatsCards';
import { RecruiterJobCard } from '@/components/recruiter/RecruiterJobCard';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Job } from '@/types';

// Mock data
const mockJobs: Job[] = [
  {
    id: '1',
    recruiterId: 'recruiter1',
    title: 'Senior React Developer',
    description: 'Buscamos un Senior React Developer...',
    requirements: ['React', 'TypeScript'],
    skills: [
      { id: '1', name: 'React', proficiency: 'EXPERT' },
      { id: '2', name: 'TypeScript', proficiency: 'INTERMEDIATE' },
    ],
    responsibilities: [],
    workLocation: {
      workMode: 'HYBRID',
      remoteScope: 'LATAM',
      hybridDaysPerWeek: 2,
      requiresRelocation: false,
      relocationSupport: false,
      city: 'Medellín',
      country: 'Colombia',
    },
    salary: {
      salaryMin: 4000000,
      salaryMax: 7000000,
      currency: 'COP',
      period: 'MONTHLY',
      visibleToCandidate: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true,
  },
];

const mockStats = [
  { label: 'Vacantes Activas', value: 8, change: 12, icon: '📋' },
  { label: 'Candidatos', value: 45, change: -5, icon: '👥' },
  { label: 'Postulaciones', value: 32, change: 25, icon: '📬' },
  { label: 'Entrevistas', value: 5, change: 40, icon: '💼' },
];

export default function RecruiterDashboardPage() {
  return (
    <RoleGuard allowedRoles={['RECRUITER']}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard de Reclutador</h1>
            <p className="text-muted-foreground">
              Bienvenido, María. Aquí está tu resumen de reclutamiento.
            </p>
          </div>

          {/* Stats */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Resumen</h2>
            <RecruiterStatsCards stats={mockStats} />
          </div>

          {/* Recent Jobs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Vacantes Recientes</h2>
              <Link href="/recruiter/jobs/new">
                <Button>Nueva Vacante</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockJobs.map((job) => (
                <RecruiterJobCard
                  key={job.id}
                  job={job}
                  applicantsCount={12}
                  viewsCount={48}
                  qualityScore={85}
                  onEdit={() => console.log('Edit')}
                  onDelete={() => console.log('Delete')}
                  onViewApplicants={() => console.log('View applicants')}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Gestionar Candidatos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Revisa y contacta a los candidatos.
              </p>
              <Link href="/recruiter/candidates">
                <Button className="w-full gap-2">
                  Ver Candidatos <ArrowRight size={16} />
                </Button>
              </Link>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Agentes de Mejora</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Mejora tus vacantes automáticamente.
              </p>
              <Link href="/recruiter/agent">
                <Button className="w-full gap-2">
                  Ir a Agentes <ArrowRight size={16} />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}

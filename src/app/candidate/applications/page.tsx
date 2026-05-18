'use client';

import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import type { ApplicationStatus } from '@/types';

// Mock applications data
const mockApplications = [
  {
    id: '1',
    jobTitle: 'Senior React Developer',
    company: 'Tech Corp',
    status: 'APPLIED' as ApplicationStatus,
    appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    salary: '4.5M - 7M COP',
    location: 'Medellín, Híbrido',
  },
  {
    id: '2',
    jobTitle: 'Full Stack Engineer',
    company: 'StartupXYZ',
    status: 'REVIEWING' as ApplicationStatus,
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    salary: '3.5M - 5.5M COP',
    location: 'Remoto',
  },
  {
    id: '3',
    jobTitle: 'Frontend Lead',
    company: 'Design Studio',
    status: 'INTERVIEW' as ApplicationStatus,
    appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    salary: '4M - 6M COP',
    location: 'Bogotá, Presencial',
  },
];

const statusLabels: Record<ApplicationStatus, string> = {
  RECOMMENDED: 'Recomendado',
  APPLIED: 'Postulado',
  REVIEWING: 'En revisión',
  INTERVIEW: 'Entrevista',
  REJECTED: 'Rechazado',
  OFFER: 'Oferta',
  HIRED: 'Contratado',
};

const statusColors: Record<ApplicationStatus, string> = {
  RECOMMENDED: 'bg-blue-100 text-blue-800',
  APPLIED: 'bg-gray-100 text-gray-800',
  REVIEWING: 'bg-purple-100 text-purple-800',
  INTERVIEW: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  OFFER: 'bg-yellow-100 text-yellow-800',
  HIRED: 'bg-green-100 text-green-800',
};

export default function ApplicationsPage() {
  const statusGroups = mockApplications.reduce(
    (acc, app) => {
      if (!acc[app.status]) acc[app.status] = [];
      acc[app.status].push(app);
      return acc;
    },
    {} as Record<ApplicationStatus, typeof mockApplications>
  );

  return (
    <RoleGuard allowedRoles={['CANDIDATE']}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mis Postulaciones</h1>
            <p className="text-muted-foreground">
              Seguimiento de todas tus postulaciones y estados.
            </p>
          </div>

          <Tabs defaultValue="APPLIED" className="space-y-4">
            <TabsList>
              {(
                Object.entries(statusGroups) as [ApplicationStatus, typeof mockApplications][]
              ).map(([status, apps]) => (
                <TabsTrigger key={status} value={status}>
                  {statusLabels[status]} ({apps.length})
                </TabsTrigger>
              ))}
            </TabsList>

            {(
              Object.entries(statusGroups) as [ApplicationStatus, typeof mockApplications][]
            ).map(([status, apps]) => (
              <TabsContent key={status} value={status} className="space-y-4">
                {apps.map((app) => (
                  <Card key={app.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{app.jobTitle}</h3>
                          <Badge className={statusColors[status]}>
                            {statusLabels[status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{app.company}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-y">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">SALARIO</p>
                        <p className="text-sm font-medium">{app.salary}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">UBICACIÓN</p>
                        <p className="text-sm font-medium">{app.location}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">APLICADO</p>
                        <p className="text-sm font-medium">
                          {app.appliedAt.toLocaleDateString('es-CO')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">ACTUALIZADO</p>
                        <p className="text-sm font-medium">
                          {app.updatedAt.toLocaleDateString('es-CO')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Ver ofertas
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Mensaje
                      </Button>
                      <Button variant="ghost" className="flex-1">
                        Más opciones
                      </Button>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </AppShell>
    </RoleGuard>
  );
}

'use client';

import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Progress } from '@/app/components/ui/progress';
import Link from 'next/link';
import { CheckCircle2, Circle } from 'lucide-react';

// Mock onboarding steps
const steps = [
  { id: 1, title: 'Información Básica', completed: true },
  { id: 2, title: 'Educación', completed: true },
  { id: 3, title: 'Experiencia', completed: false },
  { id: 4, title: 'Habilidades', completed: false },
  { id: 5, title: 'Preferencias', completed: false },
];

export default function CandidateOnboardingPage() {
  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <RoleGuard allowedRoles={['CANDIDATE']}>
      <AppShell>
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Completa tu Perfil</h1>
            <p className="text-muted-foreground">
              Ayudamos a los reclutadores a encontrarte con información completa.
            </p>
          </div>

          {/* Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Tu Progreso</h2>
              <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {completedSteps} de {steps.length} pasos completados
            </p>
          </Card>

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((step) => (
              <Card
                key={step.id}
                className={`p-4 cursor-pointer transition-colors ${
                  step.completed ? 'bg-green-50 border-green-200' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {step.completed ? (
                    <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle size={24} className="text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{step.title}</p>
                  </div>
                  {step.completed && (
                    <span className="text-sm font-semibold text-green-600">Completado</span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Action */}
          <div className="space-y-3">
            <Link href="/candidate/dashboard" className="block">
              <Button className="w-full">Ir al Dashboard</Button>
            </Link>
            <p className="text-sm text-muted-foreground text-center">
              Puedes completar tu perfil más tarde
            </p>
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}

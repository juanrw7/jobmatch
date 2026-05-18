'use client';

import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { CandidatePreferenceForm } from '@/components/candidate/CandidatePreferenceForm';
import { Card } from '@/app/components/ui/card';
import { useState } from 'react';
import type { CandidatePreferences } from '@/types';

// Mock initial preferences
const mockPreferences: CandidatePreferences = {
  workLocation: {
    workMode: 'HYBRID',
    remoteScope: 'COLOMBIA',
    hybridDaysPerWeek: 3,
    requiresRelocation: false,
    relocationSupport: true,
    city: 'Medellín',
    country: 'Colombia',
    timezone: 'America/Bogota',
  },
  salary: {
    salaryMin: 3000000,
    salaryMax: 6000000,
    currency: 'COP',
    period: 'MONTHLY',
    visibleToCandidate: true,
  },
  contractTypes: ['FULL_TIME', 'PART_TIME'],
  availableDate: new Date(),
  visibleToRecruiters: true,
};

export default function CandidateProfilePage() {
  const [preferences, setPreferences] = useState(mockPreferences);

  const handleSavePreferences = (newPreferences: CandidatePreferences) => {
    setPreferences(newPreferences);
    // In real app would call API to save
    console.log('Preferences saved:', newPreferences);
  };

  return (
    <RoleGuard allowedRoles={['CANDIDATE']}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
            <p className="text-muted-foreground">
              Administra tu información y preferencias laborales.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Info */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="p-6">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mb-4">
                  JC
                </div>
                <h2 className="text-lg font-semibold mb-1">Juan Candidato</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  candidate@example.com
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Perfil visto</span>
                    <span className="font-semibold">24 veces</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Postulaciones</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Entrevistas</span>
                    <span className="font-semibold">2</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <CandidatePreferenceForm
                preferences={preferences}
                onSave={handleSavePreferences}
              />
            </div>
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}

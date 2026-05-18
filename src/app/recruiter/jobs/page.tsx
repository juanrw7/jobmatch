'use client';

import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { ApplicantPipeline } from '@/components/recruiter/ApplicantPipeline';
import type { Application } from '@/types';
import { Card } from '@/app/components/ui/card';

// Mock applications for the pipeline
const mockApplications: Application[] = [
  {
    id: '1',
    candidateId: '1',
    jobId: '1',
    status: 'APPLIED',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    candidate: {
      id: '1',
      name: 'Juan Candidato',
      email: 'juan@example.com',
      role: 'CANDIDATE',
      profilePicture: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      skills: [],
      experience: [],
      education: [],
      preferences: {
        workLocation: { workMode: 'HYBRID', requiresRelocation: false, relocationSupport: false },
        salary: { salaryMin: 3000000, salaryMax: 6000000, currency: 'COP', period: 'MONTHLY' },
        contractTypes: [],
        visibleToRecruiters: true,
      },
      profileCompletion: 85,
      badges: [],
      applications: [],
    },
    interactions: [],
  },
  {
    id: '2',
    candidateId: '2',
    jobId: '1',
    status: 'REVIEWING',
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    candidate: {
      id: '2',
      name: 'María Dev',
      email: 'maria@example.com',
      role: 'CANDIDATE',
      profilePicture: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      skills: [],
      experience: [],
      education: [],
      preferences: {
        workLocation: { workMode: 'REMOTE', requiresRelocation: false, relocationSupport: false },
        salary: { salaryMin: 4000000, salaryMax: 8000000, currency: 'COP', period: 'MONTHLY' },
        contractTypes: [],
        visibleToRecruiters: true,
      },
      profileCompletion: 90,
      badges: [],
      applications: [],
    },
    interactions: [],
  },
  {
    id: '3',
    candidateId: '3',
    jobId: '1',
    status: 'INTERVIEW',
    appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    candidate: {
      id: '3',
      name: 'Carlos Engineer',
      email: 'carlos@example.com',
      role: 'CANDIDATE',
      profilePicture: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      skills: [],
      experience: [],
      education: [],
      preferences: {
        workLocation: { workMode: 'HYBRID', requiresRelocation: true, relocationSupport: true },
        salary: { salaryMin: 5000000, salaryMax: 9000000, currency: 'COP', period: 'MONTHLY' },
        contractTypes: [],
        visibleToRecruiters: true,
      },
      profileCompletion: 95,
      badges: [],
      applications: [],
    },
    interactions: [],
  },
];

export default function ApplicantPipelinePage() {
  const handleUpdateStatus = (applicationId: string, newStatus: any) => {
    console.log('Update status:', applicationId, newStatus);
  };

  const handleContact = (applicationId: string) => {
    console.log('Contact applicant:', applicationId);
  };

  const handleScheduleInterview = (applicationId: string) => {
    console.log('Schedule interview:', applicationId);
  };

  return (
    <RoleGuard allowedRoles={['RECRUITER']}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pipeline de Candidatos</h1>
            <p className="text-muted-foreground">
              Gestiona el flujo de candidatos a través de las etapas del proceso de selección.
            </p>
          </div>

          <ApplicantPipeline
            applications={mockApplications}
            onUpdateStatus={handleUpdateStatus}
            onContact={handleContact}
            onScheduleInterview={handleScheduleInterview}
          />
        </div>
      </AppShell>
    </RoleGuard>
  );
}

'use client';

import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { JobRecommendationCard } from '@/components/candidate/JobRecommendationCard';
import { ScoreBreakdown } from '@/components/jobs/ScoreBreakdown';
import type { Job, ScoreBreakdown as ScoreBreakdownType } from '@/types';
import { useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Search } from 'lucide-react';

// Mock jobs data
const mockJobs: Job[] = [
  {
    id: '1',
    recruiterId: 'recruiter1',
    title: 'Senior React Developer',
    description: 'Buscamos un Senior React Developer con experiencia en sistemas de grande escala.',
    requirements: ['React', 'TypeScript', '5+ años'],
    skills: [
      { id: '1', name: 'React', proficiency: 'EXPERT', endorsements: 5 },
      { id: '2', name: 'TypeScript', proficiency: 'INTERMEDIATE', endorsements: 2 },
      { id: '3', name: 'Node.js', proficiency: 'INTERMEDIATE' },
    ],
    responsibilities: ['Diseñar interfaces', 'Mentorear juniors'],
    workLocation: {
      workMode: 'HYBRID',
      remoteScope: 'LATAM',
      hybridDaysPerWeek: 2,
      requiresRelocation: false,
      relocationSupport: false,
      city: 'Medellín',
      country: 'Colombia',
      timezone: 'America/Bogota',
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
  {
    id: '2',
    recruiterId: 'recruiter2',
    title: 'Full Stack Engineer',
    description: 'Ingeniero Full Stack para proyecto de FinTech en crecimiento.',
    requirements: ['React', 'Node.js', 'PostgreSQL'],
    skills: [
      { id: '4', name: 'React', proficiency: 'EXPERT' },
      { id: '5', name: 'Node.js', proficiency: 'EXPERT' },
      { id: '6', name: 'PostgreSQL', proficiency: 'INTERMEDIATE' },
    ],
    responsibilities: ['Desarrollo backend', 'Desarrollo frontend'],
    workLocation: {
      workMode: 'REMOTE',
      remoteScope: 'WORLDWIDE',
      requiresRelocation: false,
      relocationSupport: false,
    },
    salary: {
      salaryMin: 3500000,
      salaryMax: 5500000,
      currency: 'COP',
      period: 'MONTHLY',
      visibleToCandidate: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true,
  },
];

const mockScores = [85, 78];

export default function RecommendationsPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = mockJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedJob = mockJobs.find((j) => j.id === selectedJobId);
  const selectedScore = selectedJob
    ? mockScores[mockJobs.indexOf(selectedJob)]
    : null;

  const scoreBreakdown: ScoreBreakdownType = {
    type: 'CANDIDATE',
    skills: { score: 85, weight: 0.4 },
    experience: { score: 80, weight: 0.15 },
    workMode: { score: 90, weight: 0.15 },
    salary: { score: 75, weight: 0.15 },
    location: { score: 95, weight: 0.1 },
    availability: { score: 100, weight: 0.05 },
    total: selectedScore || 0,
  };

  return (
    <RoleGuard allowedRoles={['CANDIDATE']}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recomendaciones de Vacantes</h1>
            <p className="text-muted-foreground">
              Vacantes personalizadas según tu perfil e intereses.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Jobs List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar vacantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-4">
                {filteredJobs.map((job, idx) => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className="cursor-pointer"
                  >
                    <JobRecommendationCard
                      job={job}
                      matchScore={mockScores[idx]}
                      onViewDetails={() => setSelectedJobId(job.id)}
                      onApply={() => console.log('Applied to', job.id)}
                      saved={idx === 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Score Breakdown */}
            {selectedJob && selectedScore && (
              <div className="lg:col-span-1">
                <ScoreBreakdown breakdown={scoreBreakdown} />
              </div>
            )}
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}

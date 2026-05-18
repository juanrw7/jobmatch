'use client';

import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { CandidateMatchCard } from '@/components/recruiter/CandidateMatchCard';
import type { Candidate } from '@/types';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Search } from 'lucide-react';
import { useState } from 'react';

// Mock candidates
const mockCandidates: Candidate[] = [
  {
    id: '1',
    email: 'juan@example.com',
    name: 'Juan Candidato',
    role: 'CANDIDATE',
    profilePicture: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    bio: 'Senior React Developer con 5+ años de experiencia',
    skills: [
      { id: '1', name: 'React', proficiency: 'EXPERT' },
      { id: '2', name: 'TypeScript', proficiency: 'EXPERT' },
      { id: '3', name: 'Node.js', proficiency: 'INTERMEDIATE' },
    ],
    experience: [
      { id: '1', company: 'Tech Corp', position: 'Senior Developer', current: true, startDate: new Date() },
    ],
    education: [
      { id: '1', school: 'Universidad', degree: 'Ingeniería', field: 'Sistemas' },
    ],
    preferences: {
      workLocation: {
        workMode: 'HYBRID',
        remoteScope: 'COLOMBIA',
        requiresRelocation: false,
        relocationSupport: false,
      },
      salary: {
        salaryMin: 3000000,
        salaryMax: 6000000,
        currency: 'COP',
        period: 'MONTHLY',
      },
      contractTypes: ['FULL_TIME'],
      visibleToRecruiters: true,
    },
    profileCompletion: 85,
    badges: [],
    applications: [],
  },
];

export default function RecruiterCandidatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');

  const filteredCandidates = mockCandidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RoleGuard allowedRoles={['RECRUITER']}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Candidatos</h1>
            <p className="text-muted-foreground">
              Gestiona y contacta candidatos de tu base de datos.
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar candidatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSkill} onValueChange={setFilterSkill}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por habilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las habilidades</SelectItem>
                <SelectItem value="React">React</SelectItem>
                <SelectItem value="TypeScript">TypeScript</SelectItem>
                <SelectItem value="Node.js">Node.js</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <CandidateMatchCard
                key={candidate.id}
                candidate={candidate}
                matchScore={85}
                onContact={() => console.log('Contact', candidate.id)}
                onViewProfile={() => console.log('View profile', candidate.id)}
              />
            ))}
          </div>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron candidatos</p>
            </div>
          )}
        </div>
      </AppShell>
    </RoleGuard>
  );
}

// Mock Data for Development

import type { Job, Candidate, Application, Agent, AgentAction, User } from '@/types';

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    recruiterId: 'recruiter-1',
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
];

export const MOCK_CANDIDATE: Candidate = {
  id: 'candidate-1',
  email: 'candidate@example.com',
  name: 'Juan Candidato',
  role: 'CANDIDATE',
  profilePicture: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
  bio: 'Senior React Developer con 5+ años de experiencia',
  skills: [
    { id: '1', name: 'React', proficiency: 'EXPERT', endorsements: 5 },
    { id: '2', name: 'TypeScript', proficiency: 'EXPERT', endorsements: 3 },
    { id: '3', name: 'Node.js', proficiency: 'INTERMEDIATE' },
  ],
  experience: [
    {
      id: '1',
      company: 'Tech Corp',
      position: 'Senior Developer',
      description: 'Lideré el desarrollo del frontend',
      startDate: new Date('2020-01-01'),
      current: true,
    },
  ],
  education: [
    {
      id: '1',
      school: 'Universidad Nacional',
      degree: 'Ingeniería de Sistemas',
      field: 'Ingeniería',
      endDate: new Date('2019-12-31'),
    },
  ],
  preferences: {
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
  },
  profileCompletion: 65,
  badges: [],
  applications: [],
};

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    type: 'PROFILE',
    name: 'Agente de Perfil',
    description: 'Detecta datos faltantes en tu perfil',
    icon: '👤',
    status: 'IDLE',
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'agent-2',
    type: 'RECOMMENDATIONS',
    name: 'Agente de Recomendaciones',
    description: 'Encuentra vacantes que te coincidan',
    icon: '⭐',
    status: 'IDLE',
    lastRun: new Date(Date.now() - 30 * 60 * 1000),
  },
];

export const MOCK_AGENT_ACTIONS: AgentAction[] = [
  {
    id: 'action-1',
    agentId: 'agent-1',
    type: 'SCAN',
    action: 'Perfil escaneado',
    result: 'Se encontraron 3 campos faltantes',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    success: true,
  },
];

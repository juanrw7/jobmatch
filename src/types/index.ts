// User & Role Types
export type UserRole = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Work Mode & Location Types
export type WorkMode = 'ONSITE' | 'REMOTE' | 'HYBRID' | 'FLEXIBLE';
export type RemoteScope = 'COLOMBIA' | 'LATAM' | 'WORLDWIDE';
export type Currency = 'COP' | 'USD' | 'EUR';
export type SalaryPeriod = 'MONTHLY' | 'YEARLY' | 'HOURLY';

export interface WorkLocation {
  workMode: WorkMode;
  remoteScope?: RemoteScope;
  hybridDaysPerWeek?: number;
  requiresRelocation: boolean;
  relocationSupport: boolean;
  city?: string;
  country?: string;
  timezone?: string;
}

export interface SalaryInfo {
  salaryMin: number;
  salaryMax: number;
  currency: Currency;
  period: SalaryPeriod;
  visibleToCandidate?: boolean;
}

// Candidate Types
export interface Candidate extends User {
  role: 'CANDIDATE';
  bio?: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  preferences: CandidatePreferences;
  cvUrl?: string;
  profileCompletion: number; // 0-100%
  badges: Badge[];
  applications: Application[];
  recommendations?: JobRecommendation[];
}

export interface Skill {
  id: string;
  name: string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
  endorsements?: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CandidatePreferences {
  workLocation: WorkLocation;
  salary: SalaryInfo;
  contractTypes: string[];
  availableDate?: Date;
  visibleToRecruiters: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

// Job Types
export interface Job {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  requirements: string[];
  skills: Skill[];
  responsibilities: string[];
  workLocation: WorkLocation;
  salary: SalaryInfo;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  applicants?: Application[];
  qualityScore?: number;
}

export interface JobRecommendation {
  id: string;
  candidateId: string;
  jobId: string;
  matchScore: number;
  scoreBreakdown: ScoreBreakdown;
  createdAt: Date;
  viewed: boolean;
  applied: boolean;
}

export type ScoreType = 'CANDIDATE' | 'RECRUITER';

export interface ScoreBreakdown {
  type: ScoreType;
  skills: { score: number; weight: number };
  experience: { score: number; weight: number };
  salary?: { score: number; weight: number };
  workMode?: { score: number; weight: number };
  location?: { score: number; weight: number };
  availability?: { score: number; weight: number };
  total: number;
}

// Application Types
export type ApplicationStatus = 'RECOMMENDED' | 'APPLIED' | 'REVIEWING' | 'INTERVIEW' | 'REJECTED' | 'OFFER' | 'HIRED';

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
  notes?: string;
  job?: Job;
  candidate?: Candidate;
  interactions: ApplicationInteraction[];
}

export interface ApplicationInteraction {
  id: string;
  type: 'VIEWED' | 'REVIEWED' | 'COMMENTED' | 'SCHEDULED' | 'REJECTED' | 'OFFERED';
  timestamp: Date;
  message?: string;
  recruiter?: User;
}

// Recruiter Types
export interface Recruiter extends User {
  role: 'RECRUITER';
  company: string;
  jobTitle?: string;
  companyLogo?: string;
  companyDescription?: string;
  companyWebsite?: string;
  jobs: Job[];
}

// Agent Types
export type AgentType = 'PROFILE' | 'RECOMMENDATIONS' | 'APPLICATION' | 'FOLLOW_UP' | 'JOB_IMPROVEMENT';

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  icon: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'ERROR';
  lastRun?: Date;
}

export interface AgentAction {
  id: string;
  agentId: string;
  type: string;
  action: string;
  result?: string;
  timestamp: Date;
  success: boolean;
}

export interface AgentSuggestion {
  id: string;
  agentId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  description: string;
  actionUrl?: string;
  dismissed: boolean;
}

// Gamification Types
export interface GamificationProfile {
  completionPercentage: number;
  missions: Mission[];
  totalBadges: number;
  streakDays: number;
  points: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  requiredAction: string;
  completed: boolean;
  reward: number;
  icon: string;
}

// UI Component Props Types
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface FilterOptions {
  [key: string]: string | number | boolean;
}

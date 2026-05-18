// Re-export all components for easier imports

// Layout
export { AppShell } from '@/components/layout/AppShell';
export { Sidebar } from '@/components/layout/Sidebar';
export { Topbar } from '@/components/layout/Topbar';
export { RoleGuard } from '@/components/layout/RoleGuard';

// Candidate Components
export { CandidateGamificationPanel } from '@/components/candidate/CandidateGamificationPanel';
export { JobRecommendationCard } from '@/components/candidate/JobRecommendationCard';
export { ApplicationStatusBoard } from '@/components/candidate/ApplicationStatusBoard';
export { CandidatePreferenceForm } from '@/components/candidate/CandidatePreferenceForm';

// Recruiter Components
export { RecruiterStatsCards } from '@/components/recruiter/RecruiterStatsCards';
export { RecruiterJobCard } from '@/components/recruiter/RecruiterJobCard';
export { CandidateMatchCard } from '@/components/recruiter/CandidateMatchCard';
export { ApplicantPipeline } from '@/components/recruiter/ApplicantPipeline';

// Job Components
export { WorkModeBadge } from '@/components/jobs/WorkModeBadge';
export { SalaryRange } from '@/components/jobs/SalaryRange';
export { MatchScore } from '@/components/jobs/MatchScore';
export { ScoreBreakdown } from '@/components/jobs/ScoreBreakdown';

// Agent Components
export { AgentPanel } from '@/components/agents/AgentPanel';
export { AgentActionLog } from '@/components/agents/AgentActionLog';
export { ProfileAgentCard } from '@/components/agents/ProfileAgentCard';
export { JobImprovementAgentCard } from '@/components/agents/JobImprovementAgentCard';
export { FollowUpAgentCard } from '@/components/agents/FollowUpAgentCard';

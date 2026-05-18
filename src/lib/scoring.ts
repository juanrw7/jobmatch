// Utility functions for scoring calculation

export interface ScoreInput {
  skillsMatch: number; // 0-100
  experienceYears: number;
  salaryCompatibility: number; // 0-100
  workModeMatch: number; // 0-100
  locationMatch: number; // 0-100
  availabilityMatch: number; // 0-100
}

export function calculateCandidateScore(input: ScoreInput): {
  total: number;
  breakdown: Record<string, { score: number; weight: number }>;
} {
  const weights = {
    skills: 0.4,
    experience: 0.15,
    salary: 0.15,
    workMode: 0.15,
    location: 0.1,
    availability: 0.05,
  };

  const experienceScore = Math.min(input.experienceYears * 10, 100); // 10 points per year, max 100

  const breakdown = {
    skills: { score: input.skillsMatch, weight: weights.skills },
    experience: { score: experienceScore, weight: weights.experience },
    salary: { score: input.salaryCompatibility, weight: weights.salary },
    workMode: { score: input.workModeMatch, weight: weights.workMode },
    location: { score: input.locationMatch, weight: weights.location },
    availability: { score: input.availabilityMatch, weight: weights.availability },
  };

  const total =
    breakdown.skills.score * breakdown.skills.weight +
    breakdown.experience.score * breakdown.experience.weight +
    breakdown.salary.score * breakdown.salary.weight +
    breakdown.workMode.score * breakdown.workMode.weight +
    breakdown.location.score * breakdown.location.weight +
    breakdown.availability.score * breakdown.availability.weight;

  return {
    total: Math.round(total),
    breakdown,
  };
}

export function calculateRecruiterScore(input: ScoreInput): {
  total: number;
  breakdown: Record<string, { score: number; weight: number }>;
} {
  const weights = {
    skills: 0.45,
    experience: 0.15,
    salary: 0.15,
    workMode: 0.15,
    availability: 0.1,
  };

  const experienceScore = Math.min(input.experienceYears * 10, 100);

  const breakdown = {
    skills: { score: input.skillsMatch, weight: weights.skills },
    experience: { score: experienceScore, weight: weights.experience },
    salary: { score: input.salaryCompatibility, weight: weights.salary },
    workMode: { score: input.workModeMatch, weight: weights.workMode },
    availability: { score: input.availabilityMatch, weight: weights.availability },
  };

  const total =
    breakdown.skills.score * breakdown.skills.weight +
    breakdown.experience.score * breakdown.experience.weight +
    breakdown.salary.score * breakdown.salary.weight +
    breakdown.workMode.score * breakdown.workMode.weight +
    breakdown.availability.score * breakdown.availability.weight;

  return {
    total: Math.round(total),
    breakdown,
  };
}

export function formatCurrency(
  amount: number,
  currency: string,
  notation: 'standard' | 'compact' = 'standard'
): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProfileCompletionPercentage(profile: {
  bio?: string;
  skills: any[];
  experience: any[];
  education: any[];
  cvUrl?: string;
}): number {
  let completed = 0;
  let total = 5;

  if (profile.bio) completed++;
  if (profile.skills.length > 0) completed++;
  if (profile.experience.length > 0) completed++;
  if (profile.education.length > 0) completed++;
  if (profile.cvUrl) completed++;

  return Math.round((completed / total) * 100);
}

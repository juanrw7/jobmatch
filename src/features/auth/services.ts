import { User, UserRole } from '@/types';

// Mock data for development
const MOCK_USERS = {
  candidate: {
    id: '1',
    email: 'candidate@example.com',
    name: 'Juan Candidato',
    role: 'CANDIDATE' as UserRole,
    profilePicture: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  recruiter: {
    id: '2',
    email: 'recruiter@example.com',
    name: 'María Reclutadora',
    role: 'RECRUITER' as UserRole,
    profilePicture: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export async function loginUser(email: string, password: string): Promise<User> {
  // Mock implementation
  if (email.includes('recruiter')) {
    return MOCK_USERS.recruiter;
  }
  return MOCK_USERS.candidate;
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<User> {
  // Mock implementation
  return {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
    role,
    profilePicture: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getCurrentUser(): Promise<User | null> {
  // Mock implementation - in real app would check session
  return MOCK_USERS.candidate;
}

export async function logoutUser(): Promise<void> {
  // Mock implementation
  console.log('User logged out');
}

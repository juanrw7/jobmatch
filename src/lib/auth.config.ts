// Configuration for authentication

export const AUTH_CONFIG = {
  // Authentication endpoints
  endpoints: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    currentUser: '/api/auth/me',
  },

  // Session configuration
  session: {
    duration: 24 * 60 * 60 * 1000, // 24 hours
    refreshThreshold: 60 * 60 * 1000, // Refresh 1 hour before expiry
  },

  // Default redirects
  redirects: {
    afterLogin: {
      CANDIDATE: '/candidate/dashboard',
      RECRUITER: '/recruiter/dashboard',
    },
    afterLogout: '/login',
    unauthorizedAccess: '/login',
  },

  // Roles and permissions
  roles: {
    CANDIDATE: {
      allowedPaths: [
        '/candidate/dashboard',
        '/candidate/profile',
        '/candidate/recommendations',
        '/candidate/applications',
        '/candidate/agent',
        '/candidate/onboarding',
      ],
    },
    RECRUITER: {
      allowedPaths: [
        '/recruiter/dashboard',
        '/recruiter/company-profile',
        '/recruiter/jobs',
        '/recruiter/candidates',
        '/recruiter/agent',
      ],
    },
  },
};

export const STORAGE_KEYS = {
  token: 'jobmatch_token',
  user: 'jobmatch_user',
  preferences: 'jobmatch_preferences',
  theme: 'jobmatch_theme',
};

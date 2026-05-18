// Configuration constants

export const CONFIG = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    timeout: 30000,
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },

  // Scoring weights (Can vary by context)
  scoring: {
    candidate: {
      skills: 0.4,
      experience: 0.15,
      salary: 0.15,
      workMode: 0.15,
      location: 0.1,
      availability: 0.05,
    },
    recruiter: {
      skills: 0.45,
      experience: 0.15,
      salary: 0.15,
      workMode: 0.15,
      availability: 0.1,
    },
  },

  // Gamification
  gamification: {
    levelThresholds: {
      beginner: 0,
      intermediate: 25,
      advanced: 50,
      expert: 75,
      master: 90,
    },
    badges: {
      firstProfile: {
        name: 'First Step',
        icon: '👣',
        description: 'Completa tu primer perfil',
      },
      profileMaster: {
        name: 'Profile Master',
        icon: '👤',
        description: 'Perfil 100% completo',
      },
      jobHunter: {
        name: 'Job Hunter',
        icon: '🎯',
        description: 'Realiza 5 postulaciones',
      },
      hired: {
        name: 'Hired',
        icon: '🎉',
        description: 'Consigue un trabajo',
      },
    },
  },

  // Recommendations
  recommendations: {
    minScoreToShow: 40, // Mostrar recomendaciones con score >= 40%
    refreshInterval: 24 * 60 * 60 * 1000, // 24 horas
  },

  // Currencies
  currencies: {
    COP: { symbol: '$', name: 'Peso Colombiano' },
    USD: { symbol: '$', name: 'Dólar Americano' },
    EUR: { symbol: '€', name: 'Euro' },
  },

  // Work modes
  workModes: {
    ONSITE: { label: 'Presencial', icon: '📍' },
    REMOTE: { label: 'Remoto', icon: '🌐' },
    HYBRID: { label: 'Híbrido', icon: '🏢' },
    FLEXIBLE: { label: 'Flexible', icon: '🔄' },
  },

  // Remote scopes
  remoteScopes: {
    COLOMBIA: { label: 'Colombia', region: 'CO' },
    LATAM: { label: 'Latinoamérica', region: 'LA' },
    WORLDWIDE: { label: 'Worldwide', region: 'WW' },
  },
};

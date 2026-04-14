'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API = 'http://localhost:4000/api'

type UserData = {
  id: number
  firstName: string
  lastName: string
  email: string
  userType?: 'candidate' | 'recruiter'
  onboardingCompleted?: boolean
}

type CandidateProfile = {
  bio: string
  education: string
  experience: string
  location: string
  skillsInput: string
  interestsInput: string
  cvUrl: string
  photoUrl: string
}

type RecruiterProfile = {
  companyName: string
  description: string
  logoUrl: string
  sector: string
  website: string
  location: string
}

type RecruiterJobForm = {
  title: string
  description: string
  requirementsInput: string
  salary: string
  location: string
  company: string
}

type RecruiterJob = {
  id: number
  title: string
  description: string
  requirements: string[]
  salary?: number | null
  location?: string | null
  company?: string | null
  isActive: boolean
}

type CandidateRecommendation = {
  candidate: {
    id: number
    firstName: string
    lastName: string
    email: string
    profile?: {
      bio?: string | null
      experience?: string | null
      location?: string | null
      skills?: string[]
      interests?: string[]
    } | null
  }
  score: number
  scoreBreakdown: {
    skillsScore: number
    interestsScore: number
    locationScore: number
    matchedSkills: string[]
    matchedInterests: string[]
  }
  explanation: string[]
  hasApplied: boolean
}

type CandidateApplication = {
  id: number
  jobId: number
  status: string
  appliedAt: string
  job: {
    id: number
    title: string
    company?: string | null
    location?: string | null
    isActive: boolean
  }
}

type RecruiterApplication = {
  id: number
  status: string
  appliedAt: string
  job: {
    id: number
    title: string
    company?: string | null
    isActive: boolean
  }
  user: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
}

type Recommendation = {
  id: number
  title: string
  description: string
  requirements: string[]
  company?: string | null
  location?: string | null
  score: number
  explanation?: string[]
  scoreBreakdown?: {
    mustHaveScore: number
    niceToHaveScore: number
    locationScore: number
    matchedMustHave: string[]
    matchedNiceToHave: string[]
    matchedSkills: string[]
  }
}

type RecommendationHistoryItem = {
  id: number
  score: number
  shownAt: string
  job: {
    id: number
    title: string
    company?: string | null
    location?: string | null
    isActive: boolean
  }
}

const EMPTY_PROFILE: CandidateProfile = {
  bio: '',
  education: '',
  experience: '',
  location: '',
  skillsInput: '',
  interestsInput: '',
  cvUrl: '',
  photoUrl: '',
}

const EMPTY_RECRUITER_PROFILE: RecruiterProfile = {
  companyName: '',
  description: '',
  logoUrl: '',
  sector: '',
  website: '',
  location: '',
}

const EMPTY_JOB_FORM: RecruiterJobForm = {
  title: '',
  description: '',
  requirementsInput: '',
  salary: '',
  location: '',
  company: '',
}

const JOB_MATCH_MODEL = [
  { label: 'Must-have', weight: 70, color: 'bg-green-500' },
  { label: 'Nice-to-have', weight: 20, color: 'bg-lime-500' },
  { label: 'Ubicación', weight: 10, color: 'bg-emerald-400' },
]

const CANDIDATE_MATCH_MODEL = [
  { label: 'Skills', weight: 70, color: 'bg-blue-500' },
  { label: 'Intereses', weight: 20, color: 'bg-sky-500' },
  { label: 'Ubicación', weight: 10, color: 'bg-cyan-400' },
]

function splitTags(input: string): string[] {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

function Button({ children, onClick, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  )
}

function Progress({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-green-600 h-2 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [completionScore, setCompletionScore] = useState(0)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [profile, setProfile] = useState<CandidateProfile>(EMPTY_PROFILE)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [recruiterProfile, setRecruiterProfile] = useState<RecruiterProfile>(EMPTY_RECRUITER_PROFILE)
  const [savingRecruiterProfile, setSavingRecruiterProfile] = useState(false)
  const [recruiterProfileMessage, setRecruiterProfileMessage] = useState('')
  const [recruiterProfileError, setRecruiterProfileError] = useState('')
  const [jobForm, setJobForm] = useState<RecruiterJobForm>(EMPTY_JOB_FORM)
  const [savingJob, setSavingJob] = useState(false)
  const [jobMessage, setJobMessage] = useState('')
  const [jobError, setJobError] = useState('')
  const [recruiterJobs, setRecruiterJobs] = useState<RecruiterJob[]>([])
  const [updatingJobStatusId, setUpdatingJobStatusId] = useState<number | null>(null)
  const [selectedJobForCandidates, setSelectedJobForCandidates] = useState<number | null>(null)
  const [candidateRecommendations, setCandidateRecommendations] = useState<CandidateRecommendation[]>([])
  const [loadingCandidateRecommendations, setLoadingCandidateRecommendations] = useState(false)
  const [candidateRecommendationsError, setCandidateRecommendationsError] = useState('')
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [applicationError, setApplicationError] = useState('')
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null)
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([])
  const [candidateApplications, setCandidateApplications] = useState<CandidateApplication[]>([])
  const [recruiterApplications, setRecruiterApplications] = useState<RecruiterApplication[]>([])
  const [recommendationHistory, setRecommendationHistory] = useState<RecommendationHistoryItem[]>([])
  const [recMinScore, setRecMinScore] = useState('0')
  const [recLocation, setRecLocation] = useState('')

  useEffect(() => {
    // Obtener usuario del localStorage
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/')
      return
    }

    const parsedUser = JSON.parse(userData)

    if (!parsedUser?.onboardingCompleted) {
      router.push('/onboarding')
      return
    }

    setUser(parsedUser)

    if (parsedUser.userType === 'recruiter') {
      fetchRecruiterProfile(parsedUser.id)
      fetchRecruiterJobs(parsedUser.id)
      fetchRecruiterApplications(parsedUser.id)
    } else {
      fetchRecommendations(parsedUser.id)
      fetchProfile(parsedUser.id)
      fetchCandidateApplications(parsedUser.id)
      fetchRecommendationHistory(parsedUser.id)
    }
    setCheckingAccess(false)
  }, [router])

  const fetchProfile = async (userId: number) => {
    try {
      const res = await fetch(`${API}/profile/${userId}`)
      const data = await res.json()

      if (!res.ok) {
        return
      }

      if (typeof data.completionScore === 'number') {
        setCompletionScore(data.completionScore)
      }

      if (data.user?.userType) {
        setUser((prev) => (prev ? { ...prev, userType: data.user.userType } : prev))
      }

      const profileData = data.profile
      if (profileData) {
        setProfile({
          bio: profileData.bio || '',
          education: profileData.education || '',
          experience: profileData.experience || '',
          location: profileData.location || '',
          skillsInput: (profileData.skills || []).join(', '),
          interestsInput: (profileData.interests || []).join(', '),
          cvUrl: profileData.cvUrl || '',
          photoUrl: profileData.photoUrl || '',
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchRecommendations = async (userId: number) => {
    try {
      const params = new URLSearchParams({ userId: String(userId) })

      if (Number(recMinScore) > 0) {
        params.set('minScore', String(Number(recMinScore)))
      }

      if (recLocation.trim()) {
        params.set('location', recLocation.trim())
      }

      const res = await fetch(`${API}/jobs/recommend?${params.toString()}`)
      const data = await res.json()
      setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : [])
      fetchRecommendationHistory(userId)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  const fetchRecommendationHistory = async (userId: number) => {
    try {
      const res = await fetch(`${API}/jobs/recommend/history/${userId}`)
      const data = await res.json()

      if (!res.ok) {
        return
      }

      setRecommendationHistory(Array.isArray(data) ? (data as RecommendationHistoryItem[]) : [])
    } catch (error) {
      console.error('Error fetching recommendation history:', error)
    }
  }

  const fetchCandidateApplications = async (userId: number) => {
    try {
      const res = await fetch(`${API}/jobs/applications/user/${userId}`)
      const data = await res.json()

      if (!res.ok) {
        return
      }

      const applications = Array.isArray(data) ? (data as CandidateApplication[]) : []
      const appliedIds = applications.map((item) => item.jobId)

      setCandidateApplications(applications)
      setAppliedJobIds(appliedIds)
    } catch (error) {
      console.error('Error fetching candidate applications:', error)
    }
  }

  const fetchRecruiterApplications = async (userId: number) => {
    try {
      const res = await fetch(`${API}/jobs/applications/recruiter/${userId}`)
      const data = await res.json()

      if (!res.ok) {
        return
      }

      setRecruiterApplications(Array.isArray(data) ? (data as RecruiterApplication[]) : [])
    } catch (error) {
      console.error('Error fetching recruiter applications:', error)
    }
  }

  const fetchRecruiterProfile = async (userId: number) => {
    try {
      const res = await fetch(`${API}/recruiter-profile/${userId}`)
      const data = await res.json()

      if (!res.ok) {
        return
      }

      if (typeof data.completionScore === 'number') {
        setCompletionScore(data.completionScore)
      }

      const profileData = data.profile
      if (profileData) {
        setRecruiterProfile({
          companyName: profileData.companyName || '',
          description: profileData.description || '',
          logoUrl: profileData.logoUrl || '',
          sector: profileData.sector || '',
          website: profileData.website || '',
          location: profileData.location || '',
        })
      }
    } catch (error) {
      console.error('Error fetching recruiter profile:', error)
    }
  }

  const fetchRecruiterJobs = async (userId: number) => {
    try {
      const res = await fetch(`${API}/jobs/recruiter/${userId}`)
      const data = await res.json()
      if (!res.ok) {
        return
      }
      setRecruiterJobs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching recruiter jobs:', error)
    }
  }

  const saveCandidateProfile = async () => {
    if (!user?.id) return

    setSavingProfile(true)
    setProfileMessage('')
    setProfileError('')

    try {
      const res = await fetch(`${API}/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: profile.bio,
          education: profile.education,
          experience: profile.experience,
          location: profile.location,
          skills: splitTags(profile.skillsInput),
          interests: splitTags(profile.interestsInput),
          cvUrl: profile.cvUrl,
          photoUrl: profile.photoUrl,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setProfileError(data.error || 'No se pudo guardar el perfil')
        return
      }

      setCompletionScore(data.completionScore || completionScore)
      setProfileMessage('Perfil actualizado correctamente')
      fetchRecommendations(user.id)
      fetchRecommendationHistory(user.id)
    } catch {
      setProfileError('No se pudo conectar con el servidor')
    } finally {
      setSavingProfile(false)
    }
  }

  const saveRecruiterProfile = async () => {
    if (!user?.id) return

    setSavingRecruiterProfile(true)
    setRecruiterProfileMessage('')
    setRecruiterProfileError('')

    try {
      const res = await fetch(`${API}/recruiter-profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: recruiterProfile.companyName,
          description: recruiterProfile.description,
          logoUrl: recruiterProfile.logoUrl,
          sector: recruiterProfile.sector,
          website: recruiterProfile.website,
          location: recruiterProfile.location,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setRecruiterProfileError(data.error || 'No se pudo guardar el perfil de empresa')
        return
      }

      setCompletionScore(data.completionScore || completionScore)
      setRecruiterProfileMessage('Perfil de empresa actualizado correctamente')
    } catch {
      setRecruiterProfileError('No se pudo conectar con el servidor')
    } finally {
      setSavingRecruiterProfile(false)
    }
  }

  const publishJob = async () => {
    if (!user?.id) return

    if (!jobForm.title || !jobForm.description || !jobForm.requirementsInput) {
      setJobError('Completa título, descripción y requisitos')
      return
    }

    setSavingJob(true)
    setJobMessage('')
    setJobError('')

    try {
      const res = await fetch(`${API}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recruiterId: user.id,
          title: jobForm.title,
          description: jobForm.description,
          requirements: splitTags(jobForm.requirementsInput),
          salary: jobForm.salary ? Number(jobForm.salary) : null,
          location: jobForm.location,
          company: jobForm.company || recruiterProfile.companyName,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setJobError(data.error || 'No se pudo publicar la vacante')
        return
      }

      setJobMessage('Vacante publicada correctamente')
      setJobForm(EMPTY_JOB_FORM)
      fetchRecruiterJobs(user.id)
    } catch {
      setJobError('No se pudo conectar con el servidor')
    } finally {
      setSavingJob(false)
    }
  }

  const toggleJobStatus = async (jobId: number, isActive: boolean) => {
    if (!user?.id) return

    setUpdatingJobStatusId(jobId)
    setJobMessage('')
    setJobError('')

    try {
      const res = await fetch(`${API}/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recruiterId: user.id, isActive }),
      })

      const data = await res.json()
      if (!res.ok) {
        setJobError(data.error || 'No se pudo actualizar el estado de la vacante')
        return
      }

      setJobMessage(isActive ? 'Vacante activada' : 'Vacante desactivada')
      fetchRecruiterJobs(user.id)
    } catch {
      setJobError('No se pudo conectar con el servidor')
    } finally {
      setUpdatingJobStatusId(null)
    }
  }

  const loadCandidateRecommendations = async (jobId: number) => {
    if (!user?.id) return

    setSelectedJobForCandidates(jobId)
    setLoadingCandidateRecommendations(true)
    setCandidateRecommendationsError('')

    try {
      const res = await fetch(`${API}/jobs/${jobId}/recommended-candidates?recruiterId=${user.id}`)
      const data = await res.json()

      if (!res.ok) {
        setCandidateRecommendationsError(data.error || 'No se pudieron cargar candidatos recomendados')
        setCandidateRecommendations([])
        return
      }

      setCandidateRecommendations(Array.isArray(data.recommendations) ? data.recommendations : [])
    } catch {
      setCandidateRecommendationsError('No se pudo conectar con el servidor')
      setCandidateRecommendations([])
    } finally {
      setLoadingCandidateRecommendations(false)
    }
  }

  const applyToJob = async (jobId: number) => {
    if (!user?.id) return

    setApplyingJobId(jobId)
    setApplicationMessage('')
    setApplicationError('')

    try {
      const res = await fetch(`${API}/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await res.json()
      if (!res.ok) {
        setApplicationError(data.error || 'No se pudo completar la postulación')
        return
      }

      setApplicationMessage('Postulación enviada correctamente')
      setAppliedJobIds((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]))
      fetchCandidateApplications(user.id)
      fetchRecommendationHistory(user.id)
    } catch {
      setApplicationError('No se pudo conectar con el servidor')
    } finally {
      setApplyingJobId(null)
    }
  }

  if (checkingAccess) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            {user?.userType === 'recruiter'
              ? 'Panel general de cuenta'
              : 'Aquí están tus recomendaciones personalizadas'}
          </p>
        </div>

        {/* Barra de completitud */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Completitud del perfil
          </h2>
          <Progress value={completionScore} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">{completionScore}% completado</p>
        </div>

        {user?.userType !== 'recruiter' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Perfil de candidato</h2>
              <span className="text-sm text-gray-500">Completa tu perfil para mejorar el match</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Resumen profesional</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Describe tu perfil profesional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Educación</label>
                <input
                  value={profile.education}
                  onChange={(e) => setProfile((prev) => ({ ...prev, education: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Ej: Ingeniería de Sistemas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experiencia</label>
                <input
                  value={profile.experience}
                  onChange={(e) => setProfile((prev) => ({ ...prev, experience: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Ej: 5 años en desarrollo frontend"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                <input
                  value={profile.location}
                  onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Ej: Bogotá / Remoto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills (separadas por coma)</label>
                <input
                  value={profile.skillsInput}
                  onChange={(e) => setProfile((prev) => ({ ...prev, skillsInput: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="React, TypeScript, Node.js"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Intereses (separados por coma)</label>
                <input
                  value={profile.interestsInput}
                  onChange={(e) => setProfile((prev) => ({ ...prev, interestsInput: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Producto digital, IA, liderazgo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL del CV</label>
                <input
                  value={profile.cvUrl}
                  onChange={(e) => setProfile((prev) => ({ ...prev, cvUrl: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL de foto de perfil</label>
                <input
                  value={profile.photoUrl}
                  onChange={(e) => setProfile((prev) => ({ ...prev, photoUrl: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="https://..."
                />
              </div>
            </div>

            {profileError && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {profileError}
              </div>
            )}

            {profileMessage && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {profileMessage}
              </div>
            )}

            <div className="mt-5">
              <button
                onClick={saveCandidateProfile}
                disabled={savingProfile}
                className="px-5 py-2.5 rounded-lg bg-[#0a0a0a] text-[#c4f547] font-semibold hover:bg-black disabled:opacity-50"
              >
                {savingProfile ? 'Guardando...' : 'Guardar perfil'}
              </button>
            </div>
          </div>
        )}

        {user?.userType === 'recruiter' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Perfil de empresa</h2>
              <span className="text-sm text-gray-500">Completa la información para mejorar tu marca empleadora</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de empresa</label>
                <input
                  value={recruiterProfile.companyName}
                  onChange={(e) => setRecruiterProfile((prev) => ({ ...prev, companyName: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Ej: TechNova"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                <input
                  value={recruiterProfile.sector}
                  onChange={(e) => setRecruiterProfile((prev) => ({ ...prev, sector: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Ej: Tecnología"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  rows={4}
                  value={recruiterProfile.description}
                  onChange={(e) => setRecruiterProfile((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Describe tu empresa y cultura"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL de logo</label>
                <input
                  value={recruiterProfile.logoUrl}
                  onChange={(e) => setRecruiterProfile((prev) => ({ ...prev, logoUrl: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sitio web</label>
                <input
                  value={recruiterProfile.website}
                  onChange={(e) => setRecruiterProfile((prev) => ({ ...prev, website: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="https://empresa.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                <input
                  value={recruiterProfile.location}
                  onChange={(e) => setRecruiterProfile((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Ej: Medellín"
                />
              </div>
            </div>

            {recruiterProfileError && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {recruiterProfileError}
              </div>
            )}

            {recruiterProfileMessage && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {recruiterProfileMessage}
              </div>
            )}

            <div className="mt-5">
              <button
                onClick={saveRecruiterProfile}
                disabled={savingRecruiterProfile}
                className="px-5 py-2.5 rounded-lg bg-[#0a0a0a] text-[#c4f547] font-semibold hover:bg-black disabled:opacity-50"
              >
                {savingRecruiterProfile ? 'Guardando...' : 'Guardar perfil de empresa'}
              </button>
            </div>
          </div>
        )}

        {user?.userType === 'recruiter' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Publicar vacante</h2>
              <span className="text-sm text-gray-500">Define requisitos claros para atraer mejores candidatos</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  value={jobForm.title}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Ej: Frontend Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                <input
                  value={jobForm.company}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, company: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Ej: TechNova"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  rows={4}
                  value={jobForm.description}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Describe responsabilidades y contexto"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Requisitos (separados por coma)</label>
                <input
                  value={jobForm.requirementsInput}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, requirementsInput: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="React, TypeScript, Testing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                <input
                  value={jobForm.location}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Ej: Remoto / Bogotá"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salario (opcional)</label>
                <input
                  type="number"
                  value={jobForm.salary}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, salary: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="7000"
                />
              </div>
            </div>

            {jobError && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {jobError}
              </div>
            )}

            {jobMessage && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {jobMessage}
              </div>
            )}

            <div className="mt-5">
              <button
                onClick={publishJob}
                disabled={savingJob}
                className="px-5 py-2.5 rounded-lg bg-[#0a0a0a] text-[#c4f547] font-semibold hover:bg-black disabled:opacity-50"
              >
                {savingJob ? 'Publicando...' : 'Publicar vacante'}
              </button>
            </div>
          </div>
        )}

        {user?.userType === 'recruiter' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis vacantes</h2>

            {recruiterJobs.length === 0 ? (
              <p className="text-gray-600">Aún no has publicado vacantes.</p>
            ) : (
              <div className="space-y-4">
                {recruiterJobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{job.company || 'Sin empresa'} · {job.location || 'Sin ubicación'}</p>
                        <p className="text-gray-700 mt-2">{job.description}</p>
                        <div className="flex gap-2 flex-wrap mt-3">
                          {job.requirements?.slice(0, 4).map((req, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                          {job.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                        <div className="mt-3">
                          <button
                            onClick={() => toggleJobStatus(job.id, !job.isActive)}
                            disabled={updatingJobStatusId === job.id}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                          >
                            {updatingJobStatusId === job.id
                              ? 'Actualizando...'
                              : job.isActive
                              ? 'Desactivar'
                              : 'Activar'}
                          </button>
                        </div>

                        <div className="mt-2">
                          <button
                            onClick={() => loadCandidateRecommendations(job.id)}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Ver candidatos recomendados
                          </button>
                        </div>
                      </div>
                    </div>

                    {selectedJobForCandidates === job.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Candidatos recomendados
                        </h4>

                        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
                          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                            Cómo calculamos el score de candidatos
                          </p>
                          <div className="space-y-2">
                            {CANDIDATE_MATCH_MODEL.map((item) => (
                              <div key={item.label}>
                                <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
                                  <span>{item.label}</span>
                                  <span>{item.weight}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                                  <div className={`${item.color} h-2`} style={{ width: `${item.weight}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Fórmula: score final = skills + intereses + ubicación
                          </p>
                        </div>

                        {loadingCandidateRecommendations ? (
                          <p className="text-sm text-gray-600">Cargando recomendaciones...</p>
                        ) : candidateRecommendationsError ? (
                          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                            {candidateRecommendationsError}
                          </div>
                        ) : candidateRecommendations.length === 0 ? (
                          <p className="text-sm text-gray-600">No hay candidatos con match para esta vacante.</p>
                        ) : (
                          <div className="space-y-3">
                            {candidateRecommendations.map((item) => (
                              <div key={item.candidate.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {item.candidate.firstName} {item.candidate.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600">{item.candidate.email}</p>
                                    {item.candidate.profile?.location && (
                                      <p className="text-xs text-gray-500 mt-1">Ubicación: {item.candidate.profile.location}</p>
                                    )}
                                  </div>

                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-green-600">{item.score}%</p>
                                    <p className="text-xs text-gray-500">Compatibilidad</p>
                                    {item.hasApplied && (
                                      <span className="inline-flex mt-2 px-2 py-1 rounded-full text-[11px] bg-blue-100 text-blue-700">
                                        Ya postuló
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {item.candidate.profile?.bio && (
                                  <p className="text-sm text-gray-700 mt-2">{item.candidate.profile.bio}</p>
                                )}

                                <div className="grid sm:grid-cols-3 gap-2 mt-3 text-xs">
                                  <div className="bg-white border border-gray-200 rounded px-2 py-1.5 text-gray-700">
                                    Skills: +{item.scoreBreakdown.skillsScore}
                                  </div>
                                  <div className="bg-white border border-gray-200 rounded px-2 py-1.5 text-gray-700">
                                    Intereses: +{item.scoreBreakdown.interestsScore}
                                  </div>
                                  <div className="bg-white border border-gray-200 rounded px-2 py-1.5 text-gray-700">
                                    Ubicación: +{item.scoreBreakdown.locationScore}
                                  </div>
                                </div>

                                <ul className="mt-2 text-xs text-gray-600 space-y-1 list-disc pl-4">
                                  {item.explanation.map((line, idx) => (
                                    <li key={idx}>{line}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {user?.userType === 'candidate' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis postulaciones</h2>

            {candidateApplications.length === 0 ? (
              <p className="text-gray-600">Aún no te has postulado a vacantes.</p>
            ) : (
              <div className="space-y-3">
                {candidateApplications.map((application) => (
                  <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{application.job?.title || 'Vacante'}</p>
                        <p className="text-sm text-gray-600">
                          {application.job?.company || 'Empresa no especificada'}
                          {application.job?.location ? ` · ${application.job.location}` : ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Postulado el {new Date(application.appliedAt).toLocaleDateString('es-CO')}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {application.status}
                        </span>
                        {!application.job?.isActive && (
                          <p className="text-xs text-gray-500 mt-2">Vacante inactiva</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {user?.userType === 'candidate' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de recomendaciones</h2>

            {recommendationHistory.length === 0 ? (
              <p className="text-gray-600">Aún no tienes historial de recomendaciones.</p>
            ) : (
              <div className="space-y-3">
                {recommendationHistory.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{item.job.title}</p>
                        <p className="text-sm text-gray-600">
                          {item.job.company || 'Empresa no especificada'}
                          {item.job.location ? ` · ${item.job.location}` : ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Mostrada el {new Date(item.shownAt).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{item.score}%</p>
                        <p className="text-xs text-gray-500">Score histórico</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {user?.userType === 'recruiter' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Candidaturas recibidas</h2>

            {recruiterApplications.length === 0 ? (
              <p className="text-gray-600">Aún no has recibido postulaciones.</p>
            ) : (
              <div className="space-y-3">
                {recruiterApplications.map((application) => (
                  <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {application.user.firstName} {application.user.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{application.user.email}</p>
                        <p className="text-sm text-gray-700 mt-1">
                          Vacante: {application.job.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Recibida el {new Date(application.appliedAt).toLocaleDateString('es-CO')}
                        </p>
                      </div>

                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {application.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recomendaciones */}
        {user?.userType !== 'recruiter' && <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Vacantes recomendadas ({recommendations.length})
          </h2>

          <div className="mb-4 bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Filtros de recomendación
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Score mínimo</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={recMinScore}
                  onChange={(e) => setRecMinScore(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Ubicación</label>
                <input
                  value={recLocation}
                  onChange={(e) => setRecLocation(e.target.value)}
                  placeholder="Ej: remoto"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => user?.id && fetchRecommendations(user.id)}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] text-[#c4f547] text-sm font-semibold hover:bg-black"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Cómo calculamos tu score de compatibilidad
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {JOB_MATCH_MODEL.map((item) => (
                <div key={item.label} className="rounded-lg border border-gray-200 p-2.5">
                  <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
                    <span>{item.label}</span>
                    <span>{item.weight}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`${item.color} h-2`} style={{ width: `${item.weight}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Fórmula: score final = must-have + nice-to-have + ubicación
            </p>
          </div>

          {applicationError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {applicationError}
            </div>
          )}

          {applicationMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {applicationMessage}
            </div>
          )}

          {recommendations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">
                No hay recomendaciones disponibles. Completa tu perfil para recibir
                sugerencias personalizadas.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {recommendations.map(job => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{job.company}</p>
                      <p className="text-sm text-gray-500 mt-2">{job.location}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-3xl font-bold text-green-600">
                        {job.score}%
                      </div>
                      <p className="text-xs text-gray-500">Compatibilidad</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mt-4">{job.description}</p>

                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                      Transparencia del score
                    </p>

                    <div className="grid sm:grid-cols-3 gap-2 text-xs">
                      <div className="bg-white border border-gray-200 rounded px-2 py-1.5 text-gray-700">
                        Must-have: +{job.scoreBreakdown?.mustHaveScore ?? 0}
                      </div>
                      <div className="bg-white border border-gray-200 rounded px-2 py-1.5 text-gray-700">
                        Nice-to-have: +{job.scoreBreakdown?.niceToHaveScore ?? 0}
                      </div>
                      <div className="bg-white border border-gray-200 rounded px-2 py-1.5 text-gray-700">
                        Ubicación: +{job.scoreBreakdown?.locationScore ?? 0}
                      </div>
                    </div>

                    {job.explanation && job.explanation.length > 0 && (
                      <ul className="mt-3 text-xs text-gray-600 space-y-1 list-disc pl-4">
                        {job.explanation.map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex gap-2 flex-wrap">
                      {job.requirements?.slice(0, 3).map((req: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => setExpandedJobId((prev) => (prev === job.id ? null : job.id))}>
                        {expandedJobId === job.id ? 'Ocultar detalle' : 'Ver detalle'}
                      </Button>
                      <button
                        onClick={() => applyToJob(job.id)}
                        disabled={applyingJobId === job.id || appliedJobIds.includes(job.id)}
                        className="px-4 py-2 rounded bg-[#0a0a0a] text-[#c4f547] hover:bg-black disabled:opacity-50"
                      >
                        {appliedJobIds.includes(job.id)
                          ? 'Postulado'
                          : applyingJobId === job.id
                          ? 'Postulando...'
                          : 'Postularme'}
                      </button>
                    </div>
                  </div>

                  {expandedJobId === job.id && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Detalle de la vacante</h4>
                      <p className="text-sm text-gray-700">{job.description}</p>
                      {job.requirements?.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Requisitos completos</p>
                          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                            {job.requirements.map((req: string, idx: number) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>}
      </div>
    </div>
  )
}
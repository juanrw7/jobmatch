'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

const API = 'http://localhost:4000/api'

type Step = 1 | 2 | 3 | 4

function splitTags(input: string): string[] {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [bio, setBio] = useState('')
  const [experience, setExperience] = useState('')
  const [location, setLocation] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [mustHaveInput, setMustHaveInput] = useState('')
  const [niceToHaveInput, setNiceToHaveInput] = useState('')

  useEffect(() => {
    const userRaw = localStorage.getItem('user')
    if (!userRaw) {
      router.push('/')
      return
    }

    const user = JSON.parse(userRaw)
    if (user?.onboardingCompleted) {
      router.push('/dashboard')
    }
  }, [router])

  const progress = useMemo(() => (step / 4) * 100, [step])

  async function completeOnboarding() {
    const userRaw = localStorage.getItem('user')
    if (!userRaw) {
      router.push('/')
      return
    }

    const user = JSON.parse(userRaw)
    if (!user?.id) {
      setError('No se encontró el usuario autenticado')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API}/auth/onboarding/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          bio,
          experience,
          location,
          skills: splitTags(skillsInput),
          mustHave: splitTags(mustHaveInput),
          niceToHave: splitTags(niceToHaveInput),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No se pudo completar el onboarding')
        return
      }

      const updatedUser = { ...user, onboardingCompleted: true }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      router.push('/dashboard')
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-[#0a0a0a] text-white p-6">
          <h1 className="text-2xl font-bold">Onboarding de tu perfil</h1>
          <p className="text-gray-300 mt-1">Paso {step} de 4</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
            <div
              className="bg-[#c4f547] h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">¿Cómo funciona JobMatch?</h2>
              <p className="text-gray-700">
                Te recomendaremos vacantes con un score transparente usando tus habilidades,
                preferencias y requisitos de cada vacante.
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li><strong>70%</strong> coincidencia con requisitos clave (must-have).</li>
                <li><strong>20%</strong> coincidencia con requisitos deseables (nice-to-have).</li>
                <li><strong>10%</strong> compatibilidad de ubicación.</li>
              </ul>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Cuéntanos sobre tu perfil</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resumen profesional</label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ej: Desarrollador frontend con 4 años de experiencia..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experiencia</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Ej: 4 años en desarrollo web"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Habilidades (separadas por coma)</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Preferencias para recomendaciones</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación preferida</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej: Medellín / Remoto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Must-have (separado por coma)</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={mustHaveInput}
                  onChange={(e) => setMustHaveInput(e.target.value)}
                  placeholder="TypeScript, React"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nice-to-have (separado por coma)</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={niceToHaveInput}
                  onChange={(e) => setNiceToHaveInput(e.target.value)}
                  placeholder="GraphQL, AWS"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Revisión final</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm text-gray-700">
                <p><strong>Bio:</strong> {bio || 'No definida'}</p>
                <p><strong>Experiencia:</strong> {experience || 'No definida'}</p>
                <p><strong>Skills:</strong> {splitTags(skillsInput).join(', ') || 'No definidas'}</p>
                <p><strong>Ubicación:</strong> {location || 'No definida'}</p>
                <p><strong>Must-have:</strong> {splitTags(mustHaveInput).join(', ') || 'No definidos'}</p>
                <p><strong>Nice-to-have:</strong> {splitTags(niceToHaveInput).join(', ') || 'No definidos'}</p>
              </div>
              <p className="text-gray-700">
                Al terminar, comenzaremos a recomendar vacantes por score de compatibilidad.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => setStep((prev) => Math.max(1, prev - 1) as Step)}
              disabled={step === 1 || loading}
            >
              Anterior
            </button>

            {step < 4 ? (
              <button
                type="button"
                className="px-5 py-2.5 rounded-lg bg-[#0a0a0a] text-[#c4f547] font-semibold hover:bg-black"
                onClick={() => setStep((prev) => Math.min(4, prev + 1) as Step)}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                className="px-5 py-2.5 rounded-lg bg-[#0a0a0a] text-[#c4f547] font-semibold hover:bg-black disabled:opacity-50"
                onClick={completeOnboarding}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Finalizar onboarding'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

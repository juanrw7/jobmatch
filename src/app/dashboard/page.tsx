'use client'

import { useEffect, useState } from 'react'

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
  const [user, setUser] = useState<any>(null)
  const [completionScore, setCompletionScore] = useState(0)
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    // Obtener usuario del localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Calcular barra de completitud
      let score = 0
      if (parsedUser.firstName) score += 25
      if (parsedUser.lastName) score += 25
      if (parsedUser.email) score += 25
      // 25 más para perfil completo
      setCompletionScore(score)

      // Obtener recomendaciones
      fetchRecommendations(parsedUser.id)
    }
  }, [])

  const fetchRecommendations = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/jobs/recommend?userId=${userId}`)
      const data = await res.json()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.firstName}!
          </h1>
          <p className="text-gray-600">Aquí están tus recomendaciones personalizadas</p>
        </div>

        {/* Barra de completitud */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Completitud del perfil
          </h2>
          <Progress value={completionScore} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">{completionScore}% completado</p>
        </div>

        {/* Recomendaciones */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Vacantes recomendadas ({recommendations.length})
          </h2>

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
                    <Button>Ver más</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
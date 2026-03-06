'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API = 'http://localhost:4000/api';

export default function AuthForm() {
  const router = useRouter();
  const [tab, setTab] = useState('register');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!firstName || !lastName || !email || !password) {
      return setError('Completa todos los campos');
    }
    if (password !== confirm) {
      return setError('Las contraseñas no coinciden');
    }
    if (password.length < 8) {
      return setError('La contraseña debe tener mínimo 8 caracteres');
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        return setError(data.error || 'Error al registrar');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    if (!email || !password) {
      return setError('Completa todos los campos');
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        return setError(data.error || 'Credenciales incorrectas');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0a0a] text-white p-12 flex-col justify-between">
        <div>
          <div className="mb-16">
            <h1 className="text-3xl font-bold mb-1">
              <span className="text-white">Job</span>
              <span className="text-[#c4f547]">Match</span>
            </h1>
          </div>

          <div className="inline-block mb-8">
            <span className="text-xs font-medium tracking-wider px-4 py-2 border border-[#c4f547]/30 rounded-full text-[#c4f547] uppercase">
              Portal de empleo
            </span>
          </div>

          <h2 className="text-5xl font-bold leading-tight mb-6">
            Tu próximo
            <br />
            empleo te
            <br />
            <span className="text-[#c4f547]">está buscando</span>
          </h2>

          <p className="text-gray-400 text-lg max-w-md">
            Completa tu perfil una sola vez y recibe vacantes ordenadas por compatibilidad real con tu experiencia y habilidades.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold mb-1">94%</div>
            <div className="text-gray-500 text-sm">Tasa de match</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">+2.4k</div>
            <div className="text-gray-500 text-sm">Vacantes activas</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">3mln</div>
            <div className="text-gray-500 text-sm">Para completar perfil</div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="w-full lg:w-1/2 bg-[#e8e8e8] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo para móvil */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-bold">
              <span className="text-gray-900">Job</span>
              <span className="text-[#c4f547]">Match</span>
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {tab === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
            </h2>
            <p className="text-gray-600">
              {tab === 'register' ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
              <button
                className="text-gray-900 font-semibold underline hover:text-gray-700"
                onClick={() => {
                  setTab(tab === 'register' ? 'login' : 'register');
                  setError('');
                }}
              >
                {tab === 'register' ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                tab === 'register'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
              }`}
              onClick={() => {
                setTab('register');
                setError('');
              }}
            >
              Registro
            </button>
            <button
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                tab === 'login'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
              }`}
              onClick={() => {
                setTab('login');
                setError('');
              }}
            >
              Iniciar sesión
            </button>
          </div>

          {/* Formulario */}
          <div className="space-y-5">
            {tab === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white border-0 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="Juan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                    Apellido
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white border-0 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="García"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                Correo electrónico
              </label>
              <input
                type="email"
                className="w-full bg-white border-0 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="juan@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full bg-white border-0 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder={tab === 'register' ? 'Mínimo 8 caracteres' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {tab === 'register' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  className="w-full bg-white border-0 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Repite tu contraseña"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              className="w-full bg-[#0a0a0a] hover:bg-black text-[#c4f547] font-semibold py-3.5 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={tab === 'register' ? handleRegister : handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Cargando...
                </span>
              ) : tab === 'register' ? (
                'Crear cuenta gratis'
              ) : (
                'Iniciar sesión'
              )}
            </button>

            {tab === 'register' && (
              <p className="text-xs text-gray-600 text-center">
                Al registrarte aceptas nuestros{' '}
                <a href="#" className="underline hover:text-gray-900">
                  Términos de uso
                </a>{' '}
                y{' '}
                <a href="#" className="underline hover:text-gray-900">
                  Política de privacidad
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

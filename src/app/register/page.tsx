'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CANDIDATE' as 'CANDIDATE' | 'RECRUITER',
  });
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Mock registration - in real app would call API
    if (formData.role === 'CANDIDATE') {
      router.push('/candidate/onboarding');
    } else {
      router.push('/recruiter/company-profile');
    }
  };

  return (
    <AppShell showSidebar={false}>
      <div className="flex items-center justify-center min-h-[80vh] py-8">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Regístrate</h1>
          <p className="text-center text-muted-foreground mb-6">
            En JobMatch
          </p>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(val) =>
                  setFormData({ ...formData, role: val as any })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CANDIDATE">Candidato</SelectItem>
                  <SelectItem value="RECRUITER">Reclutador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="Tu nombre"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="tu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full">
              Regístrate
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-primary hover:underline">
              Inicia sesión aquí
            </a>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

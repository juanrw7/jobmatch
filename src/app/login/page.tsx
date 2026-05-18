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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CANDIDATE' | 'RECRUITER'>('CANDIDATE');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app would call API
    if (role === 'CANDIDATE') {
      router.push('/candidate/dashboard');
    } else {
      router.push('/recruiter/dashboard');
    }
  };

  return (
    <AppShell showSidebar={false}>
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Inicia sesión</h1>
          <p className="text-center text-muted-foreground mb-6">
            En JobMatch
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={role} onValueChange={(val) => setRole(val as any)}>
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
              <Label htmlFor="email">Email</Label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="tu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full">
              Inicia sesión
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="text-primary hover:underline">
              Regístrate aquí
            </a>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Credenciales de demostración
            </p>
            <div className="space-y-1 text-xs">
              <p><strong>Candidato:</strong> candidate@example.com</p>
              <p><strong>Reclutador:</strong> recruiter@example.com</p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

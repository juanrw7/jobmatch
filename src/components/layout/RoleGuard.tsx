'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="flex items-center justify-center w-full h-screen">Cargando...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <div className="flex items-center justify-center w-full h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Acceso no autorizado</h1>
            <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

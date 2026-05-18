'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/types';
import {
  LayoutDashboard,
  UserCircle,
  Briefcase,
  FileText,
  Zap,
  BarChart3,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const candidateLinks = [
    { href: '/candidate/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/candidate/profile', label: 'Perfil', icon: UserCircle },
    { href: '/candidate/recommendations', label: 'Recomendaciones', icon: Briefcase },
    { href: '/candidate/applications', label: 'Postulaciones', icon: FileText },
    { href: '/candidate/agent', label: 'Agentes', icon: Zap },
  ];

  const recruiterLinks = [
    { href: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/recruiter/company-profile', label: 'Empresa', icon: UserCircle },
    { href: '/recruiter/jobs', label: 'Vacantes', icon: Briefcase },
    { href: '/recruiter/candidates', label: 'Candidatos', icon: Users },
    { href: '/recruiter/agent', label: 'Agentes', icon: Zap },
  ];

  const links = role === 'CANDIDATE' ? candidateLinks : recruiterLinks;

  return (
    <aside className="w-64 bg-sidebar border-r border-border hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">JobMatch</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
          <Settings size={20} />
          <span className="text-sm font-medium">Configuración</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
          <LogOut size={20} />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

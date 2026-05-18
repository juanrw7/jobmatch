'use client';

import React from 'react';
import { ApplicationStatus } from '@/types';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { CheckCircle2, Clock, XCircle, Star, MessageSquare } from 'lucide-react';

interface ApplicationStatusBoardProps {
  applications: {
    id: string;
    jobTitle: string;
    company: string;
    status: ApplicationStatus;
    appliedAt: Date;
    updatedAt: Date;
  }[];
}

export function ApplicationStatusBoard({ applications }: ApplicationStatusBoardProps) {
  const statusConfig: Record<
    ApplicationStatus,
    { icon: React.ReactNode; color: string; label: string }
  > = {
    RECOMMENDED: {
      icon: <Star size={16} />,
      color: 'bg-blue-100 text-blue-800',
      label: 'Recomendado',
    },
    APPLIED: {
      icon: <Clock size={16} />,
      color: 'bg-yellow-100 text-yellow-800',
      label: 'Postulado',
    },
    REVIEWING: {
      icon: <Clock size={16} />,
      color: 'bg-purple-100 text-purple-800',
      label: 'En revisión',
    },
    INTERVIEW: {
      icon: <MessageSquare size={16} />,
      color: 'bg-green-100 text-green-800',
      label: 'Entrevista',
    },
    REJECTED: {
      icon: <XCircle size={16} />,
      color: 'bg-red-100 text-red-800',
      label: 'Rechazado',
    },
    OFFER: {
      icon: <CheckCircle2 size={16} />,
      color: 'bg-green-100 text-green-800',
      label: 'Oferta',
    },
    HIRED: {
      icon: <CheckCircle2 size={16} />,
      color: 'bg-green-100 text-green-800',
      label: 'Contratado',
    },
  };

  const statusOrder: ApplicationStatus[] = [
    'RECOMMENDED',
    'APPLIED',
    'REVIEWING',
    'INTERVIEW',
    'OFFER',
    'HIRED',
    'REJECTED',
  ];

  const grouped = statusOrder.reduce(
    (acc, status) => {
      acc[status] = applications.filter((app) => app.status === status);
      return acc;
    },
    {} as Record<ApplicationStatus, typeof applications>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statusOrder.map((status) => {
        const apps = grouped[status];
        const config = statusConfig[status];

        return (
          <Card key={status} className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-2 rounded-lg ${config.color}`}>{config.icon}</div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  {config.label}
                </p>
                <p className="text-2xl font-bold">{apps.length}</p>
              </div>
            </div>

            {apps.length > 0 && (
              <div className="space-y-2 mt-4 pt-4 border-t">
                {apps.slice(0, 3).map((app) => (
                  <div key={app.id} className="text-sm">
                    <p className="font-medium line-clamp-1">{app.jobTitle}</p>
                    <p className="text-xs text-muted-foreground">{app.company}</p>
                  </div>
                ))}
                {apps.length > 3 && (
                  <p className="text-xs font-semibold text-primary">+{apps.length - 3} más</p>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

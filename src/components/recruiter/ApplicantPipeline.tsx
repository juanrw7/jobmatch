'use client';

import React from 'react';
import { Application, ApplicationStatus } from '@/types';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { MatchScore } from '../jobs/MatchScore';
import { MessageCircle, Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface ApplicantPipelineProps {
  applications: Application[];
  onUpdateStatus: (applicationId: string, newStatus: ApplicationStatus) => void;
  onContact: (applicationId: string) => void;
  onScheduleInterview: (applicationId: string) => void;
}

export function ApplicantPipeline({
  applications,
  onUpdateStatus,
  onContact,
  onScheduleInterview,
}: ApplicantPipelineProps) {
  const statusFlow: ApplicationStatus[] = [
    'APPLIED',
    'REVIEWING',
    'INTERVIEW',
    'OFFER',
    'HIRED',
  ];

  const statusLabels: Record<ApplicationStatus, string> = {
    RECOMMENDED: '⭐ Recomendado',
    APPLIED: '📋 Postulado',
    REVIEWING: '👀 En revisión',
    INTERVIEW: '💼 Entrevista',
    REJECTED: '❌ Rechazado',
    OFFER: '🎉 Oferta',
    HIRED: '✅ Contratado',
  };

  const getBgColor = (status: ApplicationStatus) => {
    const colors: Record<ApplicationStatus, string> = {
      RECOMMENDED: 'bg-blue-50 border-blue-200',
      APPLIED: 'bg-gray-50 border-gray-200',
      REVIEWING: 'bg-purple-50 border-purple-200',
      INTERVIEW: 'bg-green-50 border-green-200',
      REJECTED: 'bg-red-50 border-red-200',
      OFFER: 'bg-yellow-50 border-yellow-200',
      HIRED: 'bg-green-50 border-green-200',
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      {statusFlow.map((status) => {
        const applicants = applications.filter((app) => app.status === status);

        return (
          <div key={status}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{statusLabels[status]}</h3>
              <Badge variant="outline">{applicants.length}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {applicants.map((app) => (
                <Card
                  key={app.id}
                  className={`p-4 border-2 ${getBgColor(status)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-sm">
                        {app.candidate?.name || 'Candidato'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Aplicó hace{' '}
                        {Math.floor(
                          (Date.now() - new Date(app.appliedAt).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        días
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => onContact(app.id)}
                    >
                      <MessageCircle size={14} />
                    </Button>
                    {status === 'REVIEWING' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onScheduleInterview(app.id)}
                      >
                        <Calendar size={14} />
                      </Button>
                    )}
                    {status !== 'REJECTED' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onUpdateStatus(app.id, 'REJECTED')}
                      >
                        <XCircle size={14} />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}

              {applicants.length === 0 && (
                <div className="col-span-full text-center py-6 text-sm text-muted-foreground">
                  Sin candidatos en esta etapa
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

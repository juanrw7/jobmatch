'use client';

import React from 'react';
import { Job } from '@/types';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { WorkModeBadge } from '../jobs/WorkModeBadge';
import { SalaryRange } from '../jobs/SalaryRange';
import { Edit, Trash2, Eye, BarChart3 } from 'lucide-react';

interface RecruiterJobCardProps {
  job: Job;
  applicantsCount?: number;
  viewsCount?: number;
  qualityScore?: number;
  onEdit: () => void;
  onDelete: () => void;
  onViewApplicants: () => void;
}

export function RecruiterJobCard({
  job,
  applicantsCount = 0,
  viewsCount = 0,
  qualityScore = 0,
  onEdit,
  onDelete,
  onViewApplicants,
}: RecruiterJobCardProps) {
  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {job.description.substring(0, 100)}...
          </p>
        </div>
        {qualityScore > 0 && (
          <div className={`text-right ${getQualityColor(qualityScore)}`}>
            <p className="text-sm font-semibold">Calidad</p>
            <p className="text-2xl font-bold">{qualityScore}%</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <WorkModeBadge
          workMode={job.workLocation.workMode}
          remoteScope={job.workLocation.remoteScope}
        />
        <SalaryRange salary={job.salary} />
        {job.active ? (
          <Badge variant="default">Activa</Badge>
        ) : (
          <Badge variant="secondary">Inactiva</Badge>
        )}
      </div>

      <div className="flex gap-4 mb-4 py-4 border-y">
        <div className="text-center flex-1">
          <p className="text-sm text-muted-foreground">Postulaciones</p>
          <p className="text-2xl font-bold">{applicantsCount}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-sm text-muted-foreground">Vistas</p>
          <p className="text-2xl font-bold">{viewsCount}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onViewApplicants}
        >
          <Eye size={16} className="mr-1" />
          Aplicantes
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onEdit}
        >
          <Edit size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </Card>
  );
}

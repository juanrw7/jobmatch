'use client';

import React from 'react';
import { Job } from '@/types';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { WorkModeBadge } from '../jobs/WorkModeBadge';
import { SalaryRange } from '../jobs/SalaryRange';
import { MatchScore } from '../jobs/MatchScore';
import { BookmarkIcon, MapPin } from 'lucide-react';

interface JobRecommendationCardProps {
  job: Job;
  matchScore: number;
  onViewDetails: () => void;
  onApply: () => void;
  saved?: boolean;
}

export function JobRecommendationCard({
  job,
  matchScore,
  onViewDetails,
  onApply,
  saved = false,
}: JobRecommendationCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.recruiterId}</p>
          </div>
          <MatchScore score={matchScore} size="lg" />
        </div>

        <p className="text-sm text-foreground mb-4 line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <WorkModeBadge
            workMode={job.workLocation.workMode}
            remoteScope={job.workLocation.remoteScope}
            hybridDaysPerWeek={job.workLocation.hybridDaysPerWeek}
          />
          <SalaryRange salary={job.salary} />
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">HABILIDADES REQUERIDAS</p>
          <div className="flex flex-wrap gap-1">
            {job.skills.slice(0, 4).map((skill) => (
              <Badge key={skill.id} variant="outline" className="text-xs">
                {skill.name}
              </Badge>
            ))}
            {job.skills.length > 4 && <Badge variant="outline">+{job.skills.length - 4}</Badge>}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <MapPin size={14} />
          {job.workLocation.city && <span>{job.workLocation.city}</span>}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onViewDetails}
          >
            Ver detalles
          </Button>
          <Button className="flex-1" onClick={onApply}>
            Aplicar
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={saved ? 'text-primary' : ''}
          >
            <BookmarkIcon size={18} fill={saved ? 'currentColor' : 'none'} />
          </Button>
        </div>
      </div>
    </Card>
  );
}

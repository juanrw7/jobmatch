'use client';

import React from 'react';
import { Candidate } from '@/types';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { MatchScore } from '../jobs/MatchScore';
import { Mail, Phone, FileText } from 'lucide-react';

interface CandidateMatchCardProps {
  candidate: Candidate;
  matchScore: number;
  onContact: () => void;
  onViewProfile: () => void;
}

export function CandidateMatchCard({
  candidate,
  matchScore,
  onContact,
  onViewProfile,
}: CandidateMatchCardProps) {
  const topSkills = candidate.skills.slice(0, 3);

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
          {candidate.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold">{candidate.name}</h3>
            <MatchScore score={matchScore} size="md" />
          </div>
          <p className="text-sm text-muted-foreground">{candidate.email}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2">HABILIDADES</p>
        <div className="flex flex-wrap gap-1">
          {topSkills.map((skill) => (
            <Badge key={skill.id} variant="outline" className="text-xs">
              {skill.name}
            </Badge>
          ))}
          {candidate.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{candidate.skills.length - 3}
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-4 p-3 bg-muted rounded-lg">
        <p className="text-xs font-semibold text-muted-foreground mb-1">EXPERIENCIA</p>
        <p className="text-sm">
          {candidate.experience.length} posición{candidate.experience.length !== 1 ? 'es' : ''}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onViewProfile}
        >
          <FileText size={16} className="mr-2" />
          Ver perfil
        </Button>
        <Button
          className="flex-1"
          onClick={onContact}
        >
          <Mail size={16} className="mr-2" />
          Contactar
        </Button>
      </div>
    </Card>
  );
}

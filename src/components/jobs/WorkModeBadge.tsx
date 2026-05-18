'use client';

import React from 'react';
import { WorkMode, RemoteScope } from '@/types';
import { Badge } from '@/app/components/ui/badge';
import { MapPin, Wifi, Monitor } from 'lucide-react';

interface WorkModeBadgeProps {
  workMode: WorkMode;
  remoteScope?: RemoteScope;
  hybridDaysPerWeek?: number;
  showLabel?: boolean;
}

export function WorkModeBadge({
  workMode,
  remoteScope,
  hybridDaysPerWeek,
  showLabel = true,
}: WorkModeBadgeProps) {
  const getIcon = () => {
    switch (workMode) {
      case 'ONSITE':
        return <MapPin size={14} />;
      case 'REMOTE':
        return <Wifi size={14} />;
      case 'HYBRID':
        return <Monitor size={14} />;
      case 'FLEXIBLE':
        return <Wifi size={14} />;
    }
  };

  const getLabel = () => {
    const labels: Record<WorkMode, string> = {
      ONSITE: 'Presencial',
      REMOTE: 'Remoto',
      HYBRID: 'Híbrido',
      FLEXIBLE: 'Flexible',
    };
    let label = labels[workMode];

    if (workMode === 'REMOTE' && remoteScope) {
      label += ` (${remoteScope})`;
    }

    if (workMode === 'HYBRID' && hybridDaysPerWeek) {
      label += ` - ${hybridDaysPerWeek} días/semana`;
    }

    return label;
  };

  const getVariant = () => {
    switch (workMode) {
      case 'ONSITE':
        return 'default';
      case 'REMOTE':
        return 'secondary';
      case 'HYBRID':
        return 'outline';
      case 'FLEXIBLE':
        return 'secondary';
    }
  };

  return (
    <Badge variant={getVariant as any}>
      <span className="flex items-center gap-1">
        {getIcon()}
        {showLabel && getLabel()}
      </span>
    </Badge>
  );
}

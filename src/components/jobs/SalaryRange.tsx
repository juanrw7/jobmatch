'use client';

import React from 'react';
import { SalaryInfo } from '@/types';
import { Badge } from '@/app/components/ui/badge';
import { DollarSign } from 'lucide-react';

interface SalaryRangeProps {
  salary: SalaryInfo;
  showCurrency?: boolean;
  compact?: boolean;
}

export function SalaryRange({ salary, showCurrency = true, compact = false }: SalaryRangeProps) {
  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: salary.currency,
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const periodLabels: Record<string, string> = {
    MONTHLY: '/mes',
    YEARLY: '/año',
    HOURLY: '/hora',
  };

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <DollarSign size={14} />
      <span>
        {formatSalary(salary.salaryMin)} - {formatSalary(salary.salaryMax)}
        {periodLabels[salary.period]}
      </span>
    </Badge>
  );
}

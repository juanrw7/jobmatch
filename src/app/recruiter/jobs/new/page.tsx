'use client';

import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import Link from 'next/link';
import { useState } from 'react';

export default function RecruiterJobsNewPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workMode: 'HYBRID',
    salaryMin: '',
    salaryMax: '',
    currency: 'COP',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Job created:', formData);
    // In real app would save to backend
  };

  return (
    <RoleGuard allowedRoles={['RECRUITER']}>
      <AppShell>
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Crear Nueva Vacante</h1>
            <p className="text-muted-foreground">
              Publica una vacante y encuentra los mejores candidatos.
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título de la Vacante</Label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="ej: Senior React Developer"
                  className="w-full px-3 py-2 border border-input rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe la vacante, responsabilidades y requisitos..."
                  rows={6}
                  className="w-full px-3 py-2 border border-input rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workMode">Modalidad</Label>
                  <Select value={formData.workMode} onValueChange={(v) => handleChange('workMode', v)}>
                    <SelectTrigger id="workMode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONSITE">Presencial</SelectItem>
                      <SelectItem value="REMOTE">Remoto</SelectItem>
                      <SelectItem value="HYBRID">Híbrido</SelectItem>
                      <SelectItem value="FLEXIBLE">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Select value={formData.currency} onValueChange={(v) => handleChange('currency', v)}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COP">COP</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Salario Mínimo</Label>
                  <input
                    id="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => handleChange('salaryMin', e.target.value)}
                    placeholder="3000000"
                    className="w-full px-3 py-2 border border-input rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Salario Máximo</Label>
                  <input
                    id="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => handleChange('salaryMax', e.target.value)}
                    placeholder="7000000"
                    className="w-full px-3 py-2 border border-input rounded-md"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Crear Vacante
                </Button>
                <Link href="/recruiter/jobs" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </AppShell>
    </RoleGuard>
  );
}

'use client';

import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';

export default function RecruiterCompanyProfilePage() {
  const [companyData, setCompanyData] = useState({
    name: 'Tech Solutions Inc.',
    description: 'Empresa de soluciones tecnológicas...',
    website: 'https://techsolutions.com',
    employees: '50-200',
    industry: 'Software',
  });

  const handleChange = (field: string, value: string) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Company data saved:', companyData);
  };

  return (
    <RoleGuard allowedRoles={['RECRUITER']}>
      <AppShell>
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Perfil de Empresa</h1>
            <p className="text-muted-foreground">
              Administra la información de tu empresa.
            </p>
          </div>

          <Card className="p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Empresa</Label>
              <input
                id="name"
                type="text"
                value={companyData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                value={companyData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <input
                  id="website"
                  type="url"
                  value={companyData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employees">Número de Empleados</Label>
                <input
                  id="employees"
                  type="text"
                  value={companyData.employees}
                  onChange={(e) => handleChange('employees', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1">
                Guardar Cambios
              </Button>
              <Link href="/recruiter/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </AppShell>
    </RoleGuard>
  );
}

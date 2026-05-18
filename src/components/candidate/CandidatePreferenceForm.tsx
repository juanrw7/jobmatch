'use client';

import React, { useState } from 'react';
import { CandidatePreferences } from '@/types';
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
import { Checkbox } from '@/app/components/ui/checkbox';

interface CandidatePreferenceFormProps {
  preferences: CandidatePreferences;
  onSave: (preferences: CandidatePreferences) => void;
}

export function CandidatePreferenceForm({ preferences, onSave }: CandidatePreferenceFormProps) {
  const [formData, setFormData] = useState(preferences);

  const handleWorkModeChange = (value: string) => {
    setFormData({
      ...formData,
      workLocation: { ...formData.workLocation, workMode: value as any },
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Preferencias Laborales</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Work Mode */}
        <div className="space-y-2">
          <Label htmlFor="workMode">Modalidad de trabajo</Label>
          <Select
            value={formData.workLocation.workMode}
            onValueChange={handleWorkModeChange}
          >
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

        {/* Remote Scope */}
        {formData.workLocation.workMode === 'REMOTE' && (
          <div className="space-y-2">
            <Label htmlFor="remoteScope">Alcance remoto</Label>
            <Select
              value={formData.workLocation.remoteScope || ''}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  workLocation: { ...formData.workLocation, remoteScope: value as any },
                })
              }
            >
              <SelectTrigger id="remoteScope">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COLOMBIA">Colombia</SelectItem>
                <SelectItem value="LATAM">Latinoamérica</SelectItem>
                <SelectItem value="WORLDWIDE">Worldwide</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Salary Min */}
        <div className="space-y-2">
          <Label htmlFor="salaryMin">Salario mínimo</Label>
          <input
            id="salaryMin"
            type="number"
            value={formData.salary.salaryMin}
            onChange={(e) =>
              setFormData({
                ...formData,
                salary: { ...formData.salary, salaryMin: parseFloat(e.target.value) },
              })
            }
            className="w-full px-3 py-2 border border-input rounded-md"
          />
        </div>

        {/* Salary Max */}
        <div className="space-y-2">
          <Label htmlFor="salaryMax">Salario máximo</Label>
          <input
            id="salaryMax"
            type="number"
            value={formData.salary.salaryMax}
            onChange={(e) =>
              setFormData({
                ...formData,
                salary: { ...formData.salary, salaryMax: parseFloat(e.target.value) },
              })
            }
            className="w-full px-3 py-2 border border-input rounded-md"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 mt-6 pt-6 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="relocation"
            checked={formData.workLocation.requiresRelocation}
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                workLocation: {
                  ...formData.workLocation,
                  requiresRelocation: checked as boolean,
                },
              })
            }
          />
          <Label htmlFor="relocation" className="font-normal">
            Disponible para reubicación
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="visible"
            checked={formData.visibleToRecruiters}
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                visibleToRecruiters: checked as boolean,
              })
            }
          />
          <Label htmlFor="visible" className="font-normal">
            Visible para reclutadores
          </Label>
        </div>
      </div>

      <Button onClick={handleSave} className="w-full mt-6">
        Guardar Preferencias
      </Button>
    </Card>
  );
}

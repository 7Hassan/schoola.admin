"use client"

import React from 'react'
import { Label } from '@workspace/ui/components/ui/label'
import { Button } from '@workspace/ui/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@workspace/ui/components/ui/select'
import { Switch } from '@workspace/ui/components/ui/switch'
import { RotateCcw } from 'lucide-react'

export type StudyGroup = { id: string; name: string; level?: string }

export type AcademicInfoProps = {
  register: any
  errors: any
  watchedValues: any
  resetField: (field: any) => void
  setValue: (name: string, value: any) => void
  isAddMode: boolean
  originalData: any
  canEdit: boolean
  studyGroups?: StudyGroup[]
}

export function AcademicInfo({ register, errors, watchedValues, resetField, setValue, isAddMode, originalData, canEdit, studyGroups = [] }: AcademicInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-semibold">Academic Information</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
          <div className="flex space-x-2">
            <Select value={watchedValues.grade ? String(watchedValues.grade) : '__NONE__'} onValueChange={(v) => setValue('grade', v === '__NONE__' ? '' : v)} disabled={!canEdit}>
              <SelectTrigger className={errors.grade ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__NONE__">Select grade</SelectItem>
                {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {canEdit && (
              <Button type="button" variant="outline" size="sm" onClick={() => resetField('grade')} disabled={watchedValues.grade === originalData?.grade}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
          {errors.grade && <p className="text-sm text-red-500">{errors.grade.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <div className="flex space-x-2">
            <Select value={watchedValues.status} onValueChange={(value) => setValue('status', value)} disabled={!canEdit}>
              <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
                <SelectItem value="Free-day">Free-day</SelectItem>
                <SelectItem value="Waiting">Waiting</SelectItem>
              </SelectContent>
            </Select>
            {canEdit && (
              <Button type="button" variant="outline" size="sm" onClick={() => resetField('status')} disabled={watchedValues.status === originalData?.status}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
          {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="group">Study Group</Label>
          <div className="flex space-x-2">
            <Select value={watchedValues.group || '__NONE__'} onValueChange={(value) => setValue('group', value === '__NONE__' ? '' : value)} disabled={!canEdit}>
              <SelectTrigger className={errors.group ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__NONE__">Select group</SelectItem>
                {studyGroups.map((group) => (
                  <SelectItem key={group.id} value={group.name}>
                    {group.name} {group.level ? `(${group.level})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {canEdit && (
              <Button type="button" variant="outline" size="sm" onClick={() => resetField('group')} disabled={watchedValues.group === originalData?.group}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
          {errors.group && <p className="text-sm text-red-500">{errors.group.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paid">Payment Status</Label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch id="paid" checked={watchedValues.paid} onCheckedChange={(checked) => setValue('paid', checked)} disabled={!canEdit} />
              <Label htmlFor="paid" className="text-sm">
                {watchedValues.paid ? 'Paid' : 'Unpaid'}
              </Label>
            </div>
            {canEdit && (
              <Button type="button" variant="outline" size="sm" onClick={() => resetField('paid')} disabled={watchedValues.paid === originalData?.paid}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import React from 'react'
import { Label } from '@workspace/ui/components/ui/label'
import { Input } from '@workspace/ui/components/ui/input'
import { Button } from '@workspace/ui/components/ui/button'
import { RotateCcw, User } from 'lucide-react'

export type BasicInfoProps = {
  register: any
  errors: any
  watchedValues: any
  resetField: (field: any) => void
  isAddMode: boolean
  originalData: any
  canEdit: boolean
}

export function BasicInfo({ register, errors, watchedValues, resetField, isAddMode, originalData, canEdit }: BasicInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <User className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold">Basic Information</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="childName">Child Name *</Label>
          <div className="flex space-x-2">
            <Input id="childName" {...register('childName')} disabled={!canEdit} className={errors.childName ? 'border-red-500' : ''} />
            {canEdit && (
              <Button type="button" variant="outline" size="sm" onClick={() => resetField('childName')} disabled={isAddMode ? watchedValues.childName === '' : watchedValues.childName === originalData?.childName}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
          {errors.childName && <p className="text-sm text-red-500">{errors.childName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentName">Parent Name *</Label>
          <div className="flex space-x-2">
            <Input id="parentName" {...register('parentName')} disabled={!canEdit} className={errors.parentName ? 'border-red-500' : ''} />
            {canEdit && (
              <Button type="button" variant="outline" size="sm" onClick={() => resetField('parentName')} disabled={isAddMode ? watchedValues.parentName === '' : watchedValues.parentName === originalData?.parentName}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
          {errors.parentName && <p className="text-sm text-red-500">{errors.parentName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <div className="flex space-x-2">
            <Input id="age" type="number" min={5} max={18} {...register('age', { valueAsNumber: true })} disabled={!canEdit} className={errors.age ? 'border-red-500' : ''} />
            {canEdit && (
              <Button type="button" variant="outline" size="sm" onClick={() => resetField('age')} disabled={watchedValues.age === originalData?.age}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
          {errors.age && <p className="text-sm text-red-500">{errors.age.message}</p>}
        </div>
      </div>
    </div>
  )
}

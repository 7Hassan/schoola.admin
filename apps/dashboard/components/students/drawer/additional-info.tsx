"use client"

import React from 'react'
import { Label } from '@workspace/ui/components/ui/label'
import { Textarea } from '@workspace/ui/components/ui/textarea'

export type AdditionalInfoProps = {
  register: any
  errors: any
  canEdit: boolean
}

export function AdditionalInfo({ register, errors, canEdit }: AdditionalInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-semibold">Additional Information</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="info">Info</Label>
        <Textarea id="info" {...register('info')} disabled={!canEdit} className={errors.info ? 'border-red-500' : ''} rows={3} placeholder="Additional information about the student..." />
        {errors.info && <p className="text-sm text-red-500">{errors.info.message}</p>}
      </div>
    </div>
  )
}

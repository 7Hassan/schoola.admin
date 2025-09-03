"use client"

import React from 'react'
import { Label } from '@workspace/ui/components/ui/label'
import { Input } from '@workspace/ui/components/ui/input'
import { Button } from '@workspace/ui/components/ui/button'
import { Phone } from 'lucide-react'
import { PhoneInput } from '@/components/ui/phone-input'
import { validatePhoneNumber } from '@/utils/phone-utils'

export type ContactInfoProps = {
  register: any
  errors: any
  watchedValues: any
  resetField: (field: any) => void
  setValue: (name: string, value: any, options?: any) => void
  isAddMode: boolean
  originalData: any
  canEdit: boolean
}

export function ContactInfo({
  register,
  errors,
  watchedValues,
  resetField,
  setValue,
  isAddMode,
  originalData,
  canEdit
}: ContactInfoProps) {
  return (
    <div className="space-y-4">
      {/* Section Title */}
      <div className="flex items-center space-x-2">
        <Phone className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold">Contact Information</h3>
      </div>

      {/* Parent Phone */}
      <div className="space-y-2">
        <Label htmlFor="parentPhone">Parent Phone * (EG / AE)</Label>
        <div className="flex space-x-2">
          <div className="flex-1">
            <PhoneInput
              value={watchedValues.parentPhone || ''}
              onChange={(value) =>
                setValue('parentPhone', value, {
                  shouldDirty: true,
                  shouldValidate: true
                })
              }
              allowedCountries={['EG', 'AE']}
              defaultCountryCode="EG"
              disabled={!canEdit}
              required
            />
          </div>
          {canEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setValue('parentPhone', '+20 ', {
                  shouldDirty: true,
                  shouldValidate: true
                })
              }
              disabled={watchedValues.parentPhone === originalData?.parentPhone}
              className="mt-2 self-start"
              title="Reset phone number"
            >
              Reset
            </Button>
          )}
        </div>
        {/* show validation errors */}
        {errors.parentPhone && (
          <p className="text-sm text-red-500">{errors.parentPhone.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <div className="flex space-x-2">
          <Input
            id="email"
            type="email"
            {...register('email')}
            disabled={!canEdit}
            className={errors.email ? 'border-red-500' : ''}
          />
          {canEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => resetField('email')}
              disabled={watchedValues.email === originalData?.email}
            >
              Reset
            </Button>
          )}
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
    </div>
  )
}

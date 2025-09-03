"use client"

import React from 'react'
import { Label } from '@workspace/ui/components/ui/label'
import { Input } from '@workspace/ui/components/ui/input'

export interface PhoneSearchProps {
  phoneQuery: string
  updateFilters: (patch: Partial<any>) => void
}

export function PhoneSearch({ phoneQuery, updateFilters }: PhoneSearchProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="phoneSearch" className="text-sm font-medium">Phone Number</Label>
      <Input id="phoneSearch" placeholder="Search by phone number..." value={phoneQuery} onChange={(e) => updateFilters({ phoneQuery: e.target.value })} />
    </div>
  )
}

"use client"

import React from 'react'
import { Label } from '@workspace/ui/components/ui/label'

export interface PaymentFilterProps {
  paidFilter: 'all' | 'paid' | 'unpaid'
  updateFilters: (patch: Partial<any>) => void
}

export function PaymentFilter({ paidFilter, updateFilters }: PaymentFilterProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Payment Status</Label>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input type="radio" id="all" name="paidFilter" checked={paidFilter === 'all'} onChange={() => updateFilters({ paidFilter: 'all' })} className="w-4 h-4" />
          <Label htmlFor="all" className="text-sm">All</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input type="radio" id="paid" name="paidFilter" checked={paidFilter === 'paid'} onChange={() => updateFilters({ paidFilter: 'paid' })} className="w-4 h-4" />
          <Label htmlFor="paid" className="text-sm">Paid</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input type="radio" id="unpaid" name="paidFilter" checked={paidFilter === 'unpaid'} onChange={() => updateFilters({ paidFilter: 'unpaid' })} className="w-4 h-4" />
          <Label htmlFor="unpaid" className="text-sm">Unpaid</Label>
        </div>
      </div>
    </div>
  )
}

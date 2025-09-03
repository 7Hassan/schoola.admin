"use client"

import React from 'react'
import { Label } from '@workspace/ui/components/ui/label'
import { Slider } from '@workspace/ui/components/ui/slider'

export interface AgeRangeFilterProps {
  ageRange: [number, number]
  updateFilters: (patch: Partial<any>) => void
}

export function AgeRangeFilter({ ageRange, updateFilters }: AgeRangeFilterProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Age Range</Label>
      <div className="p-2">
        <Slider
          value={ageRange}
          onValueChange={(value) => updateFilters({ ageRange: value as [number, number] })}
          min={5}
          max={18}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{ageRange[0]} years</span>
          <span>{ageRange[1]} years</span>
        </div>
      </div>
    </div>
  )
}

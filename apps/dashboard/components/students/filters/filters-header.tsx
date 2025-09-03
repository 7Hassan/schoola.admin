"use client"

import React from 'react'
import { Button } from '@workspace/ui/components/ui/button'
import { RotateCcw, Filter } from 'lucide-react'

export type FiltersHeaderProps = {
  hasActiveFilters: boolean
  onClear: () => void
}

export function FiltersHeader({ hasActiveFilters, onClear }: FiltersHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      </div>
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={onClear} className="text-gray-600 hover:text-gray-900">
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      )}
    </div>
  )
}

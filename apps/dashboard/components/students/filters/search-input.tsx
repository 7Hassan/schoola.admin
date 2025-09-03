"use client"

import React from 'react'
import { Label } from '@workspace/ui/components/ui/label'
import { Input } from '@workspace/ui/components/ui/input'

export interface SearchInputProps {
  searchQuery: string
  updateFilters: (patch: Partial<any>) => void
}

export function SearchInput({ searchQuery, updateFilters }: SearchInputProps) {
  return (
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="search" className="text-sm font-medium">Search Students</Label>
      <Input id="search" placeholder="Search by student name..." value={searchQuery} onChange={(e) => updateFilters({ searchQuery: e.target.value })} className="w-full" />
    </div>
  )
}

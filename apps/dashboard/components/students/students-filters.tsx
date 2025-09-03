"use client"

import { useState } from 'react'
import { Card } from '@workspace/ui/components/ui/card'
import { Button } from '@workspace/ui/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { useStudentsStore, StudentStatus } from '@/stores/students-store'
import React from 'react'

import { AgeRangeFilter } from './filters/age-range-filter'
import { StatusFilter } from './filters/status-filter'
import { PaymentFilter } from './filters/payment-filter'
import { GroupsFilter } from './filters/groups-filter'
import { DateRangeFilter } from './filters/date-range-filter'
import { PhoneSearch } from './filters/phone-search'
import { SearchInput } from './filters/search-input'
import { FiltersHeader } from './filters/filters-header'

const statusOptions: StudentStatus[] = ['Active', 'Archived', 'Free-day', 'Waiting']

export function StudentsFilters() {
  const { filters, studyGroups, updateFilters } = useStudentsStore()

  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isGroupsOpen, setIsGroupsOpen] = useState(false)
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false)

  const handleStatusToggle = (status: StudentStatus) => {
    const newStatus = filters.status.includes(status) ? filters.status.filter((s) => s !== status) : [...filters.status, status]
    updateFilters({ status: newStatus })
  }

  // Enhanced: support selecting students with no group
  const NO_GROUP = { id: '', name: '(No Group)' };
  const groupOptions = [NO_GROUP, ...studyGroups];
  // When NO_GROUP.id ('') is selected, filter for students with no group value (empty, null, or undefined)
  const handleGroupToggle = (groupId: string) => {
    const newGroups = filters.studyGroups.includes(groupId)
      ? filters.studyGroups.filter((g) => g !== groupId)
      : [...filters.studyGroups, groupId];
    updateFilters({ studyGroups: newGroups });
  }

  // Enhance: filter logic for students with no group should be handled in the students list/store, e.g.:
  // If filters.studyGroups includes '', filter students where student.group is falsy (empty string, null, or undefined)

  const handleDateRangeSelect = (range?: { from?: Date; to?: Date }) => {
    updateFilters({ dateRange: [range?.from || null, range?.to || null] })
  }

  const clearAllFilters = () => {
    updateFilters({
      ageRange: [5, 18],
      status: [],
      paidFilter: 'all',
      studyGroups: [],
      dateRange: [null, null],
      sourceCode: '',
      searchQuery: '',
      phoneQuery: ''
    })
  }

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.paidFilter !== 'all' ||
    filters.studyGroups.length > 0 ||
    filters.dateRange[0] !== null ||
    filters.dateRange[1] !== null ||
    filters.sourceCode !== '' ||
    filters.searchQuery !== '' ||
    filters.phoneQuery !== '' ||
    filters.ageRange[0] !== 5 ||
    filters.ageRange[1] !== 18

  return (
    <Card className="p-6 mb-6">
      <FiltersHeader hasActiveFilters={hasActiveFilters} onClear={clearAllFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AgeRangeFilter ageRange={filters.ageRange} updateFilters={updateFilters} />

        <StatusFilter statusOptions={statusOptions} selectedStatus={filters.status} open={isStatusOpen} setOpen={setIsStatusOpen} onToggle={handleStatusToggle} />

        <PaymentFilter paidFilter={filters.paidFilter} updateFilters={updateFilters} />

        <GroupsFilter
          studyGroups={groupOptions}
          selectedGroups={filters.studyGroups}
          open={isGroupsOpen}
          setOpen={setIsGroupsOpen}
          onToggle={handleGroupToggle}
        />

        <DateRangeFilter dateRange={filters.dateRange} open={isDateRangeOpen} setOpen={setIsDateRangeOpen} onSelect={handleDateRangeSelect} />

        <PhoneSearch phoneQuery={filters.phoneQuery} updateFilters={updateFilters} />

        <SearchInput searchQuery={filters.searchQuery} updateFilters={updateFilters} />
      </div>
    </Card>
  )
}


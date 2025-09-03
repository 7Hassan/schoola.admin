'use client'

import React from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Badge } from '@workspace/ui/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@workspace/ui/components/ui/popover'
import { Checkbox } from '@workspace/ui/components/ui/checkbox'
import { Label } from '@workspace/ui/components/ui/label'
import { Input } from '@workspace/ui/components/ui/input'
import {
  useTeachersManagementStore,
  type Department,
  type Subject
} from '@/stores/teachers'

export function TeachersFilters() {
  const { filters, departments, subjects, updateFilters, getFilteredTeachers } =
    useTeachersManagementStore()

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      updateFilters({ status: [] })
    } else {
      updateFilters({ status: [value as 'active' | 'inactive' | 'on_leave'] })
    }
  }

  const handleDepartmentChange = (value: string) => {
    if (value === 'all') {
      updateFilters({ departments: [] })
    } else {
      updateFilters({ departments: [value] })
    }
  }

  const handleEmploymentTypeChange = (value: string) => {
    if (value === 'all') {
      updateFilters({ employmentType: [] })
    } else {
      updateFilters({
        employmentType: [value as 'full_time' | 'part_time' | 'contract']
      })
    }
  }

  const handleSubjectToggle = (subjectId: string, checked: boolean) => {
    const newSubjects = checked
      ? [...filters.subjects, subjectId]
      : filters.subjects.filter((s: string) => s !== subjectId)
    updateFilters({ subjects: newSubjects })
  }

  const handleSearchChange = (value: string) => {
    updateFilters({ searchQuery: value })
  }

  const clearAllFilters = () => {
    updateFilters({
      searchQuery: '',
      status: [],
      departments: [],
      subjects: [],
      employmentType: [],
      experienceRange: [0, 20],
      hireDate: [null, null]
    })
  }

  const getActiveFilterCount = () => {
    return (
      (filters.searchQuery ? 1 : 0) +
      filters.status.length +
      filters.departments.length +
      filters.subjects.length +
      filters.employmentType.length +
      (filters.experienceRange[0] !== 0 || filters.experienceRange[1] !== 20
        ? 1
        : 0) +
      (filters.hireDate[0] || filters.hireDate[1] ? 1 : 0)
    )
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <Input
            placeholder="Search teachers by name, email, or employee ID..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-gray-700">Status:</Label>
          <Select
            value={filters.status.length === 1 ? filters.status[0] : 'all'}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-gray-700">
            Department:
          </Label>
          <Select
            value={
              filters.departments.length === 1 ? filters.departments[0] : 'all'
            }
            onValueChange={handleDepartmentChange}
          >
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept: Department) => (
                <SelectItem
                  key={dept.id}
                  value={dept.id}
                >
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employment Type Filter */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-gray-700">
            Employment:
          </Label>
          <Select
            value={
              filters.employmentType.length === 1
                ? filters.employmentType[0]
                : 'all'
            }
            onValueChange={handleEmploymentTypeChange}
          >
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="full_time">Full Time</SelectItem>
              <SelectItem value="part_time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subjects Filter - Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-9"
            >
              Subjects
              {filters.subjects.length > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {filters.subjects.length}
                </Badge>
              )}
              <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80"
            align="start"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Select Subjects</Label>
                {filters.subjects.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFilters({ subjects: [] })}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {subjects.map((subject: Subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`subject-${subject.id}`}
                      checked={filters.subjects.includes(subject.id)}
                      onCheckedChange={(checked) =>
                        handleSubjectToggle(subject.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`subject-${subject.id}`}
                      className="text-sm"
                    >
                      {subject.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear All Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All ({activeFilterCount})
          </Button>
        )}

        {/* Results Count */}
        <div className="ml-auto text-sm text-gray-600">
          {getFilteredTeachers().length} teachers
        </div>
      </div>
    </div>
  )
}


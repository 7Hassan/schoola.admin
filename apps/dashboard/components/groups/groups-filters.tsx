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
import {
  useGroupsStore,
  GroupStatus,
  SubscriptionType
} from '@/stores/groups-store'

export function GroupsFilters() {
  const {
    filters,
    teachers,
    courses,
    locations,
    updateFilters,
    getFilteredGroups
  } = useGroupsStore()

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      updateFilters({ status: [] })
    } else {
      updateFilters({ status: [value as GroupStatus] })
    }
  }
  const handleLocationChange = (value: string) => {
    if (value === 'all') {
      updateFilters({ locations: [] })
    } else {
      updateFilters({ locations: [value] })
    }
  }

  const handleSubscriptionTypeChange = (value: string) => {
    if (value === 'all') {
      updateFilters({ subscriptionType: [] })
    } else {
      updateFilters({ subscriptionType: [value as SubscriptionType] })
    }
  }

  const handleTeacherToggle = (teacherId: string, checked: boolean) => {
    const newTeachers = checked
      ? [...filters.teachers, teacherId]
      : filters.teachers.filter((t) => t !== teacherId)
    updateFilters({ teachers: newTeachers })
  }

  const handleCourseToggle = (courseId: string, checked: boolean) => {
    const newCourses = checked
      ? [...filters.courses, courseId]
      : filters.courses.filter((c) => c !== courseId)
    updateFilters({ courses: newCourses })
  }

  const clearAllFilters = () => {
    updateFilters({
      status: [],
      teachers: [],
      courses: [],
      locations: [],
      subscriptionType: [],
      dateRange: [null, null],
      capacityRange: [1, 100],
      lectureRange: [1, 50]
    })
  }

  const getActiveFilterCount = () => {
    return (
      filters.status.length +
      filters.teachers.length +
      filters.courses.length +
      filters.locations.length +
      filters.subscriptionType.length +
      (filters.dateRange[0] || filters.dateRange[1] ? 1 : 0) +
      (filters.capacityRange[0] !== 1 || filters.capacityRange[1] !== 100
        ? 1
        : 0) +
      (filters.lectureRange[0] !== 1 || filters.lectureRange[1] !== 50 ? 1 : 0)
    )
  }

  const activeFilterCount = getActiveFilterCount()

  return (
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
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Location Filter */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-gray-700">Location:</Label>
        <Select
          value={filters.locations.length === 1 ? filters.locations[0] : 'all'}
          onValueChange={handleLocationChange}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem
                key={location.id}
                value={location.id}
              >
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subscription Type Filter */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-gray-700">
          Subscription:
        </Label>
        <Select
          value={
            filters.subscriptionType.length === 1
              ? filters.subscriptionType[0]
              : 'all'
          }
          onValueChange={handleSubscriptionTypeChange}
        >
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="level">Level</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Teachers Filter - Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-9"
          >
            Teachers
            {filters.teachers.length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {filters.teachers.length}
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
              <Label className="text-sm font-medium">Select Teachers</Label>
              {filters.teachers.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateFilters({ teachers: [] })}
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`teacher-${teacher.id}`}
                    checked={filters.teachers.includes(teacher.id)}
                    onCheckedChange={(checked) =>
                      handleTeacherToggle(teacher.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`teacher-${teacher.id}`}
                    className="text-sm"
                  >
                    {teacher.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Courses Filter - Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-9"
          >
            Courses
            {filters.courses.length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {filters.courses.length}
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
              <Label className="text-sm font-medium">Select Courses</Label>
              {filters.courses.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateFilters({ courses: [] })}
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`course-${course.id}`}
                    checked={filters.courses.includes(course.id)}
                    onCheckedChange={(checked) =>
                      handleCourseToggle(course.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`course-${course.id}`}
                    className="text-sm"
                  >
                    {course.name} ({course.level})
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
        {getFilteredGroups().length} groups
      </div>
    </div>
  )
}


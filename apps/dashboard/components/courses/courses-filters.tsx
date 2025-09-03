'use client'

import React from 'react'
import { X, ChevronDown, Search, Filter } from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Input } from '@workspace/ui/components/ui/input'
import { Badge } from '@workspace/ui/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@workspace/ui/components/ui/dropdown-menu'
import { Slider } from '@workspace/ui/components/ui/slider'
import { Label } from '@workspace/ui/components/ui/label'
import { useCoursesStore } from '@/stores/courses-store'
import {
  createFilterHandlers,
  calculateActiveFiltersCount,
  getCategoryDisplayName,
  isAgeRangeFilterActive,
  resetAgeRange
} from './utils/filters'
import {
  COURSE_LEVELS,
  COURSE_STATUSES,
  MOCK_GROUPS,
  AGE_RANGE_CONFIG,
  FILTER_UI_CONFIG
} from '@/statics/courses/filters'
import { Card } from '@workspace/ui/components/ui/card'

export function CoursesFilters() {
  const { filters, updateFilters, categories, getFilteredCourses } =
    useCoursesStore()

  const filteredCourses = getFilteredCourses()
  const activeFiltersCount = calculateActiveFiltersCount(filters)

  // Create filter handlers using the utility function
  const {
    handleCategoryChange,
    handleLevelChange,
    handleStatusChange,
    handleAgeRangeChange,
    handleGroupChange,
    clearAllFilters
  } = createFilterHandlers({ filters, updateFilters })

  // Search handler
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchQuery: event.target.value })
  }

  return (
    <Card className="space-y-6 p-6">
      {/* Filter Header with Search and Clear All */}
      <div className="space-y-4">
        {/* Header with title and clear button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Clear All ({activeFiltersCount})
            </Button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses by name or code..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Main Filters */}
      <div className="space-y-4">
        {/* Top Row: Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Categories Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-9"
              >
                Categories
                {filters.categories.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800"
                  >
                    {filters.categories.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id}
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.id, checked)
                  }
                  className="flex items-center space-x-2"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Levels Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-9"
              >
                Levels
                {filters.levels.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800"
                  >
                    {filters.levels.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>Select Levels</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {COURSE_LEVELS.map((level) => (
                <DropdownMenuCheckboxItem
                  key={level}
                  checked={filters.levels.includes(level)}
                  onCheckedChange={(checked) =>
                    handleLevelChange(level, checked)
                  }
                >
                  {level}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-9"
              >
                Status
                {filters.status.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800"
                  >
                    {filters.status.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>Select Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {COURSE_STATUSES.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={filters.status.includes(status)}
                  onCheckedChange={(checked) =>
                    handleStatusChange(status, checked)
                  }
                >
                  <span className="capitalize">{status}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Related Groups Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-9"
              >
                Groups
                {filters.relatedGroups.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800"
                  >
                    {filters.relatedGroups.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Groups</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Mock group data - in real implementation, fetch from groups store */}
              {MOCK_GROUPS.map((group) => (
                <DropdownMenuCheckboxItem
                  key={group.id}
                  checked={filters.relatedGroups.includes(group.id)}
                  onCheckedChange={(checked) =>
                    handleGroupChange(group.id, checked)
                  }
                >
                  {group.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bottom Row: Age Range and Results */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Age Range Filter */}
          <div className="flex flex-col space-y-2 min-w-[240px] max-w-sm">
            <Label className="text-sm font-medium">
              Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years
            </Label>
            <Slider
              value={filters.ageRange}
              onValueChange={handleAgeRangeChange}
              max={AGE_RANGE_CONFIG.MAX_AGE}
              min={AGE_RANGE_CONFIG.MIN_AGE}
              step={AGE_RANGE_CONFIG.STEP}
              className="w-full"
            />
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 sm:ml-auto">
            {filteredCourses.length} course
            {filteredCourses.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">
              Active filters:
            </span>
            {filters.categories.map((categoryId) => (
              <Badge
                key={categoryId}
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                {getCategoryDisplayName(categoryId, categories)}
                <button
                  onClick={() => handleCategoryChange(categoryId, false)}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${getCategoryDisplayName(categoryId, categories)} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {filters.levels.map((level) => (
              <Badge
                key={level}
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                {level}
                <button
                  onClick={() => handleLevelChange(level, false)}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${level} level filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {filters.status.map((status) => (
              <Badge
                key={status}
                variant="secondary"
                className="text-xs capitalize flex items-center gap-1"
              >
                {status}
                <button
                  onClick={() => handleStatusChange(status, false)}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${status} status filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {filters.relatedGroups.map((groupId) => (
              <Badge
                key={groupId}
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                Group: {groupId}
                <button
                  onClick={() => handleGroupChange(groupId, false)}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove group ${groupId} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {isAgeRangeFilterActive(filters) && (
              <Badge
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                Age: {filters.ageRange[0]}-{filters.ageRange[1]}
                <button
                  onClick={() =>
                    updateFilters({ ageRange: [...resetAgeRange()] })
                  }
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  aria-label="Remove age range filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}


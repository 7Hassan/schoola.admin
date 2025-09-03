import type {
  CourseLevel,
  CourseStatus,
  CourseFilters
} from '@/stores/courses-store'
import { AGE_RANGE_CONFIG } from '@/statics/courses/filters'

/**
 * Handler functions for course filter operations
 * These functions manage the state updates for different filter types
 */

/**
 * Configuration interface for filter handler dependencies
 */
export interface FilterHandlerDependencies {
  readonly filters: CourseFilters
  readonly updateFilters: (filters: Partial<CourseFilters>) => void
}

/**
 * Interface defining all available filter handler functions
 */
export interface FilterHandlers {
  readonly handleCategoryChange: (categoryId: string, checked: boolean) => void
  readonly handleLevelChange: (level: CourseLevel, checked: boolean) => void
  readonly handleStatusChange: (status: CourseStatus, checked: boolean) => void
  readonly handleAgeRangeChange: (value: readonly number[]) => void
  readonly handleGroupChange: (groupId: string, checked: boolean) => void
  readonly clearAllFilters: () => void
}

/**
 * Creates filter handler functions with the provided dependencies
 *
 * @param dependencies - Object containing current filters state and update function
 * @returns Object containing all filter handler functions
 *
 * @example
 * ```ts
 * const handlers = createFilterHandlers({
 *   filters: currentFilters,
 *   updateFilters: setFilters
 * })
 *
 * // Use handlers in component
 * handlers.handleCategoryChange('programming', true)
 * ```
 */
export function createFilterHandlers({
  filters,
  updateFilters
}: FilterHandlerDependencies): FilterHandlers {
  /**
   * Handles category filter changes
   * Adds or removes a category from the active filters
   */
  const handleCategoryChange = (categoryId: string, checked: boolean): void => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId)
    updateFilters({ categories: newCategories })
  }

  /**
   * Handles course level filter changes
   * Adds or removes a difficulty level from the active filters
   */
  const handleLevelChange = (level: CourseLevel, checked: boolean): void => {
    const newLevels = checked
      ? [...filters.levels, level]
      : filters.levels.filter((l) => l !== level)
    updateFilters({ levels: newLevels })
  }

  /**
   * Handles course status filter changes
   * Adds or removes a status from the active filters
   */
  const handleStatusChange = (status: CourseStatus, checked: boolean): void => {
    const newStatuses = checked
      ? [...filters.status, status]
      : filters.status.filter((s) => s !== status)
    updateFilters({ status: newStatuses })
  }

  /**
   * Handles age range filter changes
   * Updates the age range with proper fallback values
   */
  const handleAgeRangeChange = (value: readonly number[]): void => {
    updateFilters({
      ageRange: [
        value[0] ?? AGE_RANGE_CONFIG.MIN_AGE,
        value[1] ?? AGE_RANGE_CONFIG.MAX_AGE
      ]
    })
  }

  /**
   * Handles related groups filter changes
   * Adds or removes a group from the active filters
   */
  const handleGroupChange = (groupId: string, checked: boolean): void => {
    const newGroups = checked
      ? [...filters.relatedGroups, groupId]
      : filters.relatedGroups.filter((id) => id !== groupId)
    updateFilters({ relatedGroups: newGroups })
  }

  /**
   * Resets all filters to their default state
   */
  const clearAllFilters = (): void => {
    updateFilters({
      searchQuery: '',
      categories: [],
      levels: [],
      status: [],
      relatedGroups: [],
      dateRange: [null, null],
      ageRange: AGE_RANGE_CONFIG.DEFAULT_RANGE as [number, number]
    })
  }

  return {
    handleCategoryChange,
    handleLevelChange,
    handleStatusChange,
    handleAgeRangeChange,
    handleGroupChange,
    clearAllFilters
  } as const
}


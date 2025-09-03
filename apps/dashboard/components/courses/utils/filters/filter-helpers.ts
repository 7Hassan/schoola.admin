import type { CourseFilters } from '@/stores/courses-store'
import { AGE_RANGE_CONFIG } from '@/statics/courses/filters'

/**
 * Utility functions for filter calculations and helpers
 * These pure functions handle filter-related computations without side effects
 */

/**
 * Calculates the number of active filters based on current filter state
 *
 * @param filters - Current filter state from the store
 * @returns Number of active filters (non-default values)
 *
 * @example
 * ```ts
 * const activeCount = calculateActiveFiltersCount({
 *   searchQuery: 'python',
 *   categories: ['1', '2'],
 *   levels: ['Beginner'],
 *   status: [],
 *   relatedGroups: [],
 *   dateRange: [null, null],
 *   ageRange: [5, 18]
 * })
 * console.log(activeCount) // 3 (search + categories + levels)
 * ```
 */
export function calculateActiveFiltersCount(filters: CourseFilters): number {
  const activeFilters = [
    filters.searchQuery.trim().length > 0,
    filters.categories.length > 0,
    filters.levels.length > 0,
    filters.status.length > 0,
    filters.relatedGroups.length > 0,
    filters.dateRange[0] !== null || filters.dateRange[1] !== null,
    isAgeRangeFilterActive(filters)
  ].filter(Boolean)

  return activeFilters.length
}

/**
 * Checks if the age range filter is active (different from default values)
 *
 * @param filters - Current filter state from the store
 * @returns True if age range has been modified from defaults
 *
 * @example
 * ```ts
 * const isActive = isAgeRangeFilterActive({ ageRange: [8, 16] })
 * console.log(isActive) // true (different from default [5, 18])
 * ```
 */
export function isAgeRangeFilterActive(filters: CourseFilters): boolean {
  return (
    filters.ageRange[0] > AGE_RANGE_CONFIG.MIN_AGE ||
    filters.ageRange[1] < AGE_RANGE_CONFIG.MAX_AGE
  )
}

/**
 * Gets the display name for a category by ID
 *
 * @param categoryId - The category ID to look up
 * @param categories - Array of available categories
 * @returns Display name for the category, or the ID if not found
 *
 * @example
 * ```ts
 * const name = getCategoryDisplayName('1', [
 *   { id: '1', name: 'Programming' },
 *   { id: '2', name: 'Math' }
 * ])
 * console.log(name) // 'Programming'
 * ```
 */
export function getCategoryDisplayName(
  categoryId: string,
  categories: ReadonlyArray<{ readonly id: string; readonly name: string }>
): string {
  return categories.find((cat) => cat.id === categoryId)?.name ?? categoryId
}

/**
 * Resets age range to default values
 *
 * @returns Default age range tuple [min, max]
 *
 * @example
 * ```ts
 * const defaultRange = resetAgeRange()
 * console.log(defaultRange) // [5, 18]
 * ```
 */
export function resetAgeRange(): readonly [number, number] {
  return AGE_RANGE_CONFIG.DEFAULT_RANGE
}

/**
 * Validates if an age range is within acceptable bounds
 *
 * @param ageRange - Age range tuple to validate
 * @returns True if the age range is valid
 *
 * @example
 * ```ts
 * const isValid = isValidAgeRange([8, 16])
 * console.log(isValid) // true
 *
 * const isInvalid = isValidAgeRange([20, 15]) // min > max
 * console.log(isInvalid) // false
 * ```
 */
export function isValidAgeRange(ageRange: readonly [number, number]): boolean {
  const [min, max] = ageRange
  return (
    min >= AGE_RANGE_CONFIG.MIN_AGE &&
    max <= AGE_RANGE_CONFIG.MAX_AGE &&
    min <= max
  )
}

/**
 * Clamps an age range to valid bounds
 *
 * @param ageRange - Age range that might be out of bounds
 * @returns Clamped age range within valid bounds
 *
 * @example
 * ```ts
 * const clamped = clampAgeRange([3, 25])
 * console.log(clamped) // [5, 18] - clamped to valid range
 * ```
 */
export function clampAgeRange(
  ageRange: readonly [number, number]
): readonly [number, number] {
  const [min, max] = ageRange

  const clampedMin = Math.max(
    AGE_RANGE_CONFIG.MIN_AGE,
    Math.min(min, AGE_RANGE_CONFIG.MAX_AGE)
  )
  const clampedMax = Math.min(
    AGE_RANGE_CONFIG.MAX_AGE,
    Math.max(max, AGE_RANGE_CONFIG.MIN_AGE)
  )

  // Ensure min <= max
  if (clampedMin > clampedMax) {
    return [clampedMax, clampedMax] as const
  }

  return [clampedMin, clampedMax] as const
}


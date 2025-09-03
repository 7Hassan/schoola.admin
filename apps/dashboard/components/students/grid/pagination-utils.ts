"use client"

/**
 * Compute visible pagination pages with ellipses.
 * Returns an array containing page numbers and '...' where appropriate.
 */
export function computeVisiblePages(currentPage: number, totalPages: number, delta = 2): (number | string)[] {
  const range: number[] = []
  const rangeWithDots: (number | string)[] = []

  if (totalPages <= 1) return [1]

  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    range.push(i)
  }

  if (currentPage - delta > 2) rangeWithDots.push(1, '...')
  else rangeWithDots.push(1)

  rangeWithDots.push(...range)

  if (currentPage + delta < totalPages - 1) rangeWithDots.push('...', totalPages)
  else if (totalPages > 1) rangeWithDots.push(totalPages)

  return rangeWithDots
}

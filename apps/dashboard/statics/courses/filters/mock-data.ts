/**
 * Mock data for course filters
 * This file contains temporary mock data that should be replaced with real data from stores
 *
 * @TODO Replace with actual data from stores when implementing real integrations
 */

/**
 * Mock group data for course filtering
 * In production, this should come from the groups store
 *
 * @TODO Integrate with actual groups store: `import { useGroupsStore } from '@/stores/groups-store'`
 */
export const MOCK_GROUPS = [
  {
    id: 'group-1',
    name: 'Math Group A',
    description: 'Elementary mathematics group',
    level: 'beginner' as const
  },
  {
    id: 'group-2',
    name: 'Science Group B',
    description: 'General science exploration group',
    level: 'intermediate' as const
  },
  {
    id: 'group-3',
    name: 'Programming Group C',
    description: 'Introduction to programming concepts',
    level: 'intermediate' as const
  },
  {
    id: 'group-4',
    name: 'Advanced Math',
    description: 'Advanced mathematical concepts and applications',
    level: 'advanced' as const
  },
  {
    id: 'group-5',
    name: 'Data Science Group',
    description: 'Data analysis and visualization fundamentals',
    level: 'advanced' as const
  }
] as const

/**
 * Type definitions for mock data
 */
export type MockGroupLevel = 'beginner' | 'intermediate' | 'advanced'

export interface MockGroup {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly level: MockGroupLevel
}

export type MockGroupsArray = typeof MOCK_GROUPS

/**
 * Helper functions for mock data
 */
export const getMockGroupById = (id: string): MockGroup | undefined => {
  return MOCK_GROUPS.find((group) => group.id === id)
}

export const getMockGroupsByLevel = (
  level: MockGroupLevel
): readonly MockGroup[] => {
  return MOCK_GROUPS.filter((group) => group.level === level)
}

export const getMockGroupNames = (): readonly string[] => {
  return MOCK_GROUPS.map((group) => group.name)
}

export const getMockGroupIds = (): readonly string[] => {
  return MOCK_GROUPS.map((group) => group.id)
}


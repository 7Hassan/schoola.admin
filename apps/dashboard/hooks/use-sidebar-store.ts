/**
 * Sidebar Navigation State Management
 * Handles expansion state, persistence, and navigation history
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SidebarState, UserRole } from '../types/sidebar-navigation'
import {
  navigationConfig,
  getMainSectionFromPath,
  getSubSectionFromPath
} from '../config/navigation'

interface SidebarStore extends SidebarState {
  userRole: UserRole

  // Actions
  toggleExpansion: (itemId: string) => void
  setExpanded: (itemId: string, expanded: boolean) => void
  setCollapsedMode: (collapsed: boolean) => void
  setActiveNavigation: (path: string) => void
  addToHistory: (path: string) => void
  setUserRole: (role: UserRole) => void
  initializeFromPath: (path: string) => void

  // Getters
  isItemExpanded: (itemId: string) => boolean
  getExpandedItems: () => string[]
  canAccessItem: (itemId: string) => boolean
  getNavigationHistory: () => string[]
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set, get) => ({
      // Initial state
      expandedItems: [],
      collapsedMode: false,
      activeMainItem: 'dashboard',
      activeSubItem: '',
      navigationHistory: [],
      userRole: 'admin', // Default role - should be set from auth context

      // Actions
      toggleExpansion: (itemId: string) => {
        const currentExpanded = get().expandedItems
        const isExpanded = currentExpanded.includes(itemId)

        set({
          expandedItems: isExpanded
            ? currentExpanded.filter((id) => id !== itemId)
            : [...currentExpanded, itemId]
        })
      },

      setExpanded: (itemId: string, expanded: boolean) => {
        const currentExpanded = get().expandedItems
        const isCurrentlyExpanded = currentExpanded.includes(itemId)

        if (expanded && !isCurrentlyExpanded) {
          set({ expandedItems: [...currentExpanded, itemId] })
        } else if (!expanded && isCurrentlyExpanded) {
          set({ expandedItems: currentExpanded.filter((id) => id !== itemId) })
        }
      },

      setCollapsedMode: (collapsed: boolean) => {
        set({ collapsedMode: collapsed })
      },

      setActiveNavigation: (path: string) => {
        const mainSection = getMainSectionFromPath(path)
        const subSection = getSubSectionFromPath(path)

        set({
          activeMainItem: mainSection,
          activeSubItem: subSection || ''
        })
      },

      addToHistory: (path: string) => {
        const currentHistory = get().navigationHistory
        const newHistory = [
          path,
          ...currentHistory.filter((p) => p !== path)
        ].slice(0, 10) // Keep last 10

        set({ navigationHistory: newHistory })
      },

      setUserRole: (role: UserRole) => {
        set({ userRole: role })
      },

      initializeFromPath: (path: string) => {
        const mainSection = getMainSectionFromPath(path)
        const subSection = getSubSectionFromPath(path)

        // Find the navigation item
        const navItem = navigationConfig.find((item) => item.id === mainSection)

        // If the item has sub-items and we're accessing a sub-path, expand it
        if (navItem?.subItems && subSection) {
          const currentExpanded = get().expandedItems
          if (!currentExpanded.includes(mainSection)) {
            set({ expandedItems: [...currentExpanded, mainSection] })
          }
        }

        set({
          activeMainItem: mainSection,
          activeSubItem: subSection || ''
        })

        get().addToHistory(path)
      },

      // Getters
      isItemExpanded: (itemId: string) => {
        return get().expandedItems.includes(itemId)
      },

      getExpandedItems: () => {
        return get().expandedItems
      },

      canAccessItem: (itemId: string) => {
        const { userRole } = get()
        // Implement role-based access control here
        // For now, admin can access everything
        if (userRole === 'admin') return true

        // Add specific role restrictions as needed
        const restrictedItems: Record<UserRole, string[]> = {
          admin: [],
          viewer: ['settings'],
          editor: []
        }

        return !restrictedItems[userRole]?.includes(itemId)
      },

      getNavigationHistory: () => {
        return get().navigationHistory
      }
    }),
    {
      name: 'sidebar-navigation-state',
      partialize: (state) => ({
        expandedItems: state.expandedItems,
        collapsedMode: state.collapsedMode,
        userRole: state.userRole,
        navigationHistory: state.navigationHistory.slice(0, 5) // Only persist recent 5
      })
    }
  )
)


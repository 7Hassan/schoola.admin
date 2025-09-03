/**
 * Sidebar Navigation Types and Interfaces
 * Defines the structure for hierarchical navigation with main tabs and sub-tabs
 */

import { LucideIcon } from 'lucide-react'

export interface SubNavigationItem {
  id: string
  name: string
  href: string
  icon?: LucideIcon
  badge?: string | number
  description?: string
}

export interface NavigationItem {
  id: string
  name: string
  icon: LucideIcon
  href: string
  subItems?: SubNavigationItem[]
  defaultSubItem?: string // Default sub-tab to open
  isExpanded?: boolean
  requiresPermission?: string[]
  requiredRole?: UserRole | UserRole[]
}

export interface SidebarState {
  expandedItems: string[]
  collapsedMode: boolean
  activeMainItem: string
  activeSubItem: string
  navigationHistory: string[]
}

export interface PermissionConfig {
  [key: string]: {
    requiredRole: UserRole[]
    subItems: {
      [subKey: string]: UserRole[]
    }
  }
}

export type UserRole = 'admin' | 'editor' | 'viewer'

export interface SidebarMainItemProps {
  item: NavigationItem
  isActive: boolean
  isExpanded: boolean
  onToggle: (itemId: string) => void
  currentPath: string
  LinkComponent: React.ComponentType<any>
}

export interface SidebarSubItemsProps {
  subItems: SubNavigationItem[]
  parentHref: string
  currentPath: string
  isExpanded: boolean
  LinkComponent: React.ComponentType<any>
}

export interface SidebarProps {
  className?: string
  currentPath?: string
  LinkComponent?: React.ComponentType<any>
  userRole?: UserRole
}


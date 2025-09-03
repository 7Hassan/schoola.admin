/**
 * Sidebar Component Exports
 * Central export point for all sidebar-related components
 */

export { Sidebar } from './sidebar'
export { SidebarMainItem } from './sidebar-main-item'
export { SidebarSubItems } from './sidebar-sub-items'

// Re-export types for convenience
export type {
  NavigationItem,
  SubNavigationItem,
  SidebarState,
  SidebarMainItemProps,
  SidebarSubItemsProps,
  SidebarProps,
  UserRole,
  PermissionConfig
} from '../../types/sidebar-navigation'

// Re-export hooks and config
export { useSidebarStore } from '../../hooks/use-sidebar-store'
export { navigationConfig } from '../../config/navigation'


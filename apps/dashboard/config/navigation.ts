/**
 * Navigation Configuration
 * Defines the hierarchical navigation structure for the Schoola dashboard
 */

import {
  Home,
  FileText,
  GraduationCap,
  Users,
  Group,
  MapPinned,
  BookOpen,
  BarChart3,
  Settings,
  Plus,
  List,
  MessageSquare,
  Layout,
  UserPlus,
  TrendingUp,
  Calendar,
  ClipboardList,
  Building,
  Cog,
  UserCog,
  ChartBar
} from 'lucide-react'

import { NavigationItem } from '../types/sidebar-navigation'

export const navigationConfig: NavigationItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    subItems: [
      {
        id: 'home',
        name: 'Home',
        href: '/dashboard/home',
        icon: Home,
        description: 'Dashboard home'
      },
      {
        id: 'recent-activity',
        name: 'Recent Activity',
        href: '/dashboard/activity',
        icon: TrendingUp,
        description: 'Recent system activity'
      },
      {
        id: 'analytics',
        name: 'Analytics',
        href: '/dashboard/analytics',
        icon: ChartBar,
        description: 'Dashboard analytics overview'
      }
    ],
    defaultSubItem: 'home'
  },
  {
    id: 'forms',
    name: 'Forms',
    icon: FileText,
    href: '/forms',
    subItems: [
      {
        id: 'management',
        name: 'Management',
        href: '/forms/management',
        icon: List,
        description: 'List all forms with management tools'
      },
      {
        id: 'create',
        name: 'Create',
        href: '/forms/create',
        icon: Plus,
        description: 'Form builder interface'
      },
      {
        id: 'responses',
        name: 'Responses',
        href: '/forms/responses',
        icon: MessageSquare,
        description: 'View and analyze form submissions'
      },
      {
        id: 'templates',
        name: 'Templates',
        href: '/forms/templates',
        icon: Layout,
        description: 'Pre-built form templates'
      }
    ],
    defaultSubItem: 'management'
  },
  {
    id: 'students',
    name: 'Students',
    icon: GraduationCap,
    href: '/students',
    subItems: [
      {
        id: 'management',
        name: 'Management',
        href: '/students/management',
        icon: List,
        description: 'Student list and edit profiles.'
      },
      {
        id: 'enrollment',
        name: 'Enrollment',
        href: '/students/enrollment',
        icon: UserPlus,
        description: 'Registration and admission'
      },
      {
        id: 'progress',
        name: 'Progress',
        href: '/students/progress',
        icon: TrendingUp,
        description: 'Academic progress tracking'
      },
      {
        id: 'attendance',
        name: 'Attendance',
        href: '/students/attendance',
        icon: Calendar,
        description: 'Attendance management'
      }
    ],
    defaultSubItem: 'management'
  },
  {
    id: 'teachers',
    name: 'Teachers',
    icon: Users,
    href: '/teachers',
    subItems: [
      {
        id: 'management',
        name: 'Management',
        href: '/teachers/management',
        icon: List,
        description: 'Teacher profiles and information'
      },
      {
        id: 'create',
        name: 'Create',
        href: '/teachers/create',
        icon: Plus,
        description: 'Add new teacher profiles'
      },
      {
        id: 'assignments',
        name: 'Assignments',
        href: '/teachers/assignments',
        icon: ClipboardList,
        description: 'Assignment management'
      }
    ],
    defaultSubItem: 'management'
  },
    {
    id: 'subscriptions',
    name: 'Subscriptions',
    icon: ClipboardList,
    href: '/subscriptions',
    subItems: [
          {
        id: 'management',
        name: 'Management',
        href: '/subscriptions/management',
        icon: ClipboardList,
        description: 'Active subscriptions and management'
      },
      {
        id: 'plans',
        name: 'Plans',
        href: '/subscriptions/plans',
        icon: List,
        description: 'Manage available subscription plans'
      },
      {
        id: 'reports',
        name: 'Reports',
        href: '/subscriptions/reports',
        icon: BarChart3,
        description: 'Subscription revenue and status reports'
      }
    ],
  defaultSubItem: 'management'
  },
  {
    id: 'groups',
    name: 'Groups',
    icon: Group,
    href: '/groups',
    subItems: [
      {
        id: 'management',
        name: 'Management',
        href: '/groups/management',
        icon: List,
        description: 'Show groups with edit capabilities'
      },
      {
        id: 'create',
        name: 'Create',
        href: '/groups/create',
        icon: Plus,
        description: 'Page for creating a new group'
      }
    ],
    defaultSubItem: 'management'
  },

  {
    id: 'locations',
    name: 'Locations',
    icon: MapPinned,
    href: '/locations',
    subItems: [
      {
        id: 'management',
        name: 'Management',
        href: '/locations/management',
        icon: List,
        description: 'Show current locations with edit capabilities'
      },
      {
        id: 'create',
        name: 'Create',
        href: '/locations/create',
        icon: Plus,
        description: 'Create new location page'
      }
    ],
    defaultSubItem: 'management'
  },
  {
    id: 'courses',
    name: 'Courses',
    icon: BookOpen,
    href: '/courses',
    subItems: [
      {
        id: 'management',
        name: 'Management',
        href: '/courses/management',
        icon: List,
        description: 'Show already created courses with edit capabilities'
      },
      {
        id: 'create',
        name: 'Create',
        href: '/courses/create',
        icon: Plus,
        description: 'Create new course page'
      }
    ],
    defaultSubItem: 'management'
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    href: '/settings',
    subItems: [
      {
        id: 'profile',
        name: 'Profile',
        href: '/settings/profile',
        icon: Cog,
        description: 'Basic application settings'
      },
      {
        id: 'preferences',
        name: 'Preferences',
        href: '/settings/preferences',
        icon: UserCog,
        description: 'User management'
      }
    ],
    defaultSubItem: 'profile'
  }
]

// Helper function to get navigation item by ID
export const getNavigationItem = (id: string): NavigationItem | undefined => {
  return navigationConfig.find((item) => item.id === id)
}

// Helper function to get sub-navigation item
export const getSubNavigationItem = (parentId: string, subId: string) => {
  const parentItem = getNavigationItem(parentId)
  return parentItem?.subItems?.find((subItem) => subItem.id === subId)
}

// Helper function to determine if a path is active
export const isPathActive = (
  currentPath: string,
  itemHref: string
): boolean => {
  if (itemHref === '/dashboard' && currentPath === '/') return true
  return currentPath.startsWith(itemHref)
}

// Helper function to get the main section from path
export const getMainSectionFromPath = (path: string): string => {
  const segments = path.split('/').filter(Boolean)
  return segments[0] || 'dashboard'
}

// Helper function to get the sub-section from path
export const getSubSectionFromPath = (path: string): string | undefined => {
  const segments = path.split('/').filter(Boolean)
  return segments[1]
}


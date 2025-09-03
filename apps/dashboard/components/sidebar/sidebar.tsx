'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@workspace/ui/lib/utils'
import { useSidebarStore } from '../../hooks/use-sidebar-store'
import { SidebarMainItem } from './sidebar-main-item'
import { navigationConfig } from '../../config/navigation'
import type { NavigationItem, UserRole } from '../../types/sidebar-navigation'

interface SidebarProps {
  className?: string
  userRole?: UserRole
}

export function Sidebar({ className, userRole = 'viewer' }: SidebarProps) {
  const pathname = usePathname()
  const { expandedItems, toggleExpansion } = useSidebarStore()

  // Filter navigation items based on user role
  const filteredNavigation = navigationConfig.filter((item: NavigationItem) => {
    if (!item.requiredRole) return true
    if (Array.isArray(item.requiredRole)) {
      return item.requiredRole.includes(userRole)
    }
    return item.requiredRole === userRole
  })

  return (
    <aside
      className={cn(
        'flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border',
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2"
        >
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sm font-bold text-sidebar-primary-foreground">
              S
            </span>
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            Schoola
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {filteredNavigation.map((item: NavigationItem) => {
          const isMainItemActive = pathname === item.href
          const isAnySubItemActive = Boolean(
            item.subItems?.some((subItem) => pathname === subItem.href)
          )

          return (
            <SidebarMainItem
              key={item.id}
              item={item}
              isActive={isMainItemActive || isAnySubItemActive}
              currentPath={pathname}
              isExpanded={expandedItems.includes(item.id)}
              onToggle={toggleExpansion}
              LinkComponent={Link}
            />
          )
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-accent-foreground">
              {userRole.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              Dashboard Access
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}


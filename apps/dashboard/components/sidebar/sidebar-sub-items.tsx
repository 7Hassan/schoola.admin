'use client'

import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { SidebarSubItemsProps } from '../../types/sidebar-navigation'

export function SidebarSubItems({
  subItems,
  parentHref,
  currentPath,
  isExpanded,
  LinkComponent
}: SidebarSubItemsProps) {
  if (!isExpanded || !subItems?.length) {
    return null
  }

  return (
    <div className="ml-6 border-l border-sidebar-border/50 pl-3 space-y-1">
      {subItems.map((subItem) => {
        const isActive = currentPath === subItem.href

        return (
          <SidebarSubItem
            key={subItem.id}
            subItem={subItem}
            isActive={isActive}
            LinkComponent={LinkComponent}
          />
        )
      })}
    </div>
  )
}

interface SidebarSubItemProps {
  subItem: SidebarSubItemsProps['subItems'][0]
  isActive: boolean
  LinkComponent: React.ComponentType<any>
}

function SidebarSubItem({
  subItem,
  isActive,
  LinkComponent
}: SidebarSubItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const Icon = subItem.icon

  return (
    <LinkComponent
      href={subItem.href}
      className={cn(
        'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
        'hover:bg-sidebar-accent/50 hover:text-sidebar-primary',
        isActive
          ? 'bg-sidebar-accent/30 text-sidebar-primary border-l-2 border-sidebar-primary ml-[-1px] pl-2'
          : 'text-sidebar-foreground/80'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={subItem.description}
    >
      {Icon && (
        <Icon
          className={cn(
            'mr-2 h-4 w-4 transition-colors duration-200',
            isActive || isHovered
              ? 'text-sidebar-primary'
              : 'text-muted-foreground'
          )}
        />
      )}
      <span className="flex-1">{subItem.name}</span>

      {/* Badge support */}
      {subItem.badge && (
        <span
          className={cn(
            'ml-2 px-2 py-0.5 text-xs rounded-full transition-colors duration-200',
            isActive
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {subItem.badge}
        </span>
      )}
    </LinkComponent>
  )
}


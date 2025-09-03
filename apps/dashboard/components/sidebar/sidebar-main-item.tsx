'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import { SidebarMainItemProps } from '../../types/sidebar-navigation'
import { SidebarSubItems } from './sidebar-sub-items'

export function SidebarMainItem({
  item,
  isActive,
  isExpanded,
  onToggle,
  currentPath,
  LinkComponent
}: SidebarMainItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const Icon = item.icon
  const hasSubItems = item.subItems && item.subItems.length > 0

  const handleClick = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault()
      onToggle(item.id)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (hasSubItems && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onToggle(item.id)
    }
  }

  // If no sub-items, render as regular link
  if (!hasSubItems) {
    return (
      <LinkComponent
        href={item.href}
        className={cn(
          'group flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
          'hover:bg-sidebar-accent hover:text-sidebar-primary',
          isActive
            ? 'bg-sidebar-accent text-sidebar-primary border-r-2 border-sidebar-primary'
            : 'text-sidebar-foreground'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Icon
          className={cn(
            'mr-3 h-5 w-5 transition-colors duration-200',
            isActive || isHovered
              ? 'text-sidebar-primary'
              : 'text-muted-foreground'
          )}
        />
        {item.name}
      </LinkComponent>
    )
  }

  // Render expandable main item with sub-items
  return (
    <div className="space-y-1">
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'group flex items-center justify-between w-full px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
          'hover:bg-sidebar-accent hover:text-sidebar-primary focus:outline-none focus:ring-2 focus:ring-sidebar-primary focus:ring-offset-2',
          isActive
            ? 'bg-sidebar-accent text-sidebar-primary'
            : 'text-sidebar-foreground'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-expanded={isExpanded}
        aria-controls={`${item.id}-subitems`}
      >
        <div className="flex items-center">
          <Icon
            className={cn(
              'mr-3 h-5 w-5 transition-colors duration-200',
              isActive || isHovered
                ? 'text-sidebar-primary'
                : 'text-muted-foreground'
            )}
          />
          {item.name}
        </div>

        <div className="flex items-center">
          {/* Expand/Collapse Icon */}
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
          ) : (
            <ChevronRight className="h-4 w-4 transition-transform duration-200" />
          )}
        </div>
      </button>

      {/* Sub-items container */}
      <div
        id={`${item.id}-subitems`}
        className={cn(
          'overflow-hidden transition-all duration-200 ease-in-out',
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <SidebarSubItems
          subItems={item.subItems || []}
          parentHref={item.href}
          currentPath={currentPath}
          isExpanded={isExpanded}
          LinkComponent={LinkComponent}
        />
      </div>
    </div>
  )
}


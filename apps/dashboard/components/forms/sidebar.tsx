'use client'

import { useState } from 'react'
import { Button } from '@workspace/ui/components/ui/button'
import { ScrollArea } from '@workspace/ui/components/ui/scroll-area'
import {
  FileText,
  MapPinned,
  Group,
  Settings,
  Menu,
  X,
  Home,
  BarChart3,
  Users,
  GraduationCap,
  BookOpen
} from 'lucide-react'

interface NavigationItem {
  name: string
  icon: any
  href: string
}

interface SidebarProps {
  className?: string
  currentPath?: string
  LinkComponent?: any
}

export function Sidebar({
  className,
  currentPath = '',
  LinkComponent
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    { name: 'Forms', icon: FileText, href: '/forms' },
    { name: 'Students', icon: GraduationCap, href: '/students' },
    { name: 'Teachers', icon: Users, href: '/teachers' },
    { name: 'Groups', icon: Group, href: '/groups' },
    { name: 'Locations', icon: MapPinned, href: '/locations' },
    { name: 'Courses', icon: BookOpen, href: '/courses' },
    { name: 'Settings', icon: Settings, href: '/settings' }
  ]
  return (
    <>
      {/* Mobile overlay */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="fixed top-4 left-4 z-50"
        >
          {isCollapsed ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          ${isCollapsed ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 
          bg-sidebar border-r border-sidebar-border lg:flex lg:flex-col
          transition-transform duration-300 ease-in-out
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-sidebar-foreground">
                FormBuilder
              </span>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = currentPath === item.href
                const Component = LinkComponent || 'a'
                return (
                  <Component
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-lg
                      transition-colors duration-200
                      ${
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-primary border-r-2 border-sidebar-primary'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary'
                      }
                    `}
                  >
                    <Icon
                      className={`
                        mr-3 h-5 w-5 transition-colors duration-200
                        ${isActive ? 'text-sidebar-primary' : 'text-muted-foreground group-hover:text-sidebar-primary'}
                      `}
                    />
                    {item.name}
                  </Component>
                )
              })}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">
                  JD
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  John Doe
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  john@example.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay backdrop */}
      {isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsCollapsed(false)}
        />
      )}
    </>
  )
}


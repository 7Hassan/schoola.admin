'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'

interface SidebarWrapperProps {
  className?: string
  userRole?: 'admin' | 'editor' | 'viewer'
}

export function SidebarWrapper({
  className,
  userRole = 'admin'
}: SidebarWrapperProps) {
  const pathname = usePathname()

  return (
    <Sidebar
      className={className}
      userRole={userRole}
    />
  )
}


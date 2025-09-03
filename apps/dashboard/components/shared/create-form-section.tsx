'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Card } from '@workspace/ui/components/ui/card'
import { Badge } from '@workspace/ui/components/ui/badge'

interface CreateFormSectionProps {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  collapsible?: boolean
  required?: boolean
  description?: string
  defaultOpen?: boolean
}

export function CreateFormSection({
  title,
  icon: Icon,
  children,
  collapsible = false,
  required = false,
  description,
  defaultOpen = true
}: CreateFormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const handleToggle = () => {
    if (collapsible) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <Card className="p-6">
      <div
        className={`flex items-center justify-between mb-4 ${
          collapsible ? 'cursor-pointer' : ''
        }`}
        onClick={handleToggle}
      >
        <div className="flex items-center space-x-2">
          {Icon && (
            <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          {required && (
            <Badge
              variant="destructive"
              className="text-xs"
            >
              Required
            </Badge>
          )}
        </div>
        {collapsible && (
          <div className="flex items-center space-x-2">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </div>
        )}
      </div>

      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}

      {(isOpen || !collapsible) && <div className="space-y-4">{children}</div>}
    </Card>
  )
}


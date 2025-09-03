'use client'

import React from 'react'
import { MapPin, Globe, Image, AlertTriangle } from 'lucide-react'
import { Card } from './card.js'
import { Badge } from './badge.js'
import { cn } from '../../lib/utils.js'

interface ImagePlaceholderProps {
  type: 'onsite' | 'online' | 'generic' | 'error'
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showText?: boolean
  message?: string
  variant?: 'default' | 'minimal' | 'detailed'
}

export function ImagePlaceholder({
  type,
  className,
  size = 'md',
  showIcon = true,
  showText = true,
  message,
  variant = 'default'
}: ImagePlaceholderProps) {
  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'onsite':
        return MapPin
      case 'online':
        return Globe
      case 'error':
        return AlertTriangle
      default:
        return Image
    }
  }

  // Get colors based on type
  const getColors = () => {
    switch (type) {
      case 'onsite':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-200'
        }
      case 'online':
        return {
          bg: 'bg-green-50',
          text: 'text-green-600',
          border: 'border-green-200'
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          text: 'text-red-600',
          border: 'border-red-200'
        }
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          border: 'border-gray-200'
        }
    }
  }

  // Get text based on type
  const getText = () => {
    if (message) return message

    switch (type) {
      case 'onsite':
        return 'Onsite Location'
      case 'online':
        return 'Online Session'
      case 'error':
        return 'Failed to load image'
      default:
        return 'No image available'
    }
  }

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'h-16 p-2',
          icon: 'w-4 h-4',
          text: 'text-xs'
        }
      case 'lg':
        return {
          container: 'h-48 p-6',
          icon: 'w-12 h-12',
          text: 'text-base'
        }
      default:
        return {
          container: 'h-32 p-4',
          icon: 'w-8 h-8',
          text: 'text-sm'
        }
    }
  }

  const Icon = getIcon()
  const colors = getColors()
  const text = getText()
  const sizeClasses = getSizeClasses()
  const isMinimal = variant === 'minimal'
  const isDetailed = variant === 'detailed'

  return (
    <Card
      className={cn(
        'flex items-center justify-center transition-colors',
        colors.bg,
        colors.text,
        isMinimal ? 'border-0 shadow-none' : colors.border,
        sizeClasses.container,
        className
      )}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        {showIcon && <Icon className={cn(sizeClasses.icon, 'shrink-0')} />}

        {showText && (
          <div className="space-y-1">
            <p className={cn('font-medium', sizeClasses.text)}>{text}</p>

            {isDetailed && type !== 'error' && (
              <p
                className={cn(
                  'text-muted-foreground',
                  size === 'sm' ? 'text-[10px]' : 'text-xs'
                )}
              >
                {type === 'onsite'
                  ? 'Physical location with address'
                  : 'Virtual meeting or session'}
              </p>
            )}
          </div>
        )}

        {/* Type badge for detailed variant */}
        {isDetailed && type !== 'error' && type !== 'generic' && (
          <Badge
            variant="outline"
            className="text-xs"
          >
            {type === 'onsite' ? 'Physical' : 'Virtual'}
          </Badge>
        )}
      </div>
    </Card>
  )
}


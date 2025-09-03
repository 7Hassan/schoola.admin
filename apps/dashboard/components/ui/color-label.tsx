'use client'

import React from 'react'
import { cn } from '@workspace/ui/lib/utils'

// Predefined color schemes for consistency
export const COLOR_SCHEMES = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    ring: 'ring-blue-400',
    solid: 'bg-blue-500'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    ring: 'ring-green-400',
    solid: 'bg-green-500'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    ring: 'ring-purple-400',
    solid: 'bg-purple-500'
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    ring: 'ring-orange-400',
    solid: 'bg-orange-500'
  },
  pink: {
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    border: 'border-pink-200',
    ring: 'ring-pink-400',
    solid: 'bg-pink-500'
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    ring: 'ring-indigo-400',
    solid: 'bg-indigo-500'
  },
  teal: {
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-200',
    ring: 'ring-teal-400',
    solid: 'bg-teal-500'
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    ring: 'ring-red-400',
    solid: 'bg-red-500'
  }
} as const

export type ColorScheme = keyof typeof COLOR_SCHEMES

interface ColorLabelProps {
  children: React.ReactNode
  color: ColorScheme
  variant?: 'default' | 'solid' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  removable?: boolean
  onRemove?: () => void
}

// Function to generate consistent colors for teachers
export const getTeacherColor = (teacherId: string): ColorScheme => {
  const colors: ColorScheme[] = [
    'blue',
    'green',
    'purple',
    'orange',
    'pink',
    'indigo',
    'teal'
  ]
  const hash = teacherId
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length] as ColorScheme
}

export function ColorLabel({
  children,
  color,
  variant = 'default',
  size = 'md',
  className,
  onClick,
  removable = false,
  onRemove
}: ColorLabelProps) {
  const colorScheme = COLOR_SCHEMES[color]

  const baseClasses = cn(
    'inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200',
    {
      'px-2 py-1 text-xs': size === 'sm',
      'px-3 py-1 text-sm': size === 'md',
      'px-4 py-2 text-base': size === 'lg'
    },
    {
      [cn(colorScheme.bg, colorScheme.text, colorScheme.border, 'border')]:
        variant === 'default',
      [cn(colorScheme.solid, 'text-white')]: variant === 'solid',
      [cn('bg-transparent', colorScheme.text, colorScheme.border, 'border-2')]:
        variant === 'outline'
    },
    {
      'cursor-pointer hover:opacity-80': onClick
    },
    className
  )

  return (
    <span
      className={baseClasses}
      onClick={onClick}
    >
      <span className="truncate">{children}</span>
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={cn(
            'ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors',
            'flex items-center justify-center text-xs'
          )}
        >
          ×
        </button>
      )}
    </span>
  )
}

// Helper component for displaying a small color indicator
export function ColorDot({
  color,
  className
}: {
  color: ColorScheme
  className?: string
}) {
  const colorScheme = COLOR_SCHEMES[color]

  return (
    <div className={cn('w-3 h-3 rounded-full', colorScheme.solid, className)} />
  )
}


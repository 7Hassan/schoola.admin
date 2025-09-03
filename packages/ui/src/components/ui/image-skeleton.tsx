'use client'

import React from 'react'
import { Loader2, Image } from 'lucide-react'
import { Card } from './card.js'
import { Skeleton } from './skeleton.js'
import { cn } from '../../lib/utils.js'

interface ImageSkeletonProps {
  className?: string
  variant?: 'shimmer' | 'pulse' | 'spinner'
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  rounded?: boolean
}

export function ImageSkeleton({
  className,
  variant = 'shimmer',
  aspectRatio = '16:9',
  size = 'md',
  showIcon = true,
  rounded = true
}: ImageSkeletonProps) {
  // Get aspect ratio classes
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case '4:3':
        return 'aspect-[4/3]'
      case '1:1':
        return 'aspect-square'
      case 'auto':
        return ''
      default:
        return 'aspect-video'
    }
  }

  // Get size-specific classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'h-16',
          icon: 'w-4 h-4'
        }
      case 'lg':
        return {
          container: 'h-48',
          icon: 'w-12 h-12'
        }
      default:
        return {
          container: aspectRatio === 'auto' ? 'h-32' : '',
          icon: 'w-8 h-8'
        }
    }
  }

  const sizeClasses = getSizeClasses()

  // Shimmer skeleton (default)
  if (variant === 'shimmer') {
    return (
      <Card
        className={cn(
          'relative overflow-hidden',
          getAspectRatioClasses(),
          sizeClasses.container,
          rounded && 'rounded-lg',
          className
        )}
      >
        <Skeleton className="w-full h-full" />
      </Card>
    )
  }

  // Pulse variant
  if (variant === 'pulse') {
    return (
      <Card
        className={cn(
          'relative overflow-hidden bg-muted',
          getAspectRatioClasses(),
          sizeClasses.container,
          rounded && 'rounded-lg',
          className
        )}
      >
        <div className="w-full h-full animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted" />

        {showIcon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              className={cn(sizeClasses.icon, 'text-muted-foreground/50')}
            />
          </div>
        )}
      </Card>
    )
  }

  // Spinner variant
  return (
    <Card
      className={cn(
        'relative overflow-hidden bg-muted/50',
        getAspectRatioClasses(),
        sizeClasses.container,
        rounded && 'rounded-lg',
        className
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2
          className={cn(sizeClasses.icon, 'animate-spin text-muted-foreground')}
        />
      </div>
    </Card>
  )
}


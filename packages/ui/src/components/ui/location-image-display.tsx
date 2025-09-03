'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, Globe, AlertCircle, Loader2, RotateCcw } from 'lucide-react'
import { Card } from './card.js'
import { Button } from './button.js'
import { Badge } from './badge.js'
import { Alert, AlertDescription } from './alert.js'
import { AspectRatio } from './aspect-ratio.js'
import { Skeleton } from './skeleton.js'
import { cn } from '../../lib/utils.js'

interface LocationImageDisplayProps {
  // Image sources (priority order)
  uploadedImageUrl?: string
  mapSnapshotUrl?: string
  fallbackImageUrl?: string

  // Location context
  locationType: 'onsite' | 'online'
  locationName: string

  // Display configuration
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto'
  objectFit?: 'cover' | 'contain' | 'fill'
  sizes?: string // responsive sizes attribute

  // Styling
  className?: string
  variant?: 'card' | 'hero' | 'thumbnail' | 'gallery'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'

  // Interaction
  onClick?: () => void
  onLoad?: () => void
  onError?: (error: string) => void

  // Loading states
  loading?: 'lazy' | 'eager'
  placeholder?: 'blur' | 'skeleton' | 'none'
  blurDataURL?: string

  // Accessibility
  alt?: string
  title?: string

  // Display options
  showLocationBadge?: boolean
  showErrorRetry?: boolean
}

// Get aspect ratio value for AspectRatio component
const getAspectRatioValue = (ratio: string): number => {
  switch (ratio) {
    case '16:9':
      return 16 / 9
    case '4:3':
      return 4 / 3
    case '1:1':
      return 1
    default:
      return 16 / 9
  }
}

// Component variants using CVA pattern
const imageVariants = {
  card: 'shadow-sm hover:shadow-md transition-shadow',
  thumbnail: 'border border-border',
  hero: 'shadow-lg rounded-xl',
  gallery: 'rounded-sm border-0'
}

const sizeClasses = {
  sm: 'w-16 h-12',
  md: 'w-32 h-24',
  lg: 'w-48 h-36',
  full: 'w-full'
}

export function LocationImageDisplay({
  uploadedImageUrl,
  mapSnapshotUrl,
  fallbackImageUrl,
  locationType,
  locationName,
  aspectRatio = '16:9',
  objectFit = 'cover',
  sizes,
  className,
  variant = 'card',
  rounded = 'md',
  onClick,
  onLoad,
  onError,
  loading = 'lazy',
  placeholder = 'skeleton',
  blurDataURL,
  alt,
  title,
  showLocationBadge = true,
  showErrorRetry = true
}: LocationImageDisplayProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Determine which image to show based on priority
  const getImageUrl = (): string | null => {
    if (uploadedImageUrl) return uploadedImageUrl
    if (locationType === 'onsite' && mapSnapshotUrl) return mapSnapshotUrl
    if (fallbackImageUrl) return fallbackImageUrl
    return null
  }

  // Handle image load success
  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
    onLoad?.()
  }

  // Handle image load error
  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
    const errorMsg = `Failed to load image for ${locationName}`
    onError?.(errorMsg)
  }

  // Retry loading image
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    setHasError(false)
    setIsLoading(true)
  }

  // Update current image URL when props change
  useEffect(() => {
    const imageUrl = getImageUrl()
    setCurrentImageUrl(imageUrl)
    if (imageUrl) {
      setIsLoading(true)
      setHasError(false)
    } else {
      setIsLoading(false)
      setHasError(false)
    }
  }, [uploadedImageUrl, mapSnapshotUrl, fallbackImageUrl, retryCount])

  // Generate alt text
  const getAltText = () => {
    if (alt) return alt
    return `Image of ${locationName}, ${locationType} location`
  }

  // Render placeholder based on location type
  const renderPlaceholder = () => {
    const isOnsite = locationType === 'onsite'

    return (
      <Card
        className={cn(
          'flex items-center justify-center h-full',
          isOnsite ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
        )}
      >
        {isOnsite ? (
          <MapPin className="w-8 h-8" />
        ) : (
          <Globe className="w-8 h-8" />
        )}
        <span className="ml-2 text-sm font-medium">
          {isOnsite ? 'Onsite Location' : 'Online Session'}
        </span>
      </Card>
    )
  }

  // Render error state
  const renderError = () => (
    <Card className="flex flex-col items-center justify-center h-full bg-destructive/5 text-destructive p-4">
      <AlertCircle className="w-8 h-8 mb-2" />
      <p className="text-sm text-center mb-3">Failed to load image</p>
      {showErrorRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRetry}
          className="text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      )}
    </Card>
  )

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="relative h-full">
      <Skeleton className="w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    </div>
  )

  // Render the main image
  const renderImage = () => (
    <div className="relative h-full overflow-hidden">
      <img
        src={currentImageUrl!}
        alt={getAltText()}
        title={title || locationName}
        className={cn(
          'w-full h-full transition-opacity duration-300',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          isLoading && 'opacity-0',
          !isLoading && 'opacity-100'
        )}
        sizes={sizes}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        key={`${currentImageUrl}-${retryCount}`} // Force re-render on retry
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Location type badge */}
      {showLocationBadge && !isLoading && (
        <Badge
          variant="secondary"
          className="absolute top-2 right-2 text-xs"
        >
          {locationType === 'onsite' ? 'Onsite' : 'Online'}
        </Badge>
      )}
    </div>
  )

  // Determine what content to render
  const renderContent = () => {
    if (hasError) return renderError()
    if (!currentImageUrl) return renderPlaceholder()
    if (isLoading && placeholder === 'skeleton') return renderSkeleton()
    return renderImage()
  }

  const cardClasses = cn(
    'relative overflow-hidden transition-all duration-200',
    imageVariants[variant],
    onClick && 'cursor-pointer hover:scale-[1.02]',
    rounded !== 'none' && {
      'rounded-sm': rounded === 'sm',
      rounded: rounded === 'md',
      'rounded-lg': rounded === 'lg',
      'rounded-full': rounded === 'full'
    },
    className
  )

  const content = (
    <Card
      className={cardClasses}
      onClick={onClick}
    >
      {aspectRatio === 'auto' ? (
        <div className="h-full min-h-[200px]">{renderContent()}</div>
      ) : (
        <AspectRatio ratio={getAspectRatioValue(aspectRatio)}>
          {renderContent()}
        </AspectRatio>
      )}
    </Card>
  )

  return content
}


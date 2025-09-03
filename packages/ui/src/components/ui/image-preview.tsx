'use client'

import React, { useState, useEffect } from 'react'
import { X, FileImage, AlertCircle } from 'lucide-react'
import { Card } from '@workspace/ui/components/ui/card'
import { Button } from '@workspace/ui/components/ui/button'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Alert, AlertDescription } from '@workspace/ui/components/ui/alert'
import { cn } from '@workspace/ui/lib/utils'
import { formatFileSize, getFileExtension } from '@workspace/ui/lib/image-utils'
import { FILE_TYPE_EXTENSIONS } from '@workspace/ui/lib/image-constants'

interface ImagePreviewProps {
  file?: File
  previewUrl?: string
  onRemove?: () => void
  error?: string
  className?: string
  showMetadata?: boolean
  variant?: 'default' | 'compact' | 'minimal'
  aspectRatio?: 'auto' | 'square' | 'video' | 'portrait' | 'landscape'
  objectFit?: 'cover' | 'contain' | 'fill'
  maxHeight?: number
}

export function ImagePreview({
  file,
  previewUrl,
  onRemove,
  error,
  className,
  showMetadata = true,
  variant = 'default',
  aspectRatio = 'auto',
  objectFit = 'contain',
  maxHeight = 300
}: ImagePreviewProps) {
  const [imageDimensions, setImageDimensions] = useState<{
    width: number
    height: number
    aspectRatio: number
  } | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Reset image state when preview URL changes
  useEffect(() => {
    if (previewUrl) {
      setImageLoaded(true)
      setImageDimensions(null)
    } else {
      setImageLoaded(false)
      setImageDimensions(null)
    }
  }, [previewUrl])

  if (!file && !previewUrl) {
    return null
  }

  const isCompact = variant === 'compact'
  const isMinimal = variant === 'minimal'

  // Handle image load to get natural dimensions
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget

    if (img.complete && img.naturalWidth !== 0) {
      const naturalAspectRatio = img.naturalWidth / img.naturalHeight

      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: naturalAspectRatio
      })
      setImageLoaded(true)
    }
  }

  // Calculate container dimensions based on aspect ratio and variant
  const getContainerStyle = () => {
    if (isMinimal) return { height: '64px' }
    if (isCompact) return { height: '80px' }

    if (aspectRatio === 'auto') {
      if (imageDimensions) {
        const { aspectRatio: imgAspectRatio } = imageDimensions
        const baseWidth = 320
        let height = baseWidth / imgAspectRatio

        if (height > maxHeight) height = maxHeight
        if (height < 120) height = 120

        return { height: `${height}px` }
      } else {
        return { height: '200px', minHeight: '120px' }
      }
    }

    switch (aspectRatio) {
      case 'square':
        return { aspectRatio: '1/1' }
      case 'video':
        return { aspectRatio: '16/9' }
      case 'landscape':
        return { aspectRatio: '4/3' }
      case 'portrait':
        return { aspectRatio: '3/4' }
      default:
        return { height: '128px' }
    }
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden',
        isCompact && 'p-2',
        isMinimal && 'border-0 shadow-none',
        className
      )}
    >
      {error && (
        <Alert
          variant="destructive"
          className="mb-3"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className={cn(
          'relative group cursor-pointer hover:bg-gray-50 rounded p-1 transition-colors',
          'flex items-center justify-center'
        )}
        style={getContainerStyle()}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={file?.name || 'Preview'}
            className={cn(
              'rounded transition-opacity duration-200 opacity-100',
              isMinimal && 'rounded-sm',
              objectFit === 'contain' && 'max-w-full max-h-full object-contain',
              objectFit === 'cover' && 'w-full h-full object-cover',
              objectFit === 'fill' && 'w-full h-full object-fill'
            )}
            onLoad={handleImageLoad}
            onError={(e) => {
              console.error('Failed to load image:', previewUrl, e)
            }}
            style={{
              display: 'block',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          />
        ) : (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center bg-muted rounded',
              isMinimal && 'rounded-sm'
            )}
          >
            <FileImage className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {/* Remove Button */}
        {onRemove && (
          <Button
            type="button"
            variant="secondary"
            size={isCompact || isMinimal ? 'sm' : 'default'}
            className={cn(
              'absolute top-2 right-2 h-7 w-7 p-0 bg-white/90 hover:bg-white border border-gray-200 shadow-sm transition-all duration-200',
              'opacity-0 group-hover:opacity-100',
              isMinimal && 'h-6 w-6 top-1 right-1'
            )}
            onClick={onRemove}
          >
            <X
              className={cn('h-4 w-4 text-gray-600', isMinimal && 'h-3 w-3')}
            />
          </Button>
        )}

        {/* File Type Badge */}
        {file && !isMinimal && (
          <Badge
            variant="secondary"
            className={cn(
              'absolute bottom-1 left-1 text-xs m-2',
              isCompact && 'text-[10px] px-1'
            )}
          >
            {FILE_TYPE_EXTENSIONS[
              file.type as keyof typeof FILE_TYPE_EXTENSIONS
            ] || getFileExtension(file.name).toUpperCase()}
          </Badge>
        )}
      </div>

      {/* File Metadata */}
      {file && showMetadata && !isMinimal && (
        <div className={cn('mt-3 space-y-1 p-2', isCompact && 'mt-2')}>
          <p
            className={cn(
              'text-sm font-medium text-foreground truncate',
              isCompact && 'text-xs'
            )}
          >
            {file.name}
          </p>
          <div className="flex items-center justify-between">
            <p
              className={cn(
                'text-xs text-muted-foreground',
                isCompact && 'text-[10px]'
              )}
            >
              {formatFileSize(file.size)}
            </p>
            {imageDimensions && (
              <p
                className={cn(
                  'text-xs text-muted-foreground',
                  isCompact && 'text-[10px]'
                )}
              >
                {imageDimensions.width} × {imageDimensions.height}
              </p>
            )}
          </div>
          {file.lastModified && (
            <p
              className={cn(
                'text-xs text-muted-foreground',
                isCompact && 'text-[10px]'
              )}
            >
              {new Date(file.lastModified).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Minimal variant file name */}
      {file && isMinimal && (
        <p className="mt-1 text-xs text-muted-foreground truncate">
          {file.name}
        </p>
      )}
    </Card>
  )
}


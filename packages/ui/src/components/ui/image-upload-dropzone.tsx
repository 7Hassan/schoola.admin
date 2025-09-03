'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone, type FileWithPath } from 'react-dropzone'
import { Upload, AlertCircle, Loader2 } from 'lucide-react'
import { Card } from '@workspace/ui/components/ui/card'
import { Button } from '@workspace/ui/components/ui/button'
import { Progress } from '@workspace/ui/components/ui/progress'
import { Alert, AlertDescription } from '@workspace/ui/components/ui/alert'
import { Label } from '@workspace/ui/components/ui/label'
import { ImagePreview } from '@workspace/ui/components/ui/image-preview'
import { cn } from '@workspace/ui/lib/utils'
import {
  formatFileSize,
  validateImageType,
  validateImageSize,
  createImagePreview,
  revokeImagePreview
} from '@workspace/ui/lib/image-utils'
import {
  FILE_SIZE_LIMITS,
  ACCEPTED_IMAGE_TYPES,
  ACCEPT_ATTR,
  PLACEHOLDERS,
  ERROR_MESSAGES
} from '@workspace/ui/lib/image-constants'

interface ImageUploadDropzoneProps {
  // Core functionality
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  onUpload?: (file: File) => void // New prop for upload action
  currentFile?: File | string // File object or URL

  // Configuration
  maxSize?: number // in bytes, default 5MB
  acceptedTypes?: string[] // default: ['image/jpeg', 'image/png', 'image/webp']
  multiple?: boolean // default: false

  // UI customization
  placeholder?: string
  className?: string
  disabled?: boolean
  label?: string

  // Upload state
  isUploading?: boolean
  uploadProgress?: number
  error?: string
  showUploadButton?: boolean // New prop to control upload button visibility

  // Styling variants
  variant?: 'default' | 'compact' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
}

export function ImageUploadDropzone({
  onFileSelect,
  onFileRemove,
  onUpload,
  currentFile,
  maxSize = FILE_SIZE_LIMITS.DEFAULT,
  acceptedTypes = ACCEPTED_IMAGE_TYPES.slice(),
  multiple = false,
  placeholder,
  className,
  disabled = false,
  label,
  isUploading = false,
  uploadProgress = 0,
  error,
  showUploadButton = true,
  variant = 'default',
  size = 'md'
}: ImageUploadDropzoneProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragError, setDragError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Handle file validation
  const validateFile = useCallback(
    (file: File): string | null => {
      if (!validateImageType(file, acceptedTypes)) {
        return ERROR_MESSAGES.INVALID_FILE_TYPE
      }

      if (!validateImageSize(file, maxSize)) {
        return `${ERROR_MESSAGES.FILE_TOO_LARGE} (${formatFileSize(maxSize)})`
      }

      return null
    },
    [acceptedTypes, maxSize]
  )

  // Handle file drop/selection
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: any[]) => {
      setDragError(null)

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
          setDragError(
            `${ERROR_MESSAGES.FILE_TOO_LARGE} (${formatFileSize(maxSize)})`
          )
        } else if (
          rejection.errors.some((e: any) => e.code === 'file-invalid-type')
        ) {
          setDragError(ERROR_MESSAGES.INVALID_FILE_TYPE)
        } else {
          setDragError(ERROR_MESSAGES.GENERIC_ERROR)
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        if (!file) return

        const validationError = validateFile(file)

        if (validationError) {
          setDragError(validationError)
          return
        }

        setSelectedFile(file)
        onFileSelect(file)

        // Create preview
        console.log(
          'ImageUploadDropzone: Creating preview for file:',
          file.name,
          file.type,
          file.size
        )
        createImagePreview(file)
          .then((url) => {
            console.log(
              'ImageUploadDropzone: Preview created successfully:',
              url.substring(0, 50) + '...'
            )
            setPreviewUrl(url)
          })
          .catch((error) => {
            console.error(
              'ImageUploadDropzone: Failed to create image preview:',
              error
            )
            setDragError('Failed to create image preview')
          })
      }
    },
    [maxSize, onFileSelect, validateFile]
  )

  // Setup dropzone
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': acceptedTypes.map((type) => type.replace('image/', '.'))
    },
    maxSize,
    multiple,
    disabled: disabled || isUploading
  })

  // Handle file removal
  const handleRemove = useCallback(() => {
    if (previewUrl) {
      revokeImagePreview(previewUrl)
      setPreviewUrl(null)
    }
    setSelectedFile(null)
    setDragError(null)
    onFileRemove()
  }, [previewUrl, onFileRemove])

  // Handle existing file (URL string)
  useEffect(() => {
    if (typeof currentFile === 'string') {
      setPreviewUrl(currentFile)
      setSelectedFile(null)
    } else if (currentFile instanceof File) {
      setSelectedFile(currentFile)
      createImagePreview(currentFile)
        .then(setPreviewUrl)
        .catch(() => {})
    } else {
      setPreviewUrl(null)
      setSelectedFile(null)
    }
  }, [currentFile])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        revokeImagePreview(previewUrl)
      }
    }
  }, [previewUrl])

  // Get placeholder text
  const getPlaceholder = () => {
    if (placeholder) return placeholder
    switch (variant) {
      case 'compact':
        return PLACEHOLDERS.COMPACT
      case 'minimal':
        return PLACEHOLDERS.MINIMAL
      default:
        return PLACEHOLDERS.DRAG_DROP
    }
  }

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-24'
      case 'lg':
        return 'h-48'
      default:
        return 'h-32'
    }
  }

  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'p-3'
      case 'minimal':
        return 'p-2 border-dashed'
      default:
        return 'p-6'
    }
  }

  const hasFile = selectedFile || previewUrl
  const showError = error || dragError
  const isCompact = variant === 'compact'
  const isMinimal = variant === 'minimal'

  return (
    <div className="space-y-3">
      {label && (
        <Label className={cn('text-sm font-medium', disabled && 'opacity-50')}>
          {label}
        </Label>
      )}

      {/* Error Display */}
      {showError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{showError}</AlertDescription>
        </Alert>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uploading...</span>
            <span className="font-medium">{uploadProgress}%</span>
          </div>
          <Progress
            value={uploadProgress}
            className="h-2"
          />
        </div>
      )}

      {/* Preview or Upload Area */}
      {hasFile && !isUploading ? (
        <div className="space-y-3">
          <ImagePreview
            file={selectedFile || undefined}
            previewUrl={previewUrl || undefined}
            onRemove={handleRemove}
            variant={variant}
            showMetadata={!isMinimal}
            aspectRatio="auto"
            objectFit="contain"
            maxHeight={
              variant === 'compact' ? 150 : variant === 'minimal' ? 100 : 300
            }
          />

          {/* Action buttons */}
          {selectedFile && showUploadButton && onUpload && (
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => onUpload(selectedFile)}
                disabled={disabled}
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card
          {...getRootProps()}
          className={cn(
            'cursor-pointer transition-colors border-2 border-dashed',
            getVariantClasses(),
            getSizeClasses(),
            isDragActive && 'border-primary bg-primary/5',
            isDragAccept && 'border-green-500 bg-green-50',
            isDragReject && 'border-destructive bg-destructive/5',
            disabled && 'cursor-not-allowed opacity-50',
            isUploading && 'cursor-wait',
            !hasFile && !isDragActive && 'border-border hover:border-primary/50'
          )}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center justify-center text-center h-full">
            {isUploading ? (
              <>
                <Loader2
                  className={cn(
                    'animate-spin text-primary mb-2',
                    isCompact ? 'h-5 w-5' : 'h-8 w-8'
                  )}
                />
                <p
                  className={cn(
                    'text-sm text-muted-foreground',
                    isCompact && 'text-xs'
                  )}
                >
                  Processing...
                </p>
              </>
            ) : (
              <>
                <Upload
                  className={cn(
                    'text-muted-foreground mb-2',
                    isCompact ? 'h-5 w-5' : isMinimal ? 'h-4 w-4' : 'h-8 w-8'
                  )}
                />
                <p
                  className={cn(
                    'text-sm text-muted-foreground',
                    isCompact && 'text-xs',
                    isMinimal && 'text-xs'
                  )}
                >
                  {getPlaceholder()}
                </p>
                {!isMinimal && (
                  <p
                    className={cn(
                      'text-xs text-muted-foreground mt-1',
                      isCompact && 'text-[10px]'
                    )}
                  >
                    Max size: {formatFileSize(maxSize)}
                  </p>
                )}
              </>
            )}
          </div>
        </Card>
      )}

      {/* Browse Button for minimal variant */}
      {isMinimal && !hasFile && !isUploading && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const input = document.querySelector(
                'input[type="file"]'
              ) as HTMLInputElement
              input?.click()
            }}
            disabled={disabled}
          >
            Browse Files
          </Button>
        </div>
      )}
    </div>
  )
}


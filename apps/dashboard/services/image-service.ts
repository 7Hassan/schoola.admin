/**
 * Image Upload Service
 * Handles image upload, deletion, and management for location images
 */

export interface ImageUploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface ImageUploadResult {
  success: boolean
  url?: string
  error?: string
  metadata?: {
    size: number
    width: number
    height: number
    format: string
  }
}

export interface ImageUploadOptions {
  maxSizeBytes?: number
  allowedFormats?: string[]
  quality?: number
  onProgress?: (progress: ImageUploadProgress) => void
}

// Default configuration
const DEFAULT_CONFIG = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  quality: 0.8
}

/**
 * Upload an image file to storage service
 */
export async function uploadImage(
  file: File,
  options: ImageUploadOptions = {}
): Promise<ImageUploadResult> {
  try {
    // Validate file type
    const allowedFormats =
      options.allowedFormats || DEFAULT_CONFIG.allowedFormats
    if (!allowedFormats.includes(file.type)) {
      return {
        success: false,
        error: `File type ${file.type} is not allowed. Supported formats: ${allowedFormats.join(', ')}`
      }
    }

    // Validate file size
    const maxSize = options.maxSizeBytes || DEFAULT_CONFIG.maxSizeBytes
    if (file.size > maxSize) {
      return {
        success: false,
        error: `File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`
      }
    }

    // Get image metadata
    const metadata = await getImageMetadata(file)

    // Compress image if needed
    const processedFile = await compressImage(
      file,
      options.quality || DEFAULT_CONFIG.quality
    )

    // Simulate upload progress (replace with actual implementation)
    const uploadedUrl = await simulateUpload(processedFile, options.onProgress)

    return {
      success: true,
      url: uploadedUrl,
      metadata: {
        size: processedFile.size,
        width: metadata.width,
        height: metadata.height,
        format: processedFile.type
      }
    }
  } catch (error) {
    console.error('Image upload failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Delete an image from storage
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract image ID from URL (implementation depends on storage service)
    const imageId = extractImageIdFromUrl(imageUrl)

    // Simulate deletion (replace with actual implementation)
    await simulateDelete(imageId)

    return true
  } catch (error) {
    console.error('Image deletion failed:', error)
    return false
  }
}

/**
 * Generate optimized image URLs for different sizes
 */
export function generateOptimizedUrls(imageUrl: string) {
  // Implementation depends on storage service (CDN, etc.)
  return {
    thumbnail: `${imageUrl}?w=150&h=150&fit=crop`,
    small: `${imageUrl}?w=300&h=200&fit=crop`,
    medium: `${imageUrl}?w=600&h=400&fit=crop`,
    large: `${imageUrl}?w=1200&h=800&fit=crop`,
    original: imageUrl
  }
}

/**
 * Get image metadata (dimensions, etc.)
 */
function getImageMetadata(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image'))
    }

    img.src = objectUrl
  })
}

/**
 * Compress image for optimized storage
 */
function compressImage(file: File, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      // Set canvas dimensions
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      // Draw and compress
      ctx?.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image for compression'))
    }

    img.src = objectUrl
  })
}

/**
 * Simulate upload progress (replace with actual implementation)
 */
function simulateUpload(
  file: File,
  onProgress?: (progress: ImageUploadProgress) => void
): Promise<string> {
  return new Promise((resolve) => {
    let loaded = 0
    const total = file.size

    const interval = setInterval(() => {
      loaded += total / 10

      if (loaded >= total) {
        loaded = total
        clearInterval(interval)

        // Generate a mock URL (replace with actual storage URL)
        const mockUrl = `https://storage.example.com/images/${Date.now()}_${file.name}`
        resolve(mockUrl)
      }

      if (onProgress) {
        onProgress({
          loaded,
          total,
          percentage: Math.round((loaded / total) * 100)
        })
      }
    }, 100)
  })
}

/**
 * Simulate image deletion (replace with actual implementation)
 */
function simulateDelete(imageId: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Image ${imageId} deleted from storage`)
      resolve()
    }, 500)
  })
}

/**
 * Extract image ID from storage URL
 */
function extractImageIdFromUrl(url: string): string {
  // Implementation depends on storage service URL structure
  return url.split('/').pop() || ''
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  options: ImageUploadOptions = {}
): string | null {
  const maxSize = options.maxSizeBytes || DEFAULT_CONFIG.maxSizeBytes
  const allowedFormats = options.allowedFormats || DEFAULT_CONFIG.allowedFormats

  if (!allowedFormats.includes(file.type)) {
    return `File type ${file.type} is not supported`
  }

  if (file.size > maxSize) {
    return `File size exceeds maximum allowed size of ${formatFileSize(maxSize)}`
  }

  return null
}

/**
 * Create image preview URL
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * Revoke image preview URL to free memory
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url)
}


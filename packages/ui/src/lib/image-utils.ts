import { type FileWithPath } from 'react-dropzone'

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Validate image file type
 */
export function validateImageType(
  file: File,
  acceptedTypes: string[]
): boolean {
  return acceptedTypes.includes(file.type)
}

/**
 * Validate image file size
 */
export function validateImageSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize
}

/**
 * Create image preview URL from file
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result === 'string') {
        resolve(result)
      } else {
        reject(new Error('Failed to create image preview'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Revoke image preview URL to prevent memory leaks
 */
export function revokeImagePreview(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Get image dimensions
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Compress image if needed (basic client-side compression)
 */
export function compressImage(
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)

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

    img.onerror = () =>
      reject(new Error('Failed to load image for compression'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Generate thumbnail from image file
 */
export function generateThumbnail(
  file: File,
  size: number = 150
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    img.onload = () => {
      const { width, height } = img
      const ratio = Math.min(size / width, size / height)
      const newWidth = width * ratio
      const newHeight = height * ratio

      canvas.width = size
      canvas.height = size

      // Center the image
      const x = (size - newWidth) / 2
      const y = (size - newHeight) / 2

      // Fill background
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, size, size)

      // Draw image
      ctx.drawImage(img, x, y, newWidth, newHeight)

      resolve(canvas.toDataURL(file.type, 0.8))
    }

    img.onerror = () => reject(new Error('Failed to generate thumbnail'))
    img.src = URL.createObjectURL(file)
  })
}


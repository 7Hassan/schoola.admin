/**
 * Default file size limits
 */
export const FILE_SIZE_LIMITS = {
  DEFAULT: 5 * 1024 * 1024, // 5MB
  SMALL: 2 * 1024 * 1024, // 2MB
  LARGE: 10 * 1024 * 1024, // 10MB
  MAX: 50 * 1024 * 1024 // 50MB
} as const

/**
 * Accepted image file types
 */
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
] as const

/**
 * File type extensions for display
 */
export const FILE_TYPE_EXTENSIONS = {
  'image/jpeg': 'JPG',
  'image/jpg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
  'image/gif': 'GIF'
} as const

/**
 * MIME type to accept attribute mapping for file inputs
 */
export const ACCEPT_ATTR = {
  IMAGES: 'image/jpeg,image/jpg,image/png,image/webp,image/gif',
  COMMON_IMAGES: 'image/jpeg,image/png,image/webp'
} as const

/**
 * Upload component variants
 */
export const UPLOAD_VARIANTS = {
  DEFAULT: 'default',
  COMPACT: 'compact',
  MINIMAL: 'minimal'
} as const

/**
 * Upload component sizes
 */
export const UPLOAD_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
} as const

/**
 * Upload states
 */
export const UPLOAD_STATES = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a valid image file',
  UPLOAD_FAILED: 'Upload failed. Please try again',
  NETWORK_ERROR: 'Network error. Please check your connection',
  GENERIC_ERROR: 'An error occurred. Please try again'
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  UPLOAD_COMPLETE: 'File uploaded successfully',
  FILE_SELECTED: 'File selected successfully'
} as const

/**
 * Default placeholders
 */
export const PLACEHOLDERS = {
  DRAG_DROP: 'Drag and drop an image here, or click to browse',
  COMPACT: 'Click to upload image',
  MINIMAL: 'Upload image'
} as const

/**
 * Image compression settings
 */
export const COMPRESSION_SETTINGS = {
  QUALITY: 0.8,
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
  THUMBNAIL_SIZE: 150
} as const


/**
 * Google Maps Static API Service
 * Generates map snapshots for location images
 */

export interface MapSnapshotOptions {
  width?: number
  height?: number
  zoom?: number
  mapType?: 'roadmap' | 'satellite' | 'terrain' | 'hybrid'
  markerColor?: string
  markerSize?: 'tiny' | 'small' | 'mid' | 'normal'
  style?: 'default' | 'retro' | 'dark' | 'night' | 'aubergine'
}

export interface AddressValidationResult {
  isValid: boolean
  formattedAddress?: string
  coordinates?: {
    lat: number
    lng: number
  }
  error?: string
}

// Default configuration
const DEFAULT_MAP_CONFIG: Required<MapSnapshotOptions> = {
  width: 600,
  height: 400,
  zoom: 15,
  mapType: 'roadmap',
  markerColor: 'red',
  markerSize: 'normal',
  style: 'default'
}

// Map styles for different themes
const MAP_STYLES = {
  default: '',
  retro:
    '&style=element:geometry%7Ccolor:0xebe3cd&style=element:labels.text.fill%7Ccolor:0x523735&style=element:labels.text.stroke%7Ccolor:0xf5f1e6',
  dark: '&style=element:geometry%7Ccolor:0x242f3e&style=element:labels.text.fill%7Ccolor:0x746855&style=element:labels.text.stroke%7Ccolor:0x242f3e',
  night:
    '&style=element:geometry%7Ccolor:0x1d2c4d&style=element:labels.text.fill%7Ccolor:0x8ec3b9&style=element:labels.text.stroke%7Ccolor:0x1a3646',
  aubergine:
    '&style=element:geometry%7Ccolor:0x1d2c4d&style=element:labels.text.fill%7Ccolor:0x8ec3b9&style=feature:administrative%7Celement:geometry%7Cstroke_color:0x4b6878'
}

/**
 * Generate Google Maps Static API URL for a location
 */
export function generateMapSnapshotUrl(
  address: string,
  options: MapSnapshotOptions = {}
): string {
  const config = { ...DEFAULT_MAP_CONFIG, ...options }
  const apiKey = getGoogleMapsApiKey()

  if (!apiKey) {
    console.warn('Google Maps API key not configured')
    return generateFallbackMapUrl(address, config)
  }

  // Encode address for URL
  const encodedAddress = encodeURIComponent(address)

  // Build base URL
  let url = `https://maps.googleapis.com/maps/api/staticmap?`
  url += `center=${encodedAddress}`
  url += `&zoom=${config.zoom}`
  url += `&size=${config.width}x${config.height}`
  url += `&maptype=${config.mapType}`
  url += `&markers=color:${config.markerColor}%7Csize:${config.markerSize}%7C${encodedAddress}`
  url += `&key=${apiKey}`

  // Add style if not default
  if (config.style !== 'default' && MAP_STYLES[config.style]) {
    url += MAP_STYLES[config.style]
  }

  return url
}

/**
 * Generate multiple map snapshot URLs for different zoom levels
 */
export function generateMultiZoomMapUrls(
  address: string,
  baseOptions: MapSnapshotOptions = {}
): {
  overview: string
  street: string
  detailed: string
} {
  return {
    overview: generateMapSnapshotUrl(address, { ...baseOptions, zoom: 12 }),
    street: generateMapSnapshotUrl(address, { ...baseOptions, zoom: 15 }),
    detailed: generateMapSnapshotUrl(address, { ...baseOptions, zoom: 18 })
  }
}

/**
 * Validate address for map compatibility
 */
export async function validateAddress(
  address: string
): Promise<AddressValidationResult> {
  const apiKey = getGoogleMapsApiKey()

  if (!apiKey) {
    return {
      isValid: false,
      error: 'Google Maps API key not configured'
    }
  }

  try {
    // Use Geocoding API to validate and get formatted address
    const encodedAddress = encodeURIComponent(address)
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
    )

    const data = await response.json()

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0]
      return {
        isValid: true,
        formattedAddress: result.formatted_address,
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        }
      }
    } else {
      return {
        isValid: false,
        error: `Address validation failed: ${data.status}`
      }
    }
  } catch (error) {
    console.error('Address validation error:', error)
    return {
      isValid: false,
      error: 'Failed to validate address'
    }
  }
}

/**
 * Get coordinates from address using Geocoding API
 */
export async function geocodeAddress(address: string): Promise<{
  lat: number
  lng: number
} | null> {
  const validation = await validateAddress(address)
  return validation.coordinates || null
}

/**
 * Format address for Google Maps API
 */
export function formatAddressForApi(address: string): string {
  // Clean up common address formatting issues
  return address
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/,\s*,/g, ',') // Multiple commas to single comma
    .trim()
}

/**
 * Generate fallback map URL when API key is not available
 */
function generateFallbackMapUrl(
  address: string,
  config: Required<MapSnapshotOptions>
): string {
  // Use OpenStreetMap as fallback
  const encodedAddress = encodeURIComponent(address)
  return `https://via.placeholder.com/${config.width}x${config.height}/E5E7EB/6B7280?text=Map+Preview+Unavailable`
}

/**
 * Get Google Maps API key from environment
 */
function getGoogleMapsApiKey(): string | null {
  // Check different possible environment variable names
  return (
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
    null
  )
}

/**
 * Generate map URL with custom styling
 */
export function generateStyledMapUrl(
  address: string,
  style: keyof typeof MAP_STYLES,
  options: MapSnapshotOptions = {}
): string {
  return generateMapSnapshotUrl(address, { ...options, style })
}

/**
 * Preload map images for better UX
 */
export function preloadMapImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

/**
 * Cache map URLs to avoid regenerating
 */
class MapUrlCache {
  private cache = new Map<string, string>()
  private maxSize = 100

  generateCachedUrl(address: string, options: MapSnapshotOptions = {}): string {
    const cacheKey = this.generateCacheKey(address, options)

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    const url = generateMapSnapshotUrl(address, options)

    // Implement LRU cache
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(cacheKey, url)
    return url
  }

  private generateCacheKey(
    address: string,
    options: MapSnapshotOptions
  ): string {
    return `${address}:${JSON.stringify(options)}`
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

// Export singleton cache instance
export const mapUrlCache = new MapUrlCache()

/**
 * Generate map thumbnail for location cards
 */
export function generateLocationThumbnail(
  address: string,
  locationType: 'onsite' | 'online' = 'onsite'
): string {
  if (locationType === 'online') {
    // Return placeholder for online locations
    return 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Online+Location'
  }

  return mapUrlCache.generateCachedUrl(address, {
    width: 300,
    height: 200,
    zoom: 15,
    mapType: 'roadmap',
    style: 'default'
  })
}

/**
 * Batch generate map URLs for multiple locations
 */
export async function batchGenerateMapUrls(
  locations: Array<{ address: string; id: string }>,
  options: MapSnapshotOptions = {}
): Promise<Map<string, string>> {
  const results = new Map<string, string>()

  for (const location of locations) {
    try {
      const url = generateMapSnapshotUrl(location.address, options)
      results.set(location.id, url)

      // Small delay to avoid hitting API rate limits
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (error) {
      console.error(
        `Failed to generate map URL for location ${location.id}:`,
        error
      )
    }
  }

  return results
}


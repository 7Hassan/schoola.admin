/**
 * Location Creation Static Data and Constants
 * Contains all static data, mock data, and configuration constants for location creation
 */

import type {
  LocationCreateFormData,
  LocationStatus,
  LocationType,
  OperatingHours,
  LocationFeature,
  LocationManager,
  LocationDepartment
} from '@/types/locations/create-form'

/**
 * Default form values for location creation
 * Used as initial state for form components
 */
export const LOCATION_CREATE_FORM_DEFAULTS: LocationCreateFormData = {
  name: '',
  code: '',
  type: '',
  capacity: undefined,
  description: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phone: '',
  email: '',
  website: '',
  operatingHours: '',
  status: 'active',
  features: [],
  manager: '',
  department: '',
  notes: ''
}

/**
 * Location status options configuration
 */
export const LOCATION_STATUS_OPTIONS: readonly {
  value: LocationStatus
  label: string
  color: string
}[] = [
  { value: 'active', label: 'Active', color: '#10B981' },
  {
    value: 'under_construction',
    label: 'Under Construction',
    color: '#F59E0B'
  },
  { value: 'maintenance', label: 'Under Maintenance', color: '#EF4444' },
  { value: 'inactive', label: 'Inactive', color: '#6B7280' }
] as const

/**
 * Location type options configuration
 */
export const LOCATION_TYPE_OPTIONS: readonly {
  value: LocationType
  label: string
  description: string
}[] = [
  {
    value: 'classroom',
    label: 'Classroom',
    description: 'Traditional learning space with desks and whiteboard'
  },
  {
    value: 'laboratory',
    label: 'Laboratory',
    description: 'Specialized lab with equipment for experiments'
  },
  {
    value: 'library',
    label: 'Library',
    description: 'Quiet study space with books and resources'
  },
  {
    value: 'auditorium',
    label: 'Auditorium',
    description: 'Large presentation space for events and lectures'
  },
  {
    value: 'gymnasium',
    label: 'Gymnasium',
    description: 'Sports and physical activity facility'
  },
  {
    value: 'cafeteria',
    label: 'Cafeteria',
    description: 'Dining and social gathering space'
  },
  {
    value: 'office',
    label: 'Office',
    description: 'Administrative or faculty workspace'
  },
  {
    value: 'outdoor',
    label: 'Outdoor Space',
    description: 'External area for outdoor activities'
  },
  {
    value: 'online',
    label: 'Online/Virtual',
    description: 'Digital learning environment'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Specialized or unique space type'
  }
] as const

/**
 * Operating hours options configuration
 */
export const OPERATING_HOURS_OPTIONS: readonly {
  value: OperatingHours
  label: string
  description: string
}[] = [
  { value: '24/7', label: '24/7', description: 'Available around the clock' },
  {
    value: 'business',
    label: 'Business Hours (8 AM - 5 PM)',
    description: 'Standard business hours'
  },
  {
    value: 'academic',
    label: 'Academic Hours (7 AM - 6 PM)',
    description: 'Extended academic schedule'
  },
  {
    value: 'custom',
    label: 'Custom Hours',
    description: 'Flexible or unique schedule'
  }
] as const

/**
 * Mock location features for development and testing
 * In production, this should come from the features store/API
 *
 * @TODO Integrate with actual features store: `import { useFeaturesStore } from '@/stores/features-store'`
 */
export const MOCK_LOCATION_FEATURES: readonly LocationFeature[] = [
  // Technology features
  { id: '1', name: 'Wi-Fi', icon: '📶', category: 'technology' },
  { id: '2', name: 'Projector', icon: '📽️', category: 'technology' },
  { id: '3', name: 'Smart Board', icon: '📱', category: 'technology' },
  { id: '4', name: 'Computers', icon: '💻', category: 'technology' },
  { id: '5', name: 'Audio System', icon: '🔊', category: 'technology' },

  // Accessibility features
  {
    id: '6',
    name: 'Wheelchair Accessible',
    icon: '♿',
    category: 'accessibility'
  },
  { id: '7', name: 'Elevator Access', icon: '🛗', category: 'accessibility' },
  { id: '8', name: 'Hearing Loop', icon: '👂', category: 'accessibility' },
  { id: '9', name: 'Braille Signage', icon: '👆', category: 'accessibility' },

  // Amenities
  { id: '10', name: 'Air Conditioning', icon: '❄️', category: 'amenities' },
  { id: '11', name: 'Kitchen Facilities', icon: '🍽️', category: 'amenities' },
  { id: '12', name: 'Parking Available', icon: '🚗', category: 'amenities' },
  { id: '13', name: 'Natural Lighting', icon: '☀️', category: 'amenities' },

  // Safety features
  { id: '14', name: 'Security Cameras', icon: '📹', category: 'safety' },
  { id: '15', name: 'Emergency Exits', icon: '🚪', category: 'safety' },
  { id: '16', name: 'Fire Suppression', icon: '🧯', category: 'safety' },
  { id: '17', name: 'First Aid Station', icon: '🏥', category: 'safety' }
] as const

/**
 * Mock location managers for development and testing
 * In production, this should come from the staff store/API
 *
 * @TODO Integrate with actual staff store: `import { useStaffStore } from '@/stores/staff-store'`
 */
export const MOCK_LOCATION_MANAGERS: readonly LocationManager[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@school.edu',
    role: 'Facilities Manager'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@school.edu',
    role: 'Building Supervisor'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@school.edu',
    role: 'Campus Coordinator'
  },
  {
    id: '4',
    name: 'Lisa Brown',
    email: 'lisa.brown@school.edu',
    role: 'Department Head'
  },
  {
    id: '5',
    name: 'David Taylor',
    email: 'david.taylor@school.edu',
    role: 'Maintenance Supervisor'
  }
] as const

/**
 * Mock location departments for development and testing
 * In production, this should come from the departments store/API
 *
 * @TODO Integrate with actual departments store: `import { useDepartmentsStore } from '@/stores/departments-store'`
 */
export const MOCK_LOCATION_DEPARTMENTS: readonly LocationDepartment[] = [
  { id: '1', name: 'Computer Science' },
  { id: '2', name: 'Mathematics' },
  { id: '3', name: 'Physics' },
  { id: '4', name: 'Chemistry' },
  { id: '5', name: 'Biology' },
  { id: '6', name: 'English' },
  { id: '7', name: 'History' },
  { id: '8', name: 'Art' },
  { id: '9', name: 'Physical Education' },
  { id: '10', name: 'Administration' }
] as const

/**
 * Helper function to get location manager by ID
 */
export const getLocationManagerById = (
  managerId: string
): LocationManager | undefined => {
  return MOCK_LOCATION_MANAGERS.find((manager) => manager.id === managerId)
}

/**
 * Helper function to get location department by ID
 */
export const getLocationDepartmentById = (
  departmentId: string
): LocationDepartment | undefined => {
  return MOCK_LOCATION_DEPARTMENTS.find((dept) => dept.id === departmentId)
}

/**
 * Helper function to get location feature by ID
 */
export const getLocationFeatureById = (
  featureId: string
): LocationFeature | undefined => {
  return MOCK_LOCATION_FEATURES.find((feature) => feature.id === featureId)
}

/**
 * Helper function to get features by category
 */
export const getLocationFeaturesByCategory = (
  category: LocationFeature['category']
): LocationFeature[] => {
  return MOCK_LOCATION_FEATURES.filter(
    (feature) => feature.category === category
  )
}

/**
 * Form validation configuration
 */
export const LOCATION_FORM_VALIDATION_CONFIG = {
  /** Minimum location name length */
  MIN_NAME_LENGTH: 1,
  /** Minimum capacity */
  MIN_CAPACITY: 1,
  /** Maximum capacity */
  MAX_CAPACITY: 10000,
  /** Minimum street address length */
  MIN_ADDRESS_LENGTH: 1,
  /** Minimum city name length */
  MIN_CITY_LENGTH: 1,
  /** Minimum state name length */
  MIN_STATE_LENGTH: 1,
  /** Minimum postal code length */
  MIN_POSTAL_CODE_LENGTH: 1,
  /** Minimum country name length */
  MIN_COUNTRY_LENGTH: 1
} as const

/**
 * Common countries list
 */
export const COMMON_COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Egypt',
  'United Arab Emirates',
  'Saudi Arabia',
  'Japan',
  'South Korea',
  'China',
  'India',
  'Brazil',
  'Mexico'
] as const


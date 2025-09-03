import { create } from 'zustand'

export type ImageUploadStatus = 'idle' | 'uploading' | 'success' | 'error'
export type UserRole = 'admin' | 'editor' | 'viewer'

export interface Location {
  id: string
  name: string
  address: string
  mapLink: string
  timezone: string
  capacity?: number
  mapThumbnail?: string // URL to static map image
  uploadedImageUrl?: string // User uploaded image URL
  useMapSnapshot?: boolean // For onsite locations: true = use map, false = use uploaded image
  createdAt: Date
  updatedAt: Date
}

export interface LocationFilters {
  searchQuery: string
  addressFilter: string
  mapLinkFilter: string
}

interface LocationsStore {
  locations: Location[]
  filters: LocationFilters
  selectedLocation: Location | null
  isDrawerOpen: boolean
  isAddMode: boolean
  isMapModalOpen: boolean
  currentPage: number
  itemsPerPage: number
  userRole: UserRole
  isLoading: boolean
  error: string | null
  // Delete mode state
  isDeleteMode: boolean
  selectedLocationsForDeletion: string[]
  isDeleteModalOpen: boolean

  // Actions
  setLocations: (locations: Location[]) => void
  updateFilters: (filters: Partial<LocationFilters>) => void
  setSelectedLocation: (location: Location | null) => void
  setDrawerOpen: (open: boolean) => void
  setAddMode: (isAdd: boolean) => void
  setMapModalOpen: (open: boolean) => void
  addLocation: (
    location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>
  ) => void
  updateLocation: (id: string, updates: Partial<Location>) => void
  deleteLocation: (id: string) => void
  duplicateLocation: (id: string) => void
  openAddDrawer: () => void
  openEditDrawer: (location: Location) => void
  closeDrawer: () => void
  setCurrentPage: (page: number) => void
  setUserRole: (role: UserRole) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  // Delete mode actions
  enterDeleteMode: () => void
  exitDeleteMode: () => void
  toggleLocationForDeletion: (locationId: string) => void
  selectAllLocationsForDeletion: () => void
  clearSelectedLocationsForDeletion: () => void
  openDeleteModal: () => void
  closeDeleteModal: () => void
  confirmDeleteSelectedLocations: () => void
  executeDeleteSelectedLocations: () => void
  deleteLocations: (locationIds: string[]) => void

  // Image upload actions
  setImageUploadStatus: (locationId: string, status: ImageUploadStatus) => void
  updateLocationImage: (locationId: string, imageUrl: string) => void
  removeLocationImage: (locationId: string) => void
  toggleMapSnapshot: (locationId: string) => void

  // Computed
  getFilteredLocations: () => Location[]
  getPaginatedLocations: () => Location[]
  getTotalPages: () => number
}

const defaultFilters: LocationFilters = {
  searchQuery: '',
  addressFilter: '',
  mapLinkFilter: ''
}

// Mock data
const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Downtown Campus',
    address: '123 Tech Street, Cairo, Egypt',
    mapLink: 'https://maps.google.com/location1',
    timezone: 'Africa/Cairo',
    capacity: 50,
    mapThumbnail:
      'https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    name: 'Virtual Classroom A',
    address: 'Online Platform',
    mapLink: '',
    timezone: 'UTC',
    capacity: 100,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-11-28')
  },
  {
    id: '3',
    name: 'Maadi Branch',
    address: '456 Learning Avenue, Maadi, Cairo, Egypt',
    mapLink: 'https://maps.google.com/location2',
    timezone: 'Africa/Cairo',
    capacity: 30,
    mapThumbnail:
      'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-12-02')
  },
  {
    id: '4',
    name: 'Advanced Python Workshop',
    address: 'Microsoft Teams',
    mapLink: '',
    timezone: 'Europe/London',
    capacity: 25,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-11-30')
  },
  {
    id: '5',
    name: 'Alexandria Hub',
    address: '789 Innovation Road, Alexandria, Egypt',
    mapLink: 'https://maps.google.com/location3',
    timezone: 'Africa/Cairo',
    capacity: 40,
    mapThumbnail:
      'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-11-25')
  }
]

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useLocationsStore = create<LocationsStore>((set, get) => ({
  locations: mockLocations,
  filters: defaultFilters,
  selectedLocation: null,
  isDrawerOpen: false,
  isAddMode: false,
  isMapModalOpen: false,
  currentPage: 1,
  itemsPerPage: 12,
  userRole: 'admin',
  isLoading: false,
  error: null,
  // Delete mode state
  isDeleteMode: false,
  selectedLocationsForDeletion: [],
  isDeleteModalOpen: false,

  setLocations: (locations) => set({ locations }),
  updateFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1 // Reset to first page when filters change
    })),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
  setDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
  setAddMode: (isAddMode) => set({ isAddMode }),
  setMapModalOpen: (isMapModalOpen) => set({ isMapModalOpen }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setUserRole: (userRole) => set({ userRole }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addLocation: (location) =>
    set((state) => ({
      locations: [
        ...state.locations,
        {
          ...location,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    })),

  openAddDrawer: () =>
    set({
      selectedLocation: null,
      isAddMode: true,
      isDrawerOpen: true
    }),

  openEditDrawer: (location) =>
    set({
      selectedLocation: location,
      isAddMode: false,
      isDrawerOpen: true
    }),

  closeDrawer: () =>
    set({
      isDrawerOpen: false,
      isAddMode: false,
      selectedLocation: null
    }),

  updateLocation: (id, updates) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === id
          ? { ...location, ...updates, updatedAt: new Date() }
          : location
      )
    })),

  deleteLocation: (id) =>
    set((state) => ({
      locations: state.locations.filter((location) => location.id !== id)
    })),

  duplicateLocation: (id) =>
    set((state) => {
      const location = state.locations.find((l) => l.id === id)
      if (!location) return state

      const duplicated: Location = {
        ...location,
        id: generateId(),
        name: `${location.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      return {
        locations: [...state.locations, duplicated]
      }
    }),

  // Delete mode actions
  enterDeleteMode: () =>
    set({
      isDeleteMode: true,
      selectedLocationsForDeletion: []
    }),

  exitDeleteMode: () =>
    set({
      isDeleteMode: false,
      selectedLocationsForDeletion: []
    }),

  toggleLocationForDeletion: (locationId) =>
    set((state) => ({
      selectedLocationsForDeletion: state.selectedLocationsForDeletion.includes(
        locationId
      )
        ? state.selectedLocationsForDeletion.filter((id) => id !== locationId)
        : [...state.selectedLocationsForDeletion, locationId]
    })),

  selectAllLocationsForDeletion: () =>
    set((state) => {
      const filteredLocations = get().getFilteredLocations()
      return {
        selectedLocationsForDeletion: filteredLocations.map(
          (location) => location.id
        )
      }
    }),

  clearSelectedLocationsForDeletion: () =>
    set({
      selectedLocationsForDeletion: []
    }),

  openDeleteModal: () =>
    set({
      isDeleteModalOpen: true
    }),

  closeDeleteModal: () =>
    set({
      isDeleteModalOpen: false
    }),

  deleteLocations: (locationIds) =>
    set((state) => ({
      locations: state.locations.filter(
        (location) => !locationIds.includes(location.id)
      )
    })),

  // Image upload actions
  setImageUploadStatus: (locationId, status) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === locationId
          ? {
              ...location,
              imageUploadStatus: status,
              updatedAt: new Date()
            }
          : location
      )
    })),

  updateLocationImage: (locationId, imageUrl) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === locationId
          ? {
              ...location,
              uploadedImageUrl: imageUrl,
              imageUploadStatus: 'success',
              updatedAt: new Date()
            }
          : location
      )
    })),

  removeLocationImage: (locationId) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === locationId
          ? {
              ...location,
              uploadedImageUrl: undefined,
              imageUploadStatus: 'idle',
              updatedAt: new Date()
            }
          : location
      )
    })),

  toggleMapSnapshot: (locationId) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === locationId
          ? {
              ...location,
              useMapSnapshot: !location.useMapSnapshot,
              updatedAt: new Date()
            }
          : location
      )
    })),

  confirmDeleteSelectedLocations: () => {
    const { selectedLocationsForDeletion } = get()
    if (selectedLocationsForDeletion.length === 0) return

    // Open the modal instead of using browser confirm
    get().openDeleteModal()
  },

  executeDeleteSelectedLocations: () => {
    const { selectedLocationsForDeletion } = get()
    if (selectedLocationsForDeletion.length > 0) {
      get().deleteLocations(selectedLocationsForDeletion)
      get().exitDeleteMode()
      get().closeDeleteModal()
    }
  },

  getFilteredLocations: () => {
    const { locations, filters } = get()

    return locations.filter((location) => {
      // Search query filter (fuzzy search on name)
      if (
        filters.searchQuery &&
        !location.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false
      }

      // Address filter
      if (
        filters.addressFilter &&
        !location.address
          .toLowerCase()
          .includes(filters.addressFilter.toLowerCase())
      ) {
        return false
      }

      // MapLink filter (substring)
      if (
        filters.mapLinkFilter &&
        !location.mapLink
          .toLowerCase()
          .includes(filters.mapLinkFilter.toLowerCase())
      ) {
        return false
      }

      return true
    })
  },

  getPaginatedLocations: () => {
    const { currentPage, itemsPerPage } = get()
    const filteredLocations = get().getFilteredLocations()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredLocations.slice(startIndex, endIndex)
  },

  getTotalPages: () => {
    const { itemsPerPage } = get()
    const filteredLocations = get().getFilteredLocations()
    return Math.ceil(filteredLocations.length / itemsPerPage)
  }
}))


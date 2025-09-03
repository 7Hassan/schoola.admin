'use client'

import { LocationFilters } from './location-filters'
import { LocationGrid } from './location-grid'
import { LocationDrawer } from './location-drawer'
import { MapPreviewModal } from './map-preview-modal'
import { DeleteConfirmationModal } from '../shared/delete-confirmation-modal'
import { Card } from '@workspace/ui/components/ui/card'
import { Button } from '@workspace/ui/components/ui/button'
import {
  MapPin,
  Globe,
  Building,
  Calendar,
  Download,
  Plus,
  Minus,
  X,
  Trash2
} from 'lucide-react'
import { useLocationsStore } from '@/stores/locations-store'

export function LocationsDashboard() {
  const {
    getFilteredLocations,
    userRole,
    setUserRole,
    isDeleteMode,
    selectedLocationsForDeletion,
    enterDeleteMode,
    exitDeleteMode,
    confirmDeleteSelectedLocations,
    isDeleteModalOpen,
    closeDeleteModal,
    executeDeleteSelectedLocations,
    locations: allLocations,
    openAddDrawer
  } = useLocationsStore()

  const locations = getFilteredLocations()

  const stats = {
    total: locations.length,
    onsite: locations.filter((l) => l.type === 'onsite').length,
    online: locations.filter((l) => l.type === 'online').length,
    recurring: locations.filter((l) => l.recurringPattern !== 'none').length
  }

  const canEdit = userRole === 'admin' || userRole === 'editor'

  // Dynamic header content based on delete mode
  const title = isDeleteMode ? 'Delete Locations' : 'Location Management'
  const description = isDeleteMode
    ? `${selectedLocationsForDeletion.length} location${selectedLocationsForDeletion.length !== 1 ? 's' : ''} selected for deletion`
    : 'Manage onsite and online locations for your coding school'

  const headerClasses = isDeleteMode
    ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 rounded-lg'
    : ''

  // Prepare modal data
  const selectedLocationNames = allLocations
    .filter((loc) => selectedLocationsForDeletion.includes(loc.id))
    .map((loc) => loc.name)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-center justify-between ${headerClasses}`}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Role Selector (for demo purposes) */}

          {!isDeleteMode ? (
            // Normal mode buttons
            <>
              <Button
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              {canEdit && (
                <>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={openAddDrawer}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Location
                  </Button>
                  <Button
                    size="sm"
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={enterDeleteMode}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Delete Location
                  </Button>
                </>
              )}
            </>
          ) : (
            // Delete mode buttons
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={exitDeleteMode}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={confirmDeleteSelectedLocations}
                disabled={selectedLocationsForDeletion.length === 0}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedLocationsForDeletion.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Locations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MapPin className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Onsite</p>
              <p className="text-2xl font-bold text-gray-900">{stats.onsite}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Globe className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Online</p>
              <p className="text-2xl font-bold text-gray-900">{stats.online}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Recurring</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.recurring}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <LocationFilters />

      {/* Locations Grid */}
      <LocationGrid />

      {/* Location Edit Drawer */}
      <LocationDrawer />

      {/* Map Preview Modal */}
      <MapPreviewModal />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={executeDeleteSelectedLocations}
        selectedCount={selectedLocationsForDeletion.length}
        selectedNames={selectedLocationNames}
      />
    </div>
  )
}


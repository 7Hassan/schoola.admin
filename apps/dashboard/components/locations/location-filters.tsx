'use client'

import { useState, useEffect } from 'react'
import { Card } from '@workspace/ui/components/ui/card'
import { Input } from '@workspace/ui/components/ui/input'
import { Label } from '@workspace/ui/components/ui/label'
import { Button } from '@workspace/ui/components/ui/button'
import { Filter, RotateCcw, Search, MapPin, Link } from 'lucide-react'
import { useLocationsStore } from '@/stores/locations-store'

export function LocationFilters() {
  const { filters, updateFilters } = useLocationsStore()
  const [localFilters, setLocalFilters] = useState(filters)

  // Debounce filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters(localFilters)
    }, 300)

    return () => clearTimeout(timer)
  }, [localFilters, updateFilters])

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      searchQuery: '',
      addressFilter: '',
      mapLinkFilter: ''
    }
    setLocalFilters(clearedFilters)
    updateFilters(clearedFilters)
  }

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.addressFilter !== '' ||
    filters.mapLinkFilter !== ''

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Input */}
        <div className="space-y-2">
          <Label
            htmlFor="search"
            className="text-sm font-medium flex items-center"
          >
            <Search className="h-4 w-4 mr-2" />
            Search by Name
          </Label>
          <Input
            id="search"
            placeholder="Enter location name..."
            value={localFilters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Address Filter */}
        <div className="space-y-2">
          <Label
            htmlFor="address"
            className="text-sm font-medium flex items-center"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Address Filter
          </Label>
          <Input
            id="address"
            placeholder="Enter address or location..."
            value={localFilters.addressFilter}
            onChange={(e) =>
              handleFilterChange('addressFilter', e.target.value)
            }
            className="w-full"
          />
        </div>

        {/* MapLink Filter */}
        <div className="space-y-2">
          <Label
            htmlFor="maplink"
            className="text-sm font-medium flex items-center"
          >
            <Link className="h-4 w-4 mr-2" />
            Map Link Filter
          </Label>
          <Input
            id="maplink"
            placeholder="Enter map link substring..."
            value={localFilters.mapLinkFilter}
            onChange={(e) =>
              handleFilterChange('mapLinkFilter', e.target.value)
            }
            className="w-full"
          />
        </div>
      </div>
    </Card>
  )
}


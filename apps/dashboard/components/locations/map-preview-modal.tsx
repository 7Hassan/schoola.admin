'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@workspace/ui/components/ui/dialog'
import { Button } from '@workspace/ui/components/ui/button'
import { Badge } from '@workspace/ui/components/ui/badge'
import { ExternalLink, MapPin, Clock, Users, Calendar } from 'lucide-react'
import { useLocationsStore } from '@/stores/locations-store'

export function MapPreviewModal() {
  const { selectedLocation, isMapModalOpen, setMapModalOpen } =
    useLocationsStore()

  if (!selectedLocation || selectedLocation.type !== 'onsite') return null

  const getRecurringColor = (pattern: string) => {
    switch (pattern) {
      case 'daily':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'weekly':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'monthly':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Dialog
      open={isMapModalOpen}
      onOpenChange={setMapModalOpen}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>{selectedLocation.name}</span>
          </DialogTitle>
          <DialogDescription>
            Location preview and map details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location Info */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <MapPin className="h-3 w-3 mr-1" />
                  Onsite
                </Badge>
                {selectedLocation.recurringPattern !== 'none' && (
                  <Badge
                    className={getRecurringColor(
                      selectedLocation.recurringPattern
                    )}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {selectedLocation.recurringPattern}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {selectedLocation.address}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{selectedLocation.timezone}</span>
                </div>
                {selectedLocation.capacity && (
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{selectedLocation.capacity} seats</span>
                  </div>
                )}
              </div>
            </div>

            {selectedLocation.mapLink && (
              <Button asChild>
                <a
                  href={selectedLocation.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Maps
                </a>
              </Button>
            )}
          </div>

          {/* Map Embed or Image */}
          <div className="border rounded-lg overflow-hidden">
            {selectedLocation.mapThumbnail ? (
              <div className="relative">
                <img
                  src={selectedLocation.mapThumbnail}
                  alt={`Map of ${selectedLocation.name}`}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                  {selectedLocation.mapLink && (
                    <Button
                      asChild
                      className="opacity-0 hover:opacity-100 transition-opacity duration-200"
                    >
                      <a
                        href={selectedLocation.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Interactive Map
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ) : selectedLocation.mapLink ? (
              <div className="h-96 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Map preview not available
                  </p>
                  <Button asChild>
                    <a
                      href={selectedLocation.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in Maps
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-96 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No map link available</p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Location Details
              </h4>
              <div className="space-y-1 text-gray-600">
                <p>ID: {selectedLocation.id}</p>
                <p>Type: {selectedLocation.type}</p>
                <p>Timezone: {selectedLocation.timezone}</p>
                {selectedLocation.capacity && (
                  <p>Capacity: {selectedLocation.capacity} people</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Schedule</h4>
              <div className="space-y-1 text-gray-600">
                <p>Pattern: {selectedLocation.recurringPattern}</p>
                <p>
                  Created: {selectedLocation.createdAt.toLocaleDateString()}
                </p>
                <p>
                  Updated: {selectedLocation.lastUpdatedAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


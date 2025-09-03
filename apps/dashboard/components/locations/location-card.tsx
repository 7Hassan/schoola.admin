'use client'

import { useState } from 'react'
import { Card } from '@workspace/ui/components/ui/card'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Button } from '@workspace/ui/components/ui/button'
import {
  MapPin,
  Globe,
  Clock,
  Users,
  Calendar,
  Edit,
  Trash2,
  Copy,
  Eye,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react'
import { format } from 'date-fns'
import { Location, useLocationsStore } from '@/stores/locations-store'

interface LocationCardProps {
  location: Location
}

export function LocationCard({ location }: LocationCardProps) {
  const {
    setSelectedLocation,
    setDrawerOpen,
    setMapModalOpen,
    deleteLocation,
    duplicateLocation,
    userRole,
    isDeleteMode,
    selectedLocationsForDeletion,
    toggleLocationForDeletion,
    openEditDrawer
  } = useLocationsStore()

  const [imageError, setImageError] = useState(false)
  const canEdit = userRole === 'admin' || userRole === 'editor'
  const isSelectedForDeletion = selectedLocationsForDeletion.includes(
    location.id
  )

  const handleCardClick = () => {
    if (isDeleteMode) {
      toggleLocationForDeletion(location.id)
    } else {
      // Normal edit behavior - don't trigger on action button clicks
      // This will be handled by the Edit button specifically
    }
  }

  const handleEdit = () => {
    openEditDrawer(location)
  }

  const handleDelete = () => {
    if (canEdit && confirm('Are you sure you want to delete this location?')) {
      deleteLocation(location.id)
    }
  }

  const handleDuplicate = () => {
    if (canEdit) {
      duplicateLocation(location.id)
    }
  }

  const handlePreviewMap = () => {
    if (location.type === 'onsite' && location.mapLink) {
      setSelectedLocation(location)
      setMapModalOpen(true)
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'onsite'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-green-100 text-green-800 border-green-200'
  }

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
    <Card
      className={`p-6 transition-all duration-200 cursor-pointer group relative ${
        isDeleteMode
          ? isSelectedForDeletion
            ? 'border-2 border-red-500 bg-red-50 dark:bg-red-950/20 shadow-lg'
            : 'border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
          : 'hover:shadow-lg'
      }`}
      onClick={handleCardClick}
    >
      {/* Header with Type Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Badge className={getTypeColor(location.type)}>
            {location.type === 'onsite' ? (
              <>
                <MapPin className="h-3 w-3 mr-1" />
                Onsite
              </>
            ) : (
              <>
                <Globe className="h-3 w-3 mr-1" />
                Online
              </>
            )}
          </Badge>
          {location.recurringPattern !== 'none' && (
            <Badge className={getRecurringColor(location.recurringPattern)}>
              <Calendar className="h-3 w-3 mr-1" />
              {location.recurringPattern}
            </Badge>
          )}
        </div>
      </div>

      {/* Map Thumbnail or Online Badge */}
      <div className="mb-4">
        {location.type === 'onsite' ? (
          <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
            {location.mapThumbnail && !imageError ? (
              <img
                src={location.mapThumbnail}
                alt={`Map of ${location.name}`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No map preview</p>
                </div>
              </div>
            )}
            {location.mapLink && (
              <div className="absolute top-2 right-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-6 w-6 p-0 bg-white/90 hover:bg-white"
                  onClick={handlePreviewMap}
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Globe className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <Badge className="bg-green-100 text-green-800">
                Online Session
              </Badge>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {location.name}
          </h3>
        </div>
        <div className="text-sm text-gray-600">
          <span>ID:</span> {location.id}
        </div>
        <div className="text-sm text-gray-600 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {location.address}
        </div>

        {location.type === 'online' && location.vendor && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Globe className="h-4 w-4" />
            <span>Platform: {location.vendor}</span>
          </div>
        )}

        {location.sessionUrl && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ExternalLink className="h-4 w-4" />
            <span className="truncate">Session URL available</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{location.timezone}</span>
          </div>
          {location.capacity && (
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{location.capacity} seats</span>
            </div>
          )}
        </div>

        {location.mapLink && (
          <div className="text-sm text-gray-600">
            <a
              href={location.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="truncate">View on Map</span>
            </a>
          </div>
        )}

        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Created: {format(location.createdAt, 'MMM dd, yyyy')}</span>
            <span>Updated: {format(location.lastUpdatedAt, 'MMM dd')}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        {!isDeleteMode ? (
          <div className="flex items-center justify-between">
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className="flex-1 mr-2 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              {canEdit ? 'Edit' : 'View'}
            </Button>

            <div className="flex space-x-1">
              {canEdit && (
                <Button
                  onClick={handleDuplicate}
                  variant="outline"
                  size="sm"
                  className="p-2"
                  title="Duplicate"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
              {location.type === 'onsite' && location.mapLink && (
                <Button
                  onClick={handlePreviewMap}
                  variant="outline"
                  size="sm"
                  className="p-2"
                  title="Preview on Map"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p
              className={`text-sm font-medium ${
                isSelectedForDeletion
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {isSelectedForDeletion
                ? 'Selected for deletion'
                : 'Click to select'}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}


'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { Card } from '@workspace/ui/components/ui/card'
import { Button } from '@workspace/ui/components/ui/button'
import { Badge } from '@workspace/ui/components/ui/badge'
import { cn } from '@workspace/ui/lib/utils'

interface ThumbnailOption {
  id: string
  url: string
  title: string
  category: 'office' | 'classroom' | 'modern' | 'outdoor' | 'tech' | 'coworking'
  description?: string
}

interface ThumbnailGalleryProps {
  selectedThumbnail?: string
  onThumbnailSelect: (thumbnailUrl: string) => void
  locationType?: 'onsite' | 'online'
  className?: string
}

// Predefined thumbnail options
const thumbnailOptions: ThumbnailOption[] = [
  // Office/Classroom spaces
  {
    id: 'office-1',
    url: 'https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Modern Office Space',
    category: 'office',
    description: 'Clean modern office environment'
  },
  {
    id: 'classroom-1',
    url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Traditional Classroom',
    category: 'classroom',
    description: 'Classic classroom setup'
  },
  {
    id: 'modern-1',
    url: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Modern Learning Space',
    category: 'modern',
    description: 'Contemporary learning environment'
  },
  {
    id: 'tech-1',
    url: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Tech Hub',
    category: 'tech',
    description: 'Technology-focused workspace'
  },
  {
    id: 'coworking-1',
    url: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Collaborative Space',
    category: 'coworking',
    description: 'Open collaborative environment'
  },
  {
    id: 'outdoor-1',
    url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Outdoor Learning',
    category: 'outdoor',
    description: 'Natural outdoor setting'
  },
  {
    id: 'office-2',
    url: 'https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Executive Office',
    category: 'office',
    description: 'Professional office space'
  },
  {
    id: 'classroom-2',
    url: 'https://images.pexels.com/photos/1181304/pexels-photo-1181304.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Workshop Room',
    category: 'classroom',
    description: 'Interactive workshop space'
  },
  {
    id: 'modern-2',
    url: 'https://images.pexels.com/photos/1181712/pexels-photo-1181712.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Minimal Space',
    category: 'modern',
    description: 'Minimalist design approach'
  },
  {
    id: 'tech-2',
    url: 'https://images.pexels.com/photos/1153213/pexels-photo-1153213.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Innovation Lab',
    category: 'tech',
    description: 'High-tech innovation space'
  },
  {
    id: 'coworking-2',
    url: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Team Space',
    category: 'coworking',
    description: 'Team collaboration area'
  },
  {
    id: 'outdoor-2',
    url: 'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg?auto=compress&cs=tinysrgb&w=400',
    title: 'Garden Learning',
    category: 'outdoor',
    description: 'Peaceful garden setting'
  }
]

// Category colors for badges
const categoryColors = {
  office: 'bg-blue-100 text-blue-800',
  classroom: 'bg-green-100 text-green-800',
  modern: 'bg-purple-100 text-purple-800',
  outdoor: 'bg-amber-100 text-amber-800',
  tech: 'bg-indigo-100 text-indigo-800',
  coworking: 'bg-orange-100 text-orange-800'
}

export function ThumbnailGallery({
  selectedThumbnail,
  onThumbnailSelect,
  locationType = 'onsite',
  className
}: ThumbnailGalleryProps) {
  // Filter thumbnails based on location type
  const filteredThumbnails =
    locationType === 'onsite'
      ? thumbnailOptions
      : thumbnailOptions.filter((thumb) => thumb.category !== 'outdoor') // Online locations might not need outdoor images

  // Group thumbnails by category
  const groupedThumbnails = filteredThumbnails.reduce(
    (acc, thumbnail) => {
      if (!acc[thumbnail.category]) {
        acc[thumbnail.category] = []
      }
      acc[thumbnail.category]!.push(thumbnail)
      return acc
    },
    {} as Record<string, ThumbnailOption[]>
  )

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">
          Choose from Gallery
        </h4>
        <Badge
          variant="outline"
          className="text-xs"
        >
          {filteredThumbnails.length} options
        </Badge>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {Object.entries(groupedThumbnails).map(([category, thumbnails]) => (
          <div
            key={category}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  'text-xs px-2 py-1',
                  categoryColors[category as keyof typeof categoryColors]
                )}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
              <div className="h-px bg-border flex-1" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {thumbnails.map((thumbnail) => (
                <Card
                  key={thumbnail.id}
                  className={cn(
                    'relative overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105',
                    'border-2',
                    selectedThumbnail === thumbnail.url
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  )}
                  onClick={() => onThumbnailSelect(thumbnail.url)}
                >
                  <div className="aspect-video relative">
                    <img
                      src={thumbnail.url}
                      alt={thumbnail.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Selected indicator */}
                    {selectedThumbnail === thumbnail.url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                    )}

                    {/* Overlay with title */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-xs font-medium truncate">
                        {thumbnail.title}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedThumbnail && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <div className="w-10 h-6 rounded overflow-hidden">
            <img
              src={selectedThumbnail}
              alt="Selected"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Selected Image</p>
            <p className="text-xs text-muted-foreground">
              {
                filteredThumbnails.find((t) => t.url === selectedThumbnail)
                  ?.title
              }
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onThumbnailSelect('')}
            className="text-xs"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  )
}


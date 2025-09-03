'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@workspace/ui/components/ui/sheet'
import { Button } from '@workspace/ui/components/ui/button'
import { Input } from '@workspace/ui/components/ui/input'
import { Textarea } from '@workspace/ui/components/ui/textarea'
import { Label } from '@workspace/ui/components/ui/label'
import { Badge } from '@workspace/ui/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import { Separator } from '@workspace/ui/components/ui/separator'
import { ImageUploadDropzone } from '@workspace/ui/components/ui/image-upload-dropzone'
import { ThumbnailGallery } from '@workspace/ui/components/ui/thumbnail-gallery'
import {
  RotateCcw,
  Save,
  X,
  MapPin,
  Globe,
  Clock,
  Users,
  Link,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import {
  Location,
  LocationType,
  RecurringPattern,
  useLocationsStore
} from '@/stores/locations-store'
import {
  uploadImage,
  deleteImage,
  createImagePreview,
  revokeImagePreview
} from '@/services/image-service'
import { generateLocationThumbnail } from '@/services/maps-service'

const timezones = [
  'UTC',
  'Africa/Cairo',
  'Europe/London',
  'Europe/Paris',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Dubai',
  'Asia/Riyadh'
]

const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['onsite', 'online']),
  address: z.string().min(1, 'Address is required'),
  mapLink: z.string().url('Must be a valid URL').or(z.literal('')),
  vendor: z.string().optional(),
  sessionUrl: z
    .string()
    .url('Must be a valid URL')
    .or(z.literal(''))
    .optional(),
  timezone: z.string().min(1, 'Timezone is required'),
  recurringPattern: z.enum(['none', 'daily', 'weekly', 'monthly']),
  capacity: z.number().min(1).optional(),
  uploadedImageUrl: z.string().optional(),
  useMapSnapshot: z.boolean().optional(),
  mapThumbnail: z.string().optional()
})

type LocationFormData = z.infer<typeof locationSchema>

export function LocationDrawer() {
  const {
    selectedLocation,
    isDrawerOpen,
    setDrawerOpen,
    setSelectedLocation,
    updateLocation,
    addLocation,
    isAddMode,
    closeDrawer,
    userRole,
    setImageUploadStatus,
    updateLocationImage,
    removeLocationImage
  } = useLocationsStore()

  const [originalData, setOriginalData] = useState<Location | null>(null)
  const [selectedThumbnail, setSelectedThumbnail] = useState<string>('')
  const [originalThumbnail, setOriginalThumbnail] = useState<string>('')

  // Image upload state
  const [uploadedImage, setUploadedImage] = useState<{
    file: File
    previewUrl: string
  } | null>(null)
  const [originalUploadedImage, setOriginalUploadedImage] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadError, setUploadError] = useState<string>('')
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const canEdit = userRole === 'admin' || userRole === 'editor'

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty }
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema)
  })

  const watchedValues = watch()

  // Custom dirty check that includes form changes, thumbnail changes, and image changes
  const hasImageChanged =
    uploadedImage !== null ||
    originalUploadedImage !== (selectedLocation?.uploadedImageUrl || '')
  const hasChanges =
    isDirty || selectedThumbnail !== originalThumbnail || hasImageChanged

  useEffect(() => {
    if (selectedLocation) {
      // Edit mode
      setOriginalData(selectedLocation)
      const originalThumbnailValue = selectedLocation.mapThumbnail || ''
      setSelectedThumbnail(originalThumbnailValue)
      setOriginalThumbnail(originalThumbnailValue)

      // Set uploaded image state
      const originalImageUrl = selectedLocation.uploadedImageUrl || ''
      setOriginalUploadedImage(originalImageUrl)
      setUploadedImage(null) // Reset current upload state

      reset({
        name: selectedLocation.name,
        type: selectedLocation.type,
        address: selectedLocation.address,
        mapLink: selectedLocation.mapLink,
        vendor: selectedLocation.vendor || '',
        sessionUrl: selectedLocation.sessionUrl || '',
        timezone: selectedLocation.timezone,
        recurringPattern: selectedLocation.recurringPattern,
        capacity: selectedLocation.capacity,
        uploadedImageUrl: selectedLocation.uploadedImageUrl,
        useMapSnapshot: selectedLocation.useMapSnapshot,
        mapThumbnail: selectedLocation.mapThumbnail
      })
    } else if (isAddMode) {
      // Add mode
      setOriginalData(null)
      setSelectedThumbnail('')
      setOriginalThumbnail('')
      setUploadedImage(null)
      setOriginalUploadedImage('')
      setUploadProgress(0)
      setUploadError('')
      setIsUploading(false)

      reset({
        name: '',
        type: 'onsite',
        address: '',
        mapLink: '',
        vendor: '',
        sessionUrl: '',
        timezone: 'UTC',
        recurringPattern: 'none',
        capacity: undefined,
        uploadedImageUrl: '',
        useMapSnapshot: false,
        mapThumbnail: ''
      })
    }
  }, [selectedLocation, isAddMode, reset])

  const onSubmit = async (data: LocationFormData) => {
    if (canEdit) {
      let finalImageUrl = originalUploadedImage

      // Handle image upload if there's a new image
      if (uploadedImage && !isUploading) {
        setIsUploading(true)
        setUploadError('')

        try {
          const uploadResult = await uploadImage(uploadedImage.file, {
            onProgress: (progress) => setUploadProgress(progress.percentage)
          })

          if (uploadResult.success && uploadResult.url) {
            finalImageUrl = uploadResult.url
          } else {
            setUploadError(uploadResult.error || 'Upload failed')
            setIsUploading(false)
            return
          }
        } catch (error) {
          setUploadError(
            'Upload failed: ' +
              (error instanceof Error ? error.message : 'Unknown error')
          )
          setIsUploading(false)
          return
        } finally {
          setIsUploading(false)
          setUploadProgress(0)
        }
      }

      // Include the selected thumbnail and uploaded image in the data
      const locationData = {
        ...data,
        mapThumbnail: selectedThumbnail || undefined,
        uploadedImageUrl: finalImageUrl || undefined,
        useMapSnapshot: data.useMapSnapshot || false
      }

      if (isAddMode) {
        addLocation(locationData)
      } else if (selectedLocation) {
        updateLocation(selectedLocation.id, locationData)
      }

      // Clean up preview URL
      if (uploadedImage?.previewUrl) {
        revokeImagePreview(uploadedImage.previewUrl)
      }

      closeDrawer()
    }
  }

  // Image upload handlers
  const handleImageSelect = (file: File) => {
    // Clear any existing upload error
    setUploadError('')

    // Create preview URL
    const previewUrl = createImagePreview(file)

    // Clean up previous preview URL if it exists
    if (uploadedImage?.previewUrl) {
      revokeImagePreview(uploadedImage.previewUrl)
    }

    // Set new uploaded image
    setUploadedImage({
      file,
      previewUrl
    })

    // Clear thumbnail selection when custom image is uploaded
    setSelectedThumbnail('')
  }

  const handleImageRemove = () => {
    if (uploadedImage?.previewUrl) {
      revokeImagePreview(uploadedImage.previewUrl)
    }

    setUploadedImage(null)
    setUploadError('')
    setUploadProgress(0)
  }

  const handleImageUpload = async (file: File) => {
    // This will be handled in onSubmit
    console.log('Image ready for upload:', file.name)
  }

  const handleClose = () => {
    // Clean up image preview URLs
    if (uploadedImage?.previewUrl) {
      revokeImagePreview(uploadedImage.previewUrl)
    }

    closeDrawer()
    setOriginalData(null)
  }

  const resetField = (fieldName: keyof LocationFormData) => {
    if (originalData) {
      setValue(fieldName, originalData[fieldName] as any)
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'onsite'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-green-100 text-green-800 border-green-200'
  }

  if (!isDrawerOpen || (!selectedLocation && !isAddMode)) return null

  return (
    <Sheet
      open={isDrawerOpen}
      onOpenChange={setDrawerOpen}
    >
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              {isAddMode ? (
                <MapPin className="h-8 w-8 text-blue-600" />
              ) : selectedLocation?.type === 'onsite' ? (
                <MapPin className="h-8 w-8 text-blue-600" />
              ) : (
                <Globe className="h-8 w-8 text-green-600" />
              )}
            </div>
            <div>
              <SheetTitle className="text-xl">
                {isAddMode ? 'Add New Location' : selectedLocation?.name}
              </SheetTitle>
              {!isAddMode && (
                <SheetDescription>
                  Location ID: {selectedLocation?.id}
                </SheetDescription>
              )}
              {!isAddMode && selectedLocation && (
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getTypeColor(selectedLocation.type)}>
                    {selectedLocation.type === 'onsite' ? 'Onsite' : 'Online'}
                  </Badge>
                  {selectedLocation.recurringPattern !== 'none' && (
                    <Badge variant="secondary">
                      <Calendar className="h-3 w-3 mr-1" />
                      {selectedLocation.recurringPattern}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <div className="flex space-x-2">
                <Input
                  id="name"
                  {...register('name')}
                  disabled={!canEdit}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {canEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => resetField('name')}
                    disabled={watchedValues.name === originalData?.name}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <div className="flex space-x-2">
                  <Select
                    value={watchedValues.type}
                    onValueChange={(value) =>
                      setValue('type', value as LocationType)
                    }
                    disabled={!canEdit}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onsite">Onsite</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                  {canEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => resetField('type')}
                      disabled={watchedValues.type === originalData?.type}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone *</Label>
                <div className="flex space-x-2">
                  <Select
                    value={watchedValues.timezone}
                    onValueChange={(value) => setValue('timezone', value)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger
                      className={errors.timezone ? 'border-red-500' : ''}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem
                          key={tz}
                          value={tz}
                        >
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {canEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => resetField('timezone')}
                      disabled={
                        watchedValues.timezone === originalData?.timezone
                      }
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <div className="flex space-x-2">
                <Input
                  id="address"
                  {...register('address')}
                  disabled={!canEdit}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {canEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => resetField('address')}
                    disabled={watchedValues.address === originalData?.address}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {errors.address && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mapLink">Map Link</Label>
              <div className="flex space-x-2">
                <Input
                  id="mapLink"
                  {...register('mapLink')}
                  disabled={!canEdit}
                  placeholder="https://maps.google.com/..."
                  className={errors.mapLink ? 'border-red-500' : ''}
                />
                {canEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => resetField('mapLink')}
                    disabled={watchedValues.mapLink === originalData?.mapLink}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {errors.mapLink && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.mapLink.message}
                </p>
              )}
            </div>
          </div>
          <Separator />
          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Location Image</h3>
            </div>

            <ImageUploadDropzone
              label="Upload custom image"
              placeholder="Drag and drop an image here, or click to browse"
              currentFile={
                uploadedImage?.file ||
                (selectedLocation?.uploadedImageUrl && !uploadedImage
                  ? selectedLocation.uploadedImageUrl
                  : undefined)
              }
              onFileSelect={handleImageSelect}
              onFileRemove={handleImageRemove}
              onUpload={handleImageUpload}
              uploadProgress={uploadProgress}
              error={uploadError}
              disabled={!canEdit || isUploading}
              isUploading={isUploading}
              showUploadButton={true}
            />

            {/* Map Snapshot Toggle for Onsite Locations */}
            {watchedValues.type === 'onsite' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Use map snapshot</p>
                      <p className="text-xs text-muted-foreground">
                        Generate a map image from the address
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant={
                      watchedValues.useMapSnapshot ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => {
                      setValue('useMapSnapshot', !watchedValues.useMapSnapshot)
                      if (!watchedValues.useMapSnapshot) {
                        // Clear uploaded image when enabling map snapshot
                        handleImageRemove()
                      }
                    }}
                    disabled={!canEdit}
                  >
                    {watchedValues.useMapSnapshot ? 'Enabled' : 'Enable'}
                  </Button>
                </div>

                {watchedValues.useMapSnapshot && watchedValues.address && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Map preview:
                    </p>
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={generateLocationThumbnail(
                          watchedValues.address,
                          'onsite'
                        )}
                        alt="Map preview"
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://via.placeholder.com/300x200/E5E7EB/6B7280?text=Map+Preview+Unavailable'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <ThumbnailGallery
              selectedThumbnail={selectedThumbnail}
              onThumbnailSelect={setSelectedThumbnail}
              locationType={watchedValues.type}
            />
          </div>
          {/* Online-specific fields */}
          {watchedValues.type === 'online' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">
                  Online Platform Details
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor">Platform/Vendor</Label>
                <div className="flex space-x-2">
                  <Input
                    id="vendor"
                    {...register('vendor')}
                    disabled={!canEdit}
                    placeholder="Zoom, Teams, Google Meet, etc."
                  />
                  {canEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => resetField('vendor')}
                      disabled={watchedValues.vendor === originalData?.vendor}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionUrl">Session URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="sessionUrl"
                    {...register('sessionUrl')}
                    disabled={!canEdit}
                    placeholder="https://zoom.us/j/..."
                    className={errors.sessionUrl ? 'border-red-500' : ''}
                  />
                  {canEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => resetField('sessionUrl')}
                      disabled={
                        watchedValues.sessionUrl === originalData?.sessionUrl
                      }
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {errors.sessionUrl && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.sessionUrl.message}
                  </p>
                )}
              </div>
            </div>
          )}
          <Separator />
          {/* Schedule & Capacity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Schedule & Capacity</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recurringPattern">Recurring Pattern</Label>
                <div className="flex space-x-2">
                  <Select
                    value={watchedValues.recurringPattern}
                    onValueChange={(value) =>
                      setValue('recurringPattern', value as RecurringPattern)
                    }
                    disabled={!canEdit}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  {canEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => resetField('recurringPattern')}
                      disabled={
                        watchedValues.recurringPattern ===
                        originalData?.recurringPattern
                      }
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <div className="flex space-x-2">
                  <Input
                    id="capacity"
                    type="number"
                    min={1}
                    {...register('capacity', { valueAsNumber: true })}
                    disabled={!canEdit}
                    placeholder="Max attendees"
                  />
                  {canEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => resetField('capacity')}
                      disabled={
                        watchedValues.capacity === originalData?.capacity
                      }
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Separator />
          {/* System Information */}
          {!isAddMode && selectedLocation && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">System Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <Label className="text-gray-500">Created At</Label>
                  <p className="font-medium">
                    {format(selectedLocation.createdAt, 'PPP')}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Last Updated</Label>
                  <p className="font-medium">
                    {format(selectedLocation.lastUpdatedAt, 'PPP')}
                  </p>
                </div>
              </div>
            </div>
          )}{' '}
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              <X className="h-4 w-4 mr-2" />
              {canEdit ? 'Cancel' : 'Close'}
            </Button>
            {canEdit && (
              <Button
                type="submit"
                disabled={!hasChanges}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isAddMode ? 'Add Location' : 'Update Location'}
              </Button>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}


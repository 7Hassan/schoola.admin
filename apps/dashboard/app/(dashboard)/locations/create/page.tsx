'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, Building, Phone, Clock, Users } from 'lucide-react'
import { Input } from '@workspace/ui/components/ui/input'
import { Label } from '@workspace/ui/components/ui/label'
import { Textarea } from '@workspace/ui/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import { Checkbox } from '@workspace/ui/components/ui/checkbox'
import {
  CreatePageLayout,
  CreateFormFooter,
  CreateFormSection
} from '@/components/shared'
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes'
import { useFormReset } from '@/hooks/use-form-reset'

const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  code: z.string().optional(),
  type: z.string().min(1, 'Location type is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1').optional(),
  description: z.string().optional(),
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  postalCode: z.string().min(1, 'ZIP/Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  website: z.string().url('Invalid website URL').optional(),
  operatingHours: z.string().optional(),
  status: z.enum(['active', 'under_construction', 'maintenance', 'inactive']),
  features: z.array(z.string()).optional(),
  manager: z.string().optional(),
  department: z.string().optional(),
  notes: z.string().optional()
})

type LocationFormData = z.infer<typeof locationSchema>

const defaultValues: LocationFormData = {
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

export default function LocationsCreatePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues
  })

  const watchedValues = watch()

  const { hasUnsavedChanges } = useUnsavedChanges({
    initialData: defaultValues,
    currentData: watchedValues
  })

  const { handleReset } = useFormReset({
    reset,
    defaultValues,
    onReset: () => console.log('Form reset')
  })

  const onSubmit = async (data: LocationFormData) => {
    try {
      setIsSubmitting(true)
      console.log('Creating location:', data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      router.push('/locations/management')
    } catch (error) {
      console.error('Error creating location:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/locations/management')
  }

  const availableFeatures = [
    'WiFi',
    'Projector',
    'Whiteboard',
    'Air Conditioning',
    'Audio System',
    'Accessible'
  ]

  return (
    <CreatePageLayout
      title="Create New Location"
      description="Add a new campus, building, or facility to your institution"
      backRoute="/locations/management"
      onReset={handleReset}
      isSubmitting={isSubmitting}
      hasUnsavedChanges={hasUnsavedChanges}
      actions={
        <CreateFormFooter
          onCancel={handleCancel}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          isValid={isValid}
          submitText="Create Location"
          showSaveAsDraft={true}
          onSaveAsDraft={() => console.log('Save as draft')}
        />
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Basic Information */}
        <CreateFormSection
          title="Basic Information"
          icon={Building}
          required
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Location Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Main Campus, Science Building"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Location Code</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="e.g., MC, SB, LIB"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Location Type *</Label>
              <Select
                value={watchedValues.type}
                onValueChange={(value) => setValue('type', value)}
              >
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="campus">Campus</SelectItem>
                  <SelectItem value="building">Building</SelectItem>
                  <SelectItem value="classroom">Classroom</SelectItem>
                  <SelectItem value="laboratory">Laboratory</SelectItem>
                  <SelectItem value="library">Library</SelectItem>
                  <SelectItem value="auditorium">Auditorium</SelectItem>
                  <SelectItem value="gymnasium">Gymnasium</SelectItem>
                  <SelectItem value="cafeteria">Cafeteria</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                {...register('capacity', { valueAsNumber: true })}
                placeholder="Maximum occupancy"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={3}
              placeholder="Describe the location, its purpose, and any special features..."
            />
          </div>
        </CreateFormSection>

        {/* Address Information */}
        <CreateFormSection
          title="Address Information"
          icon={MapPin}
          required
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="streetAddress">Street Address *</Label>
              <Input
                id="streetAddress"
                {...register('streetAddress')}
                placeholder="123 Education Street"
                className={errors.streetAddress ? 'border-red-500' : ''}
              />
              {errors.streetAddress && (
                <p className="text-sm text-red-500">
                  {errors.streetAddress.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="City name"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  {...register('state')}
                  placeholder="State or Province"
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="postalCode">ZIP/Postal Code *</Label>
                <Input
                  id="postalCode"
                  {...register('postalCode')}
                  placeholder="12345"
                  className={errors.postalCode ? 'border-red-500' : ''}
                />
                {errors.postalCode && (
                  <p className="text-sm text-red-500">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={watchedValues.country}
                  onValueChange={(value) => setValue('country', value)}
                >
                  <SelectTrigger
                    className={errors.country ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CreateFormSection>

        {/* Contact Information */}
        <CreateFormSection
          title="Contact Information"
          icon={Phone}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="location@school.edu"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              type="url"
              {...register('website')}
              placeholder="https://location.school.edu"
              className={errors.website ? 'border-red-500' : ''}
            />
            {errors.website && (
              <p className="text-sm text-red-500">{errors.website.message}</p>
            )}
          </div>
        </CreateFormSection>

        {/* Operational Information */}
        <CreateFormSection
          title="Operational Information"
          icon={Clock}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="operatingHours">Operating Hours</Label>
              <Select
                value={watchedValues.operatingHours}
                onValueChange={(value) => setValue('operatingHours', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24/7">24/7</SelectItem>
                  <SelectItem value="business">
                    Business Hours (8 AM - 5 PM)
                  </SelectItem>
                  <SelectItem value="academic">
                    Academic Hours (7 AM - 6 PM)
                  </SelectItem>
                  <SelectItem value="custom">Custom Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watchedValues.status}
                onValueChange={(
                  value:
                    | 'active'
                    | 'under_construction'
                    | 'maintenance'
                    | 'inactive'
                ) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="under_construction">
                    Under Construction
                  </SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Available Equipment/Features</Label>
            <div className="grid gap-2 md:grid-cols-3">
              {availableFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={feature}
                    checked={watchedValues.features?.includes(feature) || false}
                    onCheckedChange={(checked) => {
                      const currentFeatures = watchedValues.features || []
                      if (checked) {
                        setValue('features', [...currentFeatures, feature])
                      } else {
                        setValue(
                          'features',
                          currentFeatures.filter((f) => f !== feature)
                        )
                      }
                    }}
                  />
                  <Label
                    htmlFor={feature}
                    className="text-sm"
                  >
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CreateFormSection>

        {/* Management Information */}
        <CreateFormSection
          title="Management Information"
          icon={Users}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="manager">Location Manager</Label>
              <Input
                id="manager"
                {...register('manager')}
                placeholder="Manager's name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department/Division</Label>
              <Select
                value={watchedValues.department}
                onValueChange={(value) => setValue('department', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academics">Academics</SelectItem>
                  <SelectItem value="administration">Administration</SelectItem>
                  <SelectItem value="facilities">Facilities</SelectItem>
                  <SelectItem value="athletics">Athletics</SelectItem>
                  <SelectItem value="student_services">
                    Student Services
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Special Notes/Instructions</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              rows={3}
              placeholder="Any special access requirements, booking procedures, or other important information..."
            />
          </div>
        </CreateFormSection>
      </form>
    </CreatePageLayout>
  )
}


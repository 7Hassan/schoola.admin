'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  X,
  Save,
  User,
  BookOpen,
  Calendar,
  DollarSign,
  AlertCircle,
  RotateCcw,
  Loader2
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Input } from '@workspace/ui/components/ui/input'
import { Label } from '@workspace/ui/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@workspace/ui/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import { Checkbox } from '@workspace/ui/components/ui/checkbox'
import { Separator } from '@workspace/ui/components/ui/separator'
import { Avatar, AvatarFallback } from '@workspace/ui/components/ui/avatar'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Group, GroupStatus, useGroupsStore } from '@/stores/groups-store'
import { SessionTime } from '@/utils/date-utils'
import { SessionManager } from './session-manager'
import { SubscriptionManagementModal } from './subscription-management-modal'
import { TeacherManagementModal } from './teacher-management-modal'

const groupSchema = z.object({
  teachers: z.array(z.string()).min(1, 'At least one teacher is required'),
  courses: z
    .array(z.string())
    .min(1, 'A course is required')
    .max(1, 'Only one course can be selected'),
  capacityLimit: z
    .number()
    .min(1, 'Capacity must be at least 1')
    .max(100, 'Capacity cannot exceed 100'),
  currentEnrollment: z.number().min(0, 'Current enrollment cannot be negative'),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['active', 'completed', 'canceled']),
  sessions: z.array(z.any()).min(1, 'At least one session is required'),
  totalLectures: z.number().min(1, 'Total lectures must be at least 1'),
  currentLectureNumber: z.number().min(0, 'Current lecture cannot be negative'),
  upcomingLectureNumber: z
    .number()
    .min(1, 'Upcoming lecture must be at least 1')
})

type GroupFormData = z.infer<typeof groupSchema>

export function GroupDrawer() {
  const {
    isDrawerOpen,
    isAddMode,
    selectedGroup,
    teachers,
    courses,
    locations,
    groups,
    addGroup,
    updateGroup,
    closeDrawer
  } = useGroupsStore()

  const isEditing = !isAddMode && selectedGroup !== null
  const originalData = selectedGroup

  // Get the current group with updated subscriptions
  const currentGroup =
    isEditing && selectedGroup
      ? groups.find((g) => g.id === selectedGroup.id) || selectedGroup
      : selectedGroup

  const getDefaultFormValues = (): GroupFormData => ({
    teachers: [],
    courses: [],
    capacityLimit: 20,
    currentEnrollment: 0,
    location: '',
    status: 'active',
    sessions: [],
    totalLectures: 12,
    currentLectureNumber: 0,
    upcomingLectureNumber: 1
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting }
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: getDefaultFormValues()
  })

  const watchedValues = watch()

  // Load data when editing
  React.useEffect(() => {
    if (isEditing && currentGroup) {
      reset({
        teachers: currentGroup.teachers,
        courses: currentGroup.courses,
        capacityLimit: currentGroup.capacityLimit,
        currentEnrollment: currentGroup.currentEnrollment,
        location: currentGroup.location,
        status: currentGroup.status,
        sessions: currentGroup.sessions,
        totalLectures: currentGroup.totalLectures,
        currentLectureNumber: currentGroup.currentLectureNumber,
        upcomingLectureNumber: currentGroup.upcomingLectureNumber
      })
    } else {
      reset(getDefaultFormValues())
    }
  }, [isEditing, currentGroup, reset])

  const onSubmit = async (data: GroupFormData) => {
    try {
      if (isEditing && currentGroup) {
        updateGroup(currentGroup.id, data)
      } else {
        // For new groups, create with empty subscriptions array
        addGroup({
          ...data,
          subscriptions: [], // Empty subscriptions - will be managed separately
          price: { amount: 0, currency: 'egp' }, // Default price
          teacherAssignments: [] // Empty teacher assignments - will be managed separately
        })
      }
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleSessionsChange = (sessions: SessionTime[]) => {
    setValue('sessions', sessions)
  }

  // Generate group initials for avatar
  const getGroupInitials = () => {
    if (isEditing && selectedGroup?.name) {
      return selectedGroup.name.slice(0, 2).toUpperCase()
    }
    return 'GR'
  }

  return (
    <Sheet
      open={isDrawerOpen}
      onOpenChange={closeDrawer}
    >
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-600 text-white">
                {getGroupInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle>
                {isEditing ? 'Edit Group' : 'Create New Group'}
              </SheetTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant={
                    watchedValues.status === 'active' ? 'default' : 'secondary'
                  }
                >
                  {watchedValues.status || 'active'}
                </Badge>
              </div>
            </div>
          </div>
          <SheetDescription>
            {isEditing
              ? 'Update group information and settings.'
              : 'Create a new group with teachers, courses, and schedule.'}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 mt-6"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacityLimit">Capacity Limit *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="capacityLimit"
                    type="number"
                    min="1"
                    max="100"
                    {...register('capacityLimit', { valueAsNumber: true })}
                    className={errors.capacityLimit ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setValue(
                        'capacityLimit',
                        originalData?.capacityLimit ||
                          getDefaultFormValues().capacityLimit
                      )
                    }
                    disabled={
                      watchedValues.capacityLimit ===
                      (originalData?.capacityLimit ||
                        getDefaultFormValues().capacityLimit)
                    }
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                {errors.capacityLimit && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.capacityLimit.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentEnrollment">Current Enrollment</Label>
                <div className="flex space-x-2">
                  <Input
                    id="currentEnrollment"
                    type="number"
                    min="0"
                    max={watchedValues.capacityLimit || 100}
                    {...register('currentEnrollment', { valueAsNumber: true })}
                    className={errors.currentEnrollment ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setValue(
                        'currentEnrollment',
                        originalData?.currentEnrollment ||
                          getDefaultFormValues().currentEnrollment
                      )
                    }
                    disabled={
                      watchedValues.currentEnrollment ===
                      (originalData?.currentEnrollment ||
                        getDefaultFormValues().currentEnrollment)
                    }
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                {errors.currentEnrollment && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.currentEnrollment.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <div className="flex space-x-2">
                <Select
                  value={watchedValues.status}
                  onValueChange={(value: GroupStatus) =>
                    setValue('status', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setValue(
                      'status',
                      originalData?.status || getDefaultFormValues().status
                    )
                  }
                  disabled={
                    watchedValues.status ===
                    (originalData?.status || getDefaultFormValues().status)
                  }
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="flex space-x-2">
                <Select
                  value={watchedValues.location}
                  onValueChange={(value: string) => setValue('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem
                        key={location.id}
                        value={location.id}
                      >
                        {location.name} ({location.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setValue(
                      'location',
                      originalData?.location || getDefaultFormValues().location
                    )
                  }
                  disabled={
                    watchedValues.location ===
                    (originalData?.location || getDefaultFormValues().location)
                  }
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              {errors.location && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Teachers Management */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Teachers</h3>
            </div>

            <div className="space-y-3">
              {/* Selected Teachers Display */}
              <div className="flex flex-wrap gap-2">
                {watchedValues.teachers && watchedValues.teachers.length > 0 ? (
                  watchedValues.teachers.map((teacherId) => {
                    const teacher = teachers.find((t) => t.id === teacherId)
                    return (
                      <Badge
                        key={teacherId}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {teacher?.name || 'Unknown Teacher'}
                      </Badge>
                    )
                  })
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No teachers selected
                  </p>
                )}
              </div>

              {/* Teacher Management Button */}
              <TeacherManagementModal
                selectedTeachers={watchedValues.teachers || []}
                totalLectures={watchedValues.totalLectures || 12}
                currentLectureNumber={watchedValues.currentLectureNumber || 0}
                upcomingLectureNumber={watchedValues.upcomingLectureNumber || 1}
                onTeachersChange={(teachers) => setValue('teachers', teachers)}
                group={currentGroup || undefined}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  <User className="h-4 w-4 mr-2" />
                  {watchedValues.teachers && watchedValues.teachers.length > 0
                    ? 'Manage Teachers & Assignments'
                    : 'Add Teachers'}
                </Button>
              </TeacherManagementModal>

              {errors.teachers && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.teachers.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Course Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Course</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <div className="flex space-x-2">
                  <Select
                    value={watchedValues.courses?.[0] || ''}
                    onValueChange={(value: string) =>
                      setValue('courses', value ? [value] : [])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem
                          key={course.id}
                          value={course.id}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{course.name}</span>
                            <span className="text-xs text-gray-500">
                              {course.level} • {course.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setValue(
                        'courses',
                        originalData?.courses || getDefaultFormValues().courses
                      )
                    }
                    disabled={
                      JSON.stringify(watchedValues.courses) ===
                      JSON.stringify(
                        originalData?.courses || getDefaultFormValues().courses
                      )
                    }
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                {errors.courses && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.courses.message}
                  </p>
                )}
              </div>

              {/* Selected Course Display */}
              {watchedValues.courses?.[0] && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      {(() => {
                        const selectedCourse = courses.find(
                          (c) => c.id === watchedValues.courses?.[0]
                        )
                        return selectedCourse ? (
                          <div>
                            <h4 className="font-medium text-sm">
                              {selectedCourse.name}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {selectedCourse.level} •{' '}
                              {selectedCourse.description}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Course not found
                          </span>
                        )
                      })()}
                    </div>
                    <Badge variant="outline">{watchedValues.courses[0]}</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Lectures */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Lectures</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalLectures">Total Lectures *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="totalLectures"
                    type="number"
                    min="1"
                    {...register('totalLectures', { valueAsNumber: true })}
                    className={errors.totalLectures ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setValue(
                        'totalLectures',
                        originalData?.totalLectures ||
                          getDefaultFormValues().totalLectures
                      )
                    }
                    disabled={
                      watchedValues.totalLectures ===
                      (originalData?.totalLectures ||
                        getDefaultFormValues().totalLectures)
                    }
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                {errors.totalLectures && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.totalLectures.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentLectureNumber">Current Lecture</Label>
                <div className="flex space-x-2">
                  <Input
                    id="currentLectureNumber"
                    type="number"
                    min="0"
                    max={watchedValues.totalLectures || 100}
                    {...register('currentLectureNumber', {
                      valueAsNumber: true
                    })}
                    className={
                      errors.currentLectureNumber ? 'border-red-500' : ''
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setValue(
                        'currentLectureNumber',
                        originalData?.currentLectureNumber ||
                          getDefaultFormValues().currentLectureNumber
                      )
                    }
                    disabled={
                      watchedValues.currentLectureNumber ===
                      (originalData?.currentLectureNumber ||
                        getDefaultFormValues().currentLectureNumber)
                    }
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                {errors.currentLectureNumber && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.currentLectureNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="upcomingLectureNumber">Upcoming Lecture</Label>
                <div className="flex space-x-2">
                  <Input
                    id="upcomingLectureNumber"
                    type="number"
                    min="1"
                    max={watchedValues.totalLectures || 100}
                    {...register('upcomingLectureNumber', {
                      valueAsNumber: true
                    })}
                    className={
                      errors.upcomingLectureNumber ? 'border-red-500' : ''
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setValue(
                        'upcomingLectureNumber',
                        originalData?.upcomingLectureNumber ||
                          getDefaultFormValues().upcomingLectureNumber
                      )
                    }
                    disabled={
                      watchedValues.upcomingLectureNumber ===
                      (originalData?.upcomingLectureNumber ||
                        getDefaultFormValues().upcomingLectureNumber)
                    }
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                {errors.upcomingLectureNumber && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.upcomingLectureNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Sessions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Sessions</h3>
            </div>

            <div className="space-y-2">
              <SessionManager
                groupId={currentGroup?.id || 'new-group'}
                initialSessions={watchedValues.sessions || []}
                onSessionsChange={handleSessionsChange}
              />
              {errors.sessions && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.sessions.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Subscriptions Management */}
          {isEditing && currentGroup ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Subscriptions</h3>
              </div>

              <div className="space-y-3">
                {currentGroup.subscriptions &&
                currentGroup.subscriptions.length > 0 ? (
                  <div className="space-y-3">
                    {currentGroup.subscriptions.map((subscription, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                subscription.type === 'monthly'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {subscription.type === 'monthly'
                                ? 'Monthly'
                                : 'Level'}
                            </Badge>
                            <span className="text-sm font-medium">
                              {subscription.cost.amount}{' '}
                              {subscription.cost.currency.toUpperCase()}
                            </span>
                          </div>
                          {subscription.type === 'level' && (
                            <p className="text-sm text-gray-600">
                              {subscription.numberOfLecturesIncluded} lectures
                              included
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No subscriptions configured</p>
                  </div>
                )}

                <SubscriptionManagementModal
                  groupId={currentGroup.id}
                  groupName={currentGroup.name}
                  totalLectures={currentGroup.totalLectures}
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Manage Subscriptions
                  </Button>
                </SubscriptionManagementModal>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Subscriptions</h3>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">
                      Subscription Management
                    </p>
                    <p className="text-sm text-blue-700">
                      After creating the group, you can add monthly and level
                      subscriptions separately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={closeDrawer}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {!isSubmitting && <Save className="h-4 w-4 mr-2" />}
              {isSubmitting
                ? 'Saving...'
                : isEditing
                  ? 'Update Group'
                  : 'Create Group'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}


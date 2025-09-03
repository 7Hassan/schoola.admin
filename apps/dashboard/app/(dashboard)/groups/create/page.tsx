'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Save,
  User,
  BookOpen,
  Calendar,
  MapPin,
  DollarSign,
  AlertCircle,
  Loader2,
  CheckCircle,
  Users,
  Search,
  Plus,
  X,
  Settings
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Input } from '@workspace/ui/components/ui/input'
import { Label } from '@workspace/ui/components/ui/label'
import { Card } from '@workspace/ui/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Alert, AlertDescription } from '@workspace/ui/components/ui/alert'
import {
  CreatePageLayout,
  CreateFormFooter,
  CreateFormSection
} from '@/components/shared'
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes'
import { useFormReset } from '@/hooks/use-form-reset'
import { useGroupsStore } from '@/stores/groups-store'
import { useStudentsStore } from '@/stores/students-store'
import { SessionTime } from '@/utils/date-utils'
import { SessionManager } from '@/components/groups/session-manager'
import { TeacherManagementModal } from '@/components/groups/teacher-management-modal'

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
    .min(1, 'Upcoming lecture must be at least 1'),
  selectedStudents: z.array(z.string()).optional(),
  subscriptions: z
    .array(
      z.object({
        type: z.enum(['monthly', 'level']),
        cost: z.object({
          amount: z.number().min(0, 'Amount must be positive'),
          currency: z.enum(['egp', 'usd'])
        }),
        numberOfLecturesIncluded: z
          .number()
          .min(1, 'Must include at least 1 lecture')
      })
    )
    .optional()
})

type GroupFormData = z.infer<typeof groupSchema>

const defaultValues: GroupFormData = {
  teachers: [],
  courses: [],
  capacityLimit: 20,
  currentEnrollment: 0,
  location: '',
  status: 'active',
  sessions: [],
  totalLectures: 12,
  currentLectureNumber: 0,
  upcomingLectureNumber: 1,
  selectedStudents: [],
  subscriptions: []
}

export default function GroupsCreatePage() {
  const router = useRouter()
  const { teachers, courses, locations, addGroup } = useGroupsStore()
  const { students } = useStudentsStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [studentSearchQuery, setStudentSearchQuery] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
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
    onReset: () => {
      setStudentSearchQuery('')
      console.log('Group form reset')
    }
  })

  const onSubmit = async (data: GroupFormData) => {
    try {
      setIsSubmitting(true)

      // Create the group with all the data we've collected
      addGroup({
        ...data,
        currentEnrollment: data.selectedStudents?.length || 0,
        subscriptions:
          data.subscriptions?.map((sub) => ({
            ...sub,
            id: crypto.randomUUID()
          })) || [],
        price: { amount: 0, currency: 'egp' },
        teacherAssignments: []
      })

      setSubmitSuccess(true)

      // Redirect to groups management after a short delay
      setTimeout(() => {
        router.push('/groups/management')
      }, 2000)
    } catch (error) {
      console.error('Error creating group:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/groups/management')
  }

  const handleSessionsChange = (sessions: SessionTime[]) => {
    setValue('sessions', sessions)
  }

  // Helper functions for subscription management
  const addSubscription = (type: 'monthly' | 'level') => {
    const currentSubs = watchedValues.subscriptions || []
    if (!currentSubs.some((sub) => sub.type === type)) {
      const newSub = {
        type,
        cost: {
          amount: type === 'monthly' ? 500 : 1000,
          currency: 'egp' as const
        },
        numberOfLecturesIncluded: type === 'monthly' ? 4 : 12
      }
      setValue('subscriptions', [...currentSubs, newSub])
    }
  }

  const removeSubscription = (index: number) => {
    const currentSubs = watchedValues.subscriptions || []
    const newSubs = currentSubs.filter((_, i) => i !== index)
    setValue('subscriptions', newSubs)
  }

  const updateSubscription = (index: number, field: string, value: any) => {
    const currentSubs = watchedValues.subscriptions || []
    const newSubs = [...currentSubs]
    if (newSubs[index]) {
      if (field === 'cost.amount') {
        newSubs[index] = {
          ...newSubs[index],
          cost: {
            ...newSubs[index].cost,
            amount: value
          }
        }
      } else if (field === 'cost.currency') {
        newSubs[index] = {
          ...newSubs[index],
          cost: {
            ...newSubs[index].cost,
            currency: value
          }
        }
      } else {
        newSubs[index] = {
          ...newSubs[index],
          [field]: value
        }
      }
      setValue('subscriptions', newSubs)
    }
  }

  // Helper functions for student management
  const addStudent = (studentId: string) => {
    const currentSelected = watchedValues.selectedStudents || []
    if (
      !currentSelected.includes(studentId) &&
      currentSelected.length < watchedValues.capacityLimit
    ) {
      setValue('selectedStudents', [...currentSelected, studentId])
    }
  }

  const removeStudent = (studentId: string) => {
    const currentSelected = watchedValues.selectedStudents || []
    setValue(
      'selectedStudents',
      currentSelected.filter((id) => id !== studentId)
    )
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Group Created Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            Your new group has been created and you'll be redirected to the
            management page.
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <CreatePageLayout
      title="Create New Group"
      description="Set up a new group with teachers, courses, and schedule"
      backRoute="/groups/management"
      onReset={handleReset}
      isSubmitting={isSubmitting}
      hasUnsavedChanges={hasUnsavedChanges}
      actions={
        <CreateFormFooter
          onCancel={handleCancel}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          isValid={isValid}
          submitText="Create Group"
          showSaveAsDraft={false}
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
          icon={Settings}
          required
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacityLimit">Capacity Limit *</Label>
              <Input
                id="capacityLimit"
                type="number"
                min="1"
                max="100"
                {...register('capacityLimit', { valueAsNumber: true })}
                className={errors.capacityLimit ? 'border-red-500' : ''}
              />
              {errors.capacityLimit && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.capacityLimit.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentEnrollment">Current Enrollment</Label>
              <Input
                id="currentEnrollment"
                type="number"
                min="0"
                max={watchedValues.capacityLimit || 100}
                value={watchedValues.selectedStudents?.length || 0}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-600">
                Auto-calculated from selected students below
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={watchedValues.status}
                onValueChange={(value: 'active' | 'completed' | 'canceled') =>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
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
              {errors.location && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>
        </CreateFormSection>

        {/* Teachers Management */}
        <CreateFormSection
          title="Teachers"
          icon={User}
          required
        >
          <div className="space-y-4">
            {/* Selected Teachers Display */}
            <div className="flex flex-wrap gap-2">
              {(watchedValues.teachers?.length ?? 0) > 0 ? (
                watchedValues.teachers?.map((teacherId) => {
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
            >
              <Button
                type="button"
                variant="outline"
                className="w-full"
              >
                <User className="h-4 w-4 mr-2" />
                {(watchedValues.teachers?.length ?? 0) > 0
                  ? 'Manage Teachers & Assignments'
                  : 'Add Teachers'}
              </Button>
            </TeacherManagementModal>

            {errors.teachers && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.teachers.message}</AlertDescription>
              </Alert>
            )}
          </div>
        </CreateFormSection>

        {/* Course Selection */}
        <CreateFormSection
          title="Course"
          icon={BookOpen}
          required
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course">Course *</Label>
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
        </CreateFormSection>

        {/* Lectures Configuration */}
        <CreateFormSection
          title="Lectures"
          icon={BookOpen}
          required
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalLectures">Total Lectures *</Label>
              <Input
                id="totalLectures"
                type="number"
                min="1"
                {...register('totalLectures', { valueAsNumber: true })}
                className={errors.totalLectures ? 'border-red-500' : ''}
              />
              {errors.totalLectures && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.totalLectures.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentLectureNumber">Current Lecture</Label>
              <Input
                id="currentLectureNumber"
                type="number"
                min="0"
                max={watchedValues.totalLectures || 100}
                {...register('currentLectureNumber', { valueAsNumber: true })}
                className={errors.currentLectureNumber ? 'border-red-500' : ''}
              />
              {errors.currentLectureNumber && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.currentLectureNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="upcomingLectureNumber">Upcoming Lecture</Label>
              <Input
                id="upcomingLectureNumber"
                type="number"
                min="1"
                max={watchedValues.totalLectures || 100}
                {...register('upcomingLectureNumber', { valueAsNumber: true })}
                className={errors.upcomingLectureNumber ? 'border-red-500' : ''}
              />
              {errors.upcomingLectureNumber && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.upcomingLectureNumber.message}
                </p>
              )}
            </div>
          </div>
        </CreateFormSection>

        {/* Sessions */}
        <CreateFormSection
          title="Sessions"
          icon={Calendar}
          required
        >
          <div className="space-y-2">
            <SessionManager
              groupId="new-group"
              initialSessions={watchedValues.sessions || []}
              onSessionsChange={handleSessionsChange}
            />
            {errors.sessions && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.sessions.message}</AlertDescription>
              </Alert>
            )}
          </div>
        </CreateFormSection>

        {/* Subscriptions & Pricing */}
        <CreateFormSection
          title="Subscriptions & Pricing"
          icon={DollarSign}
        >
          <div className="space-y-4">
            {/* Current Subscriptions */}
            <div>
              <Label className="text-sm font-medium">
                Current Subscriptions
              </Label>
              <div className="mt-2 space-y-2">
                {(watchedValues.subscriptions?.length ?? 0) > 0 ? (
                  watchedValues.subscriptions?.map((subscription, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant={
                            subscription.type === 'monthly'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {subscription.type}
                        </Badge>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              min="0"
                              value={subscription.cost.amount}
                              onChange={(e) =>
                                updateSubscription(
                                  index,
                                  'cost.amount',
                                  Number(e.target.value)
                                )
                              }
                              className="w-20 h-8 text-sm"
                            />
                            <Select
                              value={subscription.cost.currency}
                              onValueChange={(currency: 'egp' | 'usd') =>
                                updateSubscription(
                                  index,
                                  'cost.currency',
                                  currency
                                )
                              }
                            >
                              <SelectTrigger className="w-20 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="egp">EGP</SelectItem>
                                <SelectItem value="usd">USD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              min="1"
                              value={subscription.numberOfLecturesIncluded}
                              onChange={(e) =>
                                updateSubscription(
                                  index,
                                  'numberOfLecturesIncluded',
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 h-8 text-sm"
                            />
                            <span className="text-xs text-gray-600">
                              lectures
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubscription(index)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No subscriptions added
                  </p>
                )}
              </div>
            </div>

            {/* Add New Subscription */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium">Add Subscription</Label>
              <div className="mt-2 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSubscription('monthly')}
                    disabled={watchedValues.subscriptions?.some(
                      (s) => s.type === 'monthly'
                    )}
                    className="w-full justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Monthly Subscription
                    {watchedValues.subscriptions?.some(
                      (s) => s.type === 'monthly'
                    ) && <span className="ml-2 text-xs">(Already added)</span>}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSubscription('level')}
                    disabled={watchedValues.subscriptions?.some(
                      (s) => s.type === 'level'
                    )}
                    className="w-full justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Level Subscription
                    {watchedValues.subscriptions?.some(
                      (s) => s.type === 'level'
                    ) && <span className="ml-2 text-xs">(Already added)</span>}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                You can add up to one monthly and one level subscription. Use
                the input fields above to customize pricing and lecture counts.
              </p>
            </div>
          </div>
        </CreateFormSection>

        {/* Students & Enrollment */}
        <CreateFormSection
          title="Students & Enrollment"
          icon={Users}
        >
          <div className="space-y-4">
            {/* Selected Students Count */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Selected Students:{' '}
                  {watchedValues.selectedStudents?.length || 0}
                </p>
                <p className="text-xs text-blue-700">
                  Capacity: {watchedValues.selectedStudents?.length || 0} /{' '}
                  {watchedValues.capacityLimit}
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-blue-700 border-blue-300"
              >
                {Math.round(
                  ((watchedValues.selectedStudents?.length || 0) /
                    watchedValues.capacityLimit) *
                    100
                )}
                % Full
              </Badge>
            </div>

            {/* Student Search */}
            <div className="space-y-2">
              <Label htmlFor="studentSearch">Search Students</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="studentSearch"
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Selected Students Display */}
            {(watchedValues.selectedStudents?.length ?? 0) > 0 && (
              <div>
                <Label className="text-sm font-medium">Selected Students</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {watchedValues.selectedStudents?.map((studentId) => {
                    const student = students.find((s) => s.id === studentId)
                    return (
                      <div
                        key={studentId}
                        className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1"
                      >
                        <span className="text-sm">
                          {student?.name || 'Unknown Student'}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStudent(studentId)}
                          className="p-0 w-4 h-4"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Available Students */}
            <div>
              <Label className="text-sm font-medium">Available Students</Label>
              <div className="mt-2 max-h-64 overflow-y-auto border rounded-lg">
                {students
                  .filter((student) => {
                    // Filter out already selected students
                    if (watchedValues.selectedStudents?.includes(student.id))
                      return false

                    // Apply search filter
                    if (studentSearchQuery) {
                      const query = studentSearchQuery.toLowerCase()
                      return (
                        student.name.toLowerCase().includes(query) ||
                        student.email.toLowerCase().includes(query) ||
                        student.parentPhone.includes(query)
                      )
                    }
                    return true
                  })
                  .slice(0, 20) // Limit to 20 results for performance
                  .map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-gray-600">
                            {student.email} • {student.parentPhone}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              variant={
                                student.status === 'Active'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className="text-xs"
                            >
                              {student.status}
                            </Badge>
                            {student.paid && (
                              <Badge
                                variant="outline"
                                className="text-xs text-green-600 border-green-300"
                              >
                                Paid
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addStudent(student.id)}
                        disabled={
                          (watchedValues.selectedStudents?.length || 0) >=
                          watchedValues.capacityLimit
                        }
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}

                {students.filter((student) => {
                  if (watchedValues.selectedStudents?.includes(student.id))
                    return false
                  if (studentSearchQuery) {
                    const query = studentSearchQuery.toLowerCase()
                    return (
                      student.name.toLowerCase().includes(query) ||
                      student.email.toLowerCase().includes(query) ||
                      student.parentPhone.includes(query)
                    )
                  }
                  return true
                }).length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No students found</p>
                    {studentSearchQuery && (
                      <p className="text-xs mt-1">
                        Try adjusting your search query
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CreateFormSection>
      </form>
    </CreatePageLayout>
  )
}


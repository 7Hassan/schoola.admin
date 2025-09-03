'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  BookOpen,
  Calendar,
  Users,
  Clock,
  MapPin,
  Plus,
  X,
  Search,
  User,
  GraduationCap
} from 'lucide-react'
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
import {
  CreatePageLayout,
  CreateFormFooter,
  CreateFormSection
} from '@/components/shared'
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes'
import { useFormReset } from '@/hooks/use-form-reset'

const courseSchema = z.object({
  // Basic Information
  name: z.string().min(1, 'Course name is required'),
  code: z.string().min(1, 'Course code is required'),
  subjectCategory: z.string().min(1, 'Subject category is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  creditHours: z.number().min(0).optional(),
  description: z.string().min(1, 'Course description is required'),

  // Course Details
  courseType: z.string(),
  difficultyLevel: z.string(),
  maxStudents: z.number().min(1).optional(),
  minStudents: z.number().min(1).optional(),
  duration: z.number().min(1).optional(),

  // Prerequisites
  prerequisites: z.array(z.string()).optional(),

  // Schedule
  academicTerm: z.string().optional(),
  meetingPattern: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),

  // Instructors
  instructors: z.array(z.string()).optional(),

  // Materials
  textbooks: z.string().optional(),
  additionalMaterials: z.string().optional(),
  onlineResources: z.string().optional()
})

type CourseFormData = z.infer<typeof courseSchema>

const defaultValues: CourseFormData = {
  name: '',
  code: '',
  subjectCategory: '',
  gradeLevel: '',
  creditHours: undefined,
  description: '',
  courseType: 'core',
  difficultyLevel: 'intermediate',
  maxStudents: undefined,
  minStudents: undefined,
  duration: undefined,
  prerequisites: [],
  academicTerm: '',
  meetingPattern: '',
  startTime: '',
  endTime: '',
  location: '',
  instructors: [],
  textbooks: '',
  additionalMaterials: '',
  onlineResources: ''
}

export default function CoursesCreatePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
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
    onReset: () => console.log('Course form reset')
  })

  // Mock data
  const availableTeachers = [
    {
      id: '1',
      name: 'Dr. Alice Cooper',
      subject: 'Mathematics',
      email: 'alice.cooper@school.edu'
    },
    {
      id: '2',
      name: 'Mr. Bob Johnson',
      subject: 'English',
      email: 'bob.johnson@school.edu'
    },
    {
      id: '3',
      name: 'Ms. Carol Davis',
      subject: 'Science',
      email: 'carol.davis@school.edu'
    }
  ]

  const prerequisiteCourses = [
    { id: '1', name: 'Algebra I', code: 'MATH-100' },
    { id: '2', name: 'Geometry', code: 'MATH-110' },
    { id: '3', name: 'English I', code: 'ENG-100' }
  ]

  const onSubmit = async (data: CourseFormData) => {
    try {
      setIsSubmitting(true)
      console.log('Creating course:', data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      router.push('/courses/management')
    } catch (error) {
      console.error('Error creating course:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/courses/management')
  }

  // Helper functions for prerequisites and instructors
  const addPrerequisite = (courseId: string) => {
    const currentPrereqs = watchedValues.prerequisites || []
    if (!currentPrereqs.includes(courseId)) {
      setValue('prerequisites', [...currentPrereqs, courseId])
    }
  }

  const removePrerequisite = (courseId: string) => {
    const currentPrereqs = watchedValues.prerequisites || []
    setValue(
      'prerequisites',
      currentPrereqs.filter((id) => id !== courseId)
    )
  }

  const addInstructor = (instructorId: string) => {
    const currentInstructors = watchedValues.instructors || []
    if (!currentInstructors.includes(instructorId)) {
      setValue('instructors', [...currentInstructors, instructorId])
    }
  }

  const removeInstructor = (instructorId: string) => {
    const currentInstructors = watchedValues.instructors || []
    setValue(
      'instructors',
      currentInstructors.filter((id) => id !== instructorId)
    )
  }

  return (
    <CreatePageLayout
      title="Create New Course"
      description="Set up a new course or subject with curriculum, instructors, and schedule"
      backRoute="/courses/management"
      onReset={handleReset}
      isSubmitting={isSubmitting}
      hasUnsavedChanges={hasUnsavedChanges}
      actions={
        <CreateFormFooter
          onCancel={handleCancel}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          isValid={isValid}
          submitText="Create Course"
          showSaveAsDraft={true}
          onSaveAsDraft={() => console.log('Save course as draft')}
        />
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Basic Course Information */}
        <CreateFormSection
          title="Course Information"
          icon={BookOpen}
          required
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Advanced Mathematics, English Literature"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="e.g., MATH-201, ENG-150"
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="subjectCategory">Subject Category *</Label>
              <Select
                value={watchedValues.subjectCategory}
                onValueChange={(value) => setValue('subjectCategory', value)}
              >
                <SelectTrigger
                  className={errors.subjectCategory ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="english">English/Language Arts</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="history">
                    History/Social Studies
                  </SelectItem>
                  <SelectItem value="foreign_language">
                    Foreign Language
                  </SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="physical_education">
                    Physical Education
                  </SelectItem>
                  <SelectItem value="computer_science">
                    Computer Science
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.subjectCategory && (
                <p className="text-sm text-red-500">
                  {errors.subjectCategory.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeLevel">Grade Level *</Label>
              <Select
                value={watchedValues.gradeLevel}
                onValueChange={(value) => setValue('gradeLevel', value)}
              >
                <SelectTrigger
                  className={errors.gradeLevel ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9">9th Grade</SelectItem>
                  <SelectItem value="10">10th Grade</SelectItem>
                  <SelectItem value="11">11th Grade</SelectItem>
                  <SelectItem value="12">12th Grade</SelectItem>
                  <SelectItem value="mixed">Mixed Grades</SelectItem>
                </SelectContent>
              </Select>
              {errors.gradeLevel && (
                <p className="text-sm text-red-500">
                  {errors.gradeLevel.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditHours">Credit Hours</Label>
              <Input
                id="creditHours"
                type="number"
                step="0.5"
                {...register('creditHours', { valueAsNumber: true })}
                placeholder="e.g., 1.0, 0.5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Course Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={4}
              placeholder="Provide a detailed description of the course content, objectives, and learning outcomes..."
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </CreateFormSection>

        {/* Course Details */}
        <CreateFormSection
          title="Course Details"
          icon={GraduationCap}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="courseType">Course Type</Label>
              <Select
                value={watchedValues.courseType}
                onValueChange={(value) => setValue('courseType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core/Required</SelectItem>
                  <SelectItem value="elective">Elective</SelectItem>
                  <SelectItem value="advanced">
                    Advanced Placement (AP)
                  </SelectItem>
                  <SelectItem value="honors">Honors</SelectItem>
                  <SelectItem value="remedial">Remedial</SelectItem>
                  <SelectItem value="enrichment">Enrichment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficultyLevel">Difficulty Level</Label>
              <Select
                value={watchedValues.difficultyLevel}
                onValueChange={(value) => setValue('difficultyLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="maxStudents">Maximum Students</Label>
              <Input
                id="maxStudents"
                type="number"
                {...register('maxStudents', { valueAsNumber: true })}
                placeholder="e.g., 25, 30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStudents">Minimum Students</Label>
              <Input
                id="minStudents"
                type="number"
                {...register('minStudents', { valueAsNumber: true })}
                placeholder="e.g., 10, 15"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (weeks)</Label>
              <Input
                id="duration"
                type="number"
                {...register('duration', { valueAsNumber: true })}
                placeholder="e.g., 36, 18"
              />
            </div>
          </div>
        </CreateFormSection>

        {/* Prerequisites */}
        <CreateFormSection
          title="Prerequisites"
          icon={BookOpen}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Required Prerequisites</Label>
              <span className="text-sm text-gray-500">
                {watchedValues.prerequisites?.length || 0} selected
              </span>
            </div>

            {/* Selected Prerequisites */}
            {(watchedValues.prerequisites?.length ?? 0) > 0 && (
              <div className="space-y-2">
                {(watchedValues.prerequisites ?? []).map((prereqId) => {
                  const course = prerequisiteCourses.find(
                    (c) => c.id === prereqId
                  )
                  return course ? (
                    <div
                      key={prereqId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {course.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {course.code} • Grade: C or better
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePrerequisite(prereqId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null
                })}
              </div>
            )}

            {/* Available Prerequisites */}
            <div className="space-y-2">
              <Label className="text-sm">Available Courses</Label>
              <div className="max-h-32 overflow-y-auto border rounded-md">
                {prerequisiteCourses
                  .filter(
                    (course) =>
                      !watchedValues.prerequisites?.includes(course.id)
                  )
                  .map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {course.name}
                        </p>
                        <p className="text-xs text-gray-600">{course.code}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addPrerequisite(course.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CreateFormSection>

        {/* Schedule Information */}
        <CreateFormSection
          title="Schedule Information"
          icon={Clock}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="academicTerm">Academic Year/Semester</Label>
              <Select
                value={watchedValues.academicTerm}
                onValueChange={(value) => setValue('academicTerm', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-fall">Fall 2024</SelectItem>
                  <SelectItem value="2025-spring">Spring 2025</SelectItem>
                  <SelectItem value="2025-summer">Summer 2025</SelectItem>
                  <SelectItem value="2024-2025">
                    Full Academic Year 2024-2025
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingPattern">Meeting Pattern</Label>
              <Select
                value={watchedValues.meetingPattern}
                onValueChange={(value) => setValue('meetingPattern', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily (Monday-Friday)</SelectItem>
                  <SelectItem value="mwf">Monday, Wednesday, Friday</SelectItem>
                  <SelectItem value="tth">Tuesday, Thursday</SelectItem>
                  <SelectItem value="custom">Custom Schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                {...register('startTime')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                {...register('endTime')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location/Room</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="e.g., Room 205, Science Lab"
              />
            </div>
          </div>
        </CreateFormSection>

        {/* Assign Instructors */}
        <CreateFormSection
          title="Assign Instructors"
          icon={Users}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Course Instructors</Label>
              <span className="text-sm text-gray-500">
                {watchedValues.instructors?.length || 0} assigned
              </span>
            </div>

            {/* Assigned Instructors */}
            {(watchedValues.instructors?.length ?? 0) > 0 && (
              <div className="space-y-2">
                {(watchedValues.instructors ?? []).map((instructorId) => {
                  const instructor = availableTeachers.find(
                    (t) => t.id === instructorId
                  )
                  return instructor ? (
                    <div
                      key={instructorId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {instructor.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {instructor.subject} • Primary Instructor
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeInstructor(instructorId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null
                })}
              </div>
            )}

            {/* Available Instructors */}
            <div className="space-y-2">
              <Label className="text-sm">Available Instructors</Label>
              <div className="max-h-32 overflow-y-auto border rounded-md">
                {availableTeachers
                  .filter(
                    (teacher) =>
                      !watchedValues.instructors?.includes(teacher.id)
                  )
                  .map((teacher) => (
                    <div
                      key={teacher.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {teacher.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {teacher.subject}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addInstructor(teacher.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CreateFormSection>

        {/* Course Materials & Resources */}
        <CreateFormSection
          title="Course Materials & Resources"
          icon={BookOpen}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="textbooks">Required Textbooks</Label>
              <Textarea
                id="textbooks"
                {...register('textbooks')}
                rows={2}
                placeholder="List required textbooks, ISBN numbers, and editions..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalMaterials">Additional Materials</Label>
              <Textarea
                id="additionalMaterials"
                {...register('additionalMaterials')}
                rows={2}
                placeholder="Calculators, lab equipment, art supplies, etc..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="onlineResources">
                Online Resources/Platforms
              </Label>
              <Input
                id="onlineResources"
                {...register('onlineResources')}
                placeholder="Learning management systems, online tools, websites..."
              />
            </div>
          </div>
        </CreateFormSection>

        {/* Course Preview */}
        <CreateFormSection
          title="Course Preview"
          icon={BookOpen}
          description="Preview how your course will appear"
        >
          <div className="bg-white rounded border p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {watchedValues.name || 'New Course'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {watchedValues.code || 'Course Code'} •{' '}
                    {watchedValues.subjectCategory || 'Subject Category'}
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {watchedValues.gradeLevel
                        ? `Grade ${watchedValues.gradeLevel}`
                        : 'Grade Level'}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {watchedValues.startTime && watchedValues.endTime
                        ? `${watchedValues.startTime} - ${watchedValues.endTime}`
                        : 'Schedule TBD'}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {watchedValues.location || 'Location TBD'}
                    </span>
                  </div>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                Preview
              </span>
            </div>
          </div>
        </CreateFormSection>
      </form>
    </CreatePageLayout>
  )
}


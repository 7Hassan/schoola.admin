'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  Settings,
  Shield,
  GraduationCap,
  Briefcase
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
import { Textarea } from '@workspace/ui/components/ui/textarea'
import { Checkbox } from '@workspace/ui/components/ui/checkbox'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Alert, AlertDescription } from '@workspace/ui/components/ui/alert'
import {
  CreatePageLayout,
  CreateFormFooter,
  CreateFormSection
} from '@/components/shared'
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes'
import { useFormReset } from '@/hooks/use-form-reset'

// Import organized types and data
import {
  teacherCreateSchema,
  type TeacherCreateFormData
} from '@/types/teachers/create-form'
import {
  TEACHER_CREATE_FORM_DEFAULTS,
  GENDER_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  SALARY_CURRENCY_OPTIONS,
  TEACHER_ROLE_OPTIONS,
  MOCK_DEPARTMENTS,
  MOCK_SUBJECTS,
  COMMON_QUALIFICATIONS,
  getSubjectsByDepartment
} from '@/statics/teachers/create-form'

export default function CreateTeacherPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [newQualification, setNewQualification] = useState('')

  const form = useForm<TeacherCreateFormData>({
    resolver: zodResolver(teacherCreateSchema),
    defaultValues: TEACHER_CREATE_FORM_DEFAULTS,
    mode: 'onBlur'
  })

  const { register, handleSubmit, formState, setValue, watch, reset } = form
  const { errors, isValid, isDirty } = formState

  const watchedValues = watch()

  // Watch for changes to detect unsaved changes
  const { hasUnsavedChanges } = useUnsavedChanges({
    initialData: TEACHER_CREATE_FORM_DEFAULTS,
    currentData: watchedValues
  })

  const { handleReset } = useFormReset({
    reset,
    defaultValues: TEACHER_CREATE_FORM_DEFAULTS,
    onReset: () => console.log('Form reset')
  })

  const watchedDepartment = watch('department')
  const watchedSubjects = watch('subjects')
  const watchedQualifications = watch('qualifications')
  const watchedCreateAccount = watch('createAccount')

  // Filter subjects based on selected department
  const availableSubjects = getSubjectsByDepartment(watchedDepartment || '')

  const onSubmit = async (data: TeacherCreateFormData) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      console.log('Creating teacher:', data)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSubmitSuccess(true)
      setTimeout(() => {
        router.push('/teachers/management')
      }, 1500)
    } catch (error) {
      console.error('Error creating teacher:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addQualification = () => {
    if (
      newQualification.trim() &&
      !watchedQualifications.includes(newQualification.trim())
    ) {
      setValue(
        'qualifications',
        [...watchedQualifications, newQualification.trim()],
        {
          shouldValidate: true,
          shouldDirty: true
        }
      )
      setNewQualification('')
    }
  }

  const removeQualification = (index: number) => {
    const newQualifications = watchedQualifications.filter(
      (_, i) => i !== index
    )
    setValue('qualifications', newQualifications, {
      shouldValidate: true,
      shouldDirty: true
    })
  }

  const toggleSubject = (subjectId: string) => {
    const currentSubjects = watchedSubjects || []
    const newSubjects = currentSubjects.includes(subjectId)
      ? currentSubjects.filter((id) => id !== subjectId)
      : [...currentSubjects, subjectId]

    setValue('subjects', newSubjects, {
      shouldValidate: true,
      shouldDirty: true
    })
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (
        confirm('You have unsaved changes. Are you sure you want to leave?')
      ) {
        router.push('/teachers/management')
      }
    } else {
      router.push('/teachers/management')
    }
  }

  return (
    <CreatePageLayout
      title="Create Teacher Profile"
      description="Add a new teacher to your institution with comprehensive profile information."
      backRoute="/teachers/management"
      onReset={handleReset}
      isSubmitting={isSubmitting}
      hasUnsavedChanges={hasUnsavedChanges}
      actions={
        <CreateFormFooter
          onCancel={handleCancel}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          isValid={isValid}
          submitText="Create Teacher Profile"
        />
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Section 1: Basic Information */}
        <CreateFormSection
          title="Basic Information"
          description="Essential personal details for the teacher profile."
          icon={User}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input
                id="employeeId"
                {...register('employeeId')}
                placeholder="EMP001"
              />
              {errors.employeeId && (
                <p className="text-sm text-red-600">
                  {errors.employeeId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john.doe@school.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+20 123 456 7890"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={watch('gender')}
                onValueChange={(value) =>
                  setValue('gender', value as any, {
                    shouldValidate: true,
                    shouldDirty: true
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CreateFormSection>

        {/* Section 2: Professional Details */}
        <CreateFormSection
          title="Professional Details"
          description="Department, specialization, and qualifications information."
          icon={GraduationCap}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={watchedDepartment}
                  onValueChange={(value) => {
                    setValue('department', value, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                    // Clear subjects when department changes
                    setValue('subjects', [], {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_DEPARTMENTS.map((dept) => (
                      <SelectItem
                        key={dept.id}
                        value={dept.id}
                      >
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-red-600">
                    {errors.department.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="experienceYears">Years of Experience *</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  min="0"
                  max="50"
                  {...register('experienceYears', { valueAsNumber: true })}
                  placeholder="5"
                />
                {errors.experienceYears && (
                  <p className="text-sm text-red-600">
                    {errors.experienceYears.message}
                  </p>
                )}
              </div>
            </div>

            {/* Subjects Selection */}
            <div>
              <Label>Subjects Taught *</Label>
              <div className="mt-2">
                {watchedDepartment ? (
                  availableSubjects.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSubjects.map((subject) => (
                        <div
                          key={subject.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`subject-${subject.id}`}
                            checked={
                              watchedSubjects?.includes(subject.id) || false
                            }
                            onCheckedChange={() => toggleSubject(subject.id)}
                          />
                          <Label
                            htmlFor={`subject-${subject.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {subject.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No subjects available for this department
                    </p>
                  )
                ) : (
                  <p className="text-sm text-gray-500">
                    Please select a department first
                  </p>
                )}
              </div>
              {errors.subjects && (
                <p className="text-sm text-red-600">
                  {errors.subjects.message}
                </p>
              )}
            </div>

            {/* Qualifications */}
            <div>
              <Label>Qualifications *</Label>
              <div className="mt-2 space-y-3">
                <div className="flex space-x-2">
                  <Input
                    value={newQualification}
                    onChange={(e) => setNewQualification(e.target.value)}
                    placeholder="Add a qualification..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addQualification()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addQualification}
                    disabled={!newQualification.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Common Qualifications Quick Add */}
                <div className="flex flex-wrap gap-2">
                  {COMMON_QUALIFICATIONS.slice(0, 6).map((qual, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!watchedQualifications.includes(qual)) {
                          setValue(
                            'qualifications',
                            [...watchedQualifications, qual],
                            {
                              shouldValidate: true,
                              shouldDirty: true
                            }
                          )
                        }
                      }}
                      disabled={watchedQualifications.includes(qual)}
                    >
                      {qual}
                    </Button>
                  ))}
                </div>

                {/* Display Added Qualifications */}
                {watchedQualifications.length > 0 && (
                  <div className="space-y-2">
                    {watchedQualifications.map((qualification, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span className="text-sm">{qualification}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQualification(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.qualifications && (
                <p className="text-sm text-red-600">
                  {errors.qualifications.message}
                </p>
              )}
            </div>
          </div>
        </CreateFormSection>

        {/* Section 3: Employment Information */}
        <CreateFormSection
          title="Employment Information"
          description="Employment details, salary, and contract information."
          icon={Briefcase}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="hireDate">Hire Date *</Label>
              <Input
                id="hireDate"
                type="date"
                {...register('hireDate')}
              />
              {errors.hireDate && (
                <p className="text-sm text-red-600">
                  {errors.hireDate.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="employmentType">Employment Type *</Label>
              <Select
                value={watch('employmentType')}
                onValueChange={(value) =>
                  setValue('employmentType', value as any, {
                    shouldValidate: true,
                    shouldDirty: true
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employmentType && (
                <p className="text-sm text-red-600">
                  {errors.employmentType.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="salaryAmount">Salary Amount</Label>
              <Input
                id="salaryAmount"
                type="number"
                min="0"
                step="100"
                {...register('salaryAmount', { valueAsNumber: true })}
                placeholder="5000"
              />
              {errors.salaryAmount && (
                <p className="text-sm text-red-600">
                  {errors.salaryAmount.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="salaryCurrency">Currency</Label>
              <Select
                value={watch('salaryCurrency')}
                onValueChange={(value) =>
                  setValue('salaryCurrency', value as any, {
                    shouldValidate: true,
                    shouldDirty: true
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {SALARY_CURRENCY_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label} ({option.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CreateFormSection>

        {/* Section 4: Contact & Address */}
        <CreateFormSection
          title="Contact & Address"
          description="Address and emergency contact information."
          icon={MapPin}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  {...register('street')}
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="Cairo"
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  {...register('state')}
                  placeholder="Cairo Governorate"
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  {...register('postalCode')}
                  placeholder="12345"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-medium mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="emergencyContactName">Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    {...register('emergencyContactName')}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                  <Input
                    id="emergencyContactPhone"
                    {...register('emergencyContactPhone')}
                    placeholder="+20 123 456 7890"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContactRelationship">
                    Relationship
                  </Label>
                  <Input
                    id="emergencyContactRelationship"
                    {...register('emergencyContactRelationship')}
                    placeholder="Spouse, Parent, etc."
                  />
                </div>
              </div>
            </div>
          </div>
        </CreateFormSection>

        {/* Section 5: System Access */}
        <CreateFormSection
          title="System Access"
          description="User account and system permissions."
          icon={Shield}
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasAccount"
                checked={watchedCreateAccount}
                onCheckedChange={(checked) =>
                  setValue('createAccount', checked as boolean, {
                    shouldValidate: true,
                    shouldDirty: true
                  })
                }
              />
              <Label htmlFor="hasAccount">
                Create user account for this teacher
              </Label>
            </div>

            {watchedCreateAccount && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6 border-l-2 border-blue-200">
                <div>
                  <Label htmlFor="role">User Role</Label>
                  <Select
                    value={watch('role')}
                    onValueChange={(value) =>
                      setValue('role', value, {
                        shouldValidate: true,
                        shouldDirty: true
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEACHER_ROLE_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="initialPassword">Initial Password</Label>
                  <Input
                    id="initialPassword"
                    type="password"
                    {...register('initialPassword')}
                    placeholder="Leave blank to auto-generate"
                  />
                </div>
              </div>
            )}
          </div>
        </CreateFormSection>

        {/* Success Message */}
        {submitSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Teacher profile created successfully! Redirecting to teachers
              management...
            </AlertDescription>
          </Alert>
        )}
      </form>
    </CreatePageLayout>
  )
}


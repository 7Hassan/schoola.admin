'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Eye,
  Save,
  Share,
  MoreHorizontal,
  FormInput,
  Settings,
  Users,
  BarChart3
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
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
import { FormBuilderTab } from '@/components/forms/form-builder-tab'
import { CreatePageLayout, CreateFormSection } from '@/components/shared'
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes'
import { useFormReset } from '@/hooks/use-form-reset'
import {
  FormSchema,
  FormValues,
  FormSubmissionResult
} from '@/types/forms/form-builder-types'

interface FormMetadata {
  title: string
  description: string
  category: string
  isPublic: boolean
  allowAnonymous: boolean
  collectEmails: boolean
  requireApproval: boolean
  confirmationMessage: string
  redirectUrl: string
  departmentAccess: string[]
  notifications: {
    email: boolean
    slack: boolean
    emailRecipients: string
  }
}

const defaultMetadata: FormMetadata = {
  title: '',
  description: '',
  category: 'general',
  isPublic: false,
  allowAnonymous: false,
  collectEmails: true,
  requireApproval: false,
  confirmationMessage: '',
  redirectUrl: '',
  departmentAccess: [],
  notifications: {
    email: true,
    slack: false,
    emailRecipients: ''
  }
}

export default function FormsCreatePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [metadata, setMetadata] = useState<FormMetadata>(defaultMetadata)
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null)

  const { hasUnsavedChanges } = useUnsavedChanges({
    initialData: defaultMetadata,
    currentData: metadata
  })

  const handleReset = () => {
    setMetadata(defaultMetadata)
    setFormSchema(null)
    console.log('Form builder reset')
  }

  const handleSaveForm = async (schema: FormSchema) => {
    console.log('Saving form schema:', schema)
    setFormSchema(schema)
    // Implement your save logic here
  }

  const handleSubmitForm = async (
    data: FormValues
  ): Promise<FormSubmissionResult> => {
    console.log('Form submission:', data)
    // Implement your submission logic here
    return {
      success: true,
      message: 'Form submitted successfully!'
    }
  }

  const handleSaveAndPublish = async () => {
    try {
      setIsSubmitting(true)
      console.log('Publishing form:', { metadata, schema: formSchema })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      router.push('/forms/management')
    } catch (error) {
      console.error('Error publishing form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/forms/management')
  }

  const handlePreview = () => {
    console.log('Preview form')
    // Open preview modal or new tab
  }

  const handleShare = () => {
    console.log('Share form')
    // Open share dialog
  }

  const updateMetadata = (field: keyof FormMetadata, value: any) => {
    setMetadata((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNotifications = (
    field: keyof FormMetadata['notifications'],
    value: any
  ) => {
    setMetadata((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }))
  }

  return (
    <CreatePageLayout
      title="Create New Form"
      description="Design and configure a custom form for data collection"
      backRoute="/forms/management"
      onReset={handleReset}
      isSubmitting={isSubmitting}
      hasUnsavedChanges={hasUnsavedChanges}
      actions={
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            disabled={!formSchema}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            disabled={!formSchema}
          >
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveAndPublish}
            disabled={!formSchema || !metadata.title || isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Publishing...' : 'Save & Publish'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Form Settings */}
        <CreateFormSection
          title="Form Settings"
          icon={Settings}
          required
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Form Title *</Label>
              <Input
                id="title"
                value={metadata.title}
                onChange={(e) => updateMetadata('title', e.target.value)}
                placeholder="e.g., Course Registration Form, Feedback Survey"
                className={!metadata.title ? 'border-red-500' : ''}
              />
              {!metadata.title && (
                <p className="text-sm text-red-500">Form title is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={metadata.category}
                onValueChange={(value) => updateMetadata('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="registration">Registration</SelectItem>
                  <SelectItem value="feedback">Feedback/Survey</SelectItem>
                  <SelectItem value="application">Application</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="support">Support Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Form Description</Label>
            <Textarea
              id="description"
              value={metadata.description}
              onChange={(e) => updateMetadata('description', e.target.value)}
              rows={3}
              placeholder="Describe the purpose and instructions for this form..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <Label>Access Settings</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={metadata.isPublic}
                    onCheckedChange={(checked) =>
                      updateMetadata('isPublic', checked)
                    }
                  />
                  <Label
                    htmlFor="isPublic"
                    className="text-sm"
                  >
                    Make form public
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowAnonymous"
                    checked={metadata.allowAnonymous}
                    onCheckedChange={(checked) =>
                      updateMetadata('allowAnonymous', checked)
                    }
                  />
                  <Label
                    htmlFor="allowAnonymous"
                    className="text-sm"
                  >
                    Allow anonymous submissions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="collectEmails"
                    checked={metadata.collectEmails}
                    onCheckedChange={(checked) =>
                      updateMetadata('collectEmails', checked)
                    }
                  />
                  <Label
                    htmlFor="collectEmails"
                    className="text-sm"
                  >
                    Collect email addresses
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requireApproval"
                    checked={metadata.requireApproval}
                    onCheckedChange={(checked) =>
                      updateMetadata('requireApproval', checked)
                    }
                  />
                  <Label
                    htmlFor="requireApproval"
                    className="text-sm"
                  >
                    Require approval before publishing
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Completion Settings</Label>
              <div className="space-y-2">
                <div>
                  <Label
                    htmlFor="confirmationMessage"
                    className="text-sm"
                  >
                    Confirmation Message
                  </Label>
                  <Textarea
                    id="confirmationMessage"
                    value={metadata.confirmationMessage}
                    onChange={(e) =>
                      updateMetadata('confirmationMessage', e.target.value)
                    }
                    rows={2}
                    placeholder="Thank you for your submission!"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="redirectUrl"
                    className="text-sm"
                  >
                    Redirect URL (optional)
                  </Label>
                  <Input
                    id="redirectUrl"
                    type="url"
                    value={metadata.redirectUrl}
                    onChange={(e) =>
                      updateMetadata('redirectUrl', e.target.value)
                    }
                    placeholder="https://..."
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </CreateFormSection>

        {/* Department Access */}
        <CreateFormSection
          title="Department Access"
          icon={Users}
        >
          <div className="space-y-4">
            <Label>Select departments that can access this form</Label>
            <div className="grid gap-2 md:grid-cols-3">
              {[
                'Administration',
                'Academics',
                'Student Services',
                'IT Support',
                'Finance',
                'Human Resources',
                'Facilities',
                'Athletics',
                'Library'
              ].map((dept) => (
                <div
                  key={dept}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={dept}
                    checked={metadata.departmentAccess.includes(dept)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateMetadata('departmentAccess', [
                          ...metadata.departmentAccess,
                          dept
                        ])
                      } else {
                        updateMetadata(
                          'departmentAccess',
                          metadata.departmentAccess.filter((d) => d !== dept)
                        )
                      }
                    }}
                  />
                  <Label
                    htmlFor={dept}
                    className="text-sm"
                  >
                    {dept}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CreateFormSection>

        {/* Notifications */}
        <CreateFormSection
          title="Notifications"
          icon={BarChart3}
        >
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Label>Notification Settings</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emailNotifications"
                      checked={metadata.notifications.email}
                      onCheckedChange={(checked) =>
                        updateNotifications('email', checked)
                      }
                    />
                    <Label
                      htmlFor="emailNotifications"
                      className="text-sm"
                    >
                      Email notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="slackNotifications"
                      checked={metadata.notifications.slack}
                      onCheckedChange={(checked) =>
                        updateNotifications('slack', checked)
                      }
                    />
                    <Label
                      htmlFor="slackNotifications"
                      className="text-sm"
                    >
                      Slack notifications
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailRecipients">Email Recipients</Label>
                <Textarea
                  id="emailRecipients"
                  value={metadata.notifications.emailRecipients}
                  onChange={(e) =>
                    updateNotifications('emailRecipients', e.target.value)
                  }
                  rows={3}
                  placeholder="Enter email addresses separated by commas..."
                  disabled={!metadata.notifications.email}
                />
              </div>
            </div>
          </div>
        </CreateFormSection>

        {/* Form Builder */}
        <CreateFormSection
          title="Form Builder"
          icon={FormInput}
          required
          description="Design your form by adding questions and configuring their properties"
        >
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <FormBuilderTab
              onSave={handleSaveForm}
              onSubmit={handleSubmitForm}
              className="min-h-[600px]"
            />
          </div>
        </CreateFormSection>

        {/* Form Preview */}
        {formSchema && (
          <CreateFormSection
            title="Form Preview"
            icon={Eye}
            description="Preview how your form will appear to users"
          >
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="bg-white rounded-md p-4 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {metadata.title || 'Untitled Form'}
                </h3>
                {metadata.description && (
                  <p className="text-gray-600 mb-4">{metadata.description}</p>
                )}
                <div className="text-sm text-gray-500 space-y-1">
                  <p>• {formSchema.fields?.length || 0} questions configured</p>
                  <p>• Category: {metadata.category}</p>
                  <p>• {metadata.isPublic ? 'Public form' : 'Internal form'}</p>
                  <p>
                    •{' '}
                    {metadata.allowAnonymous
                      ? 'Anonymous allowed'
                      : 'Login required'}
                  </p>
                </div>
              </div>
            </div>
          </CreateFormSection>
        )}
      </div>
    </CreatePageLayout>
  )
}


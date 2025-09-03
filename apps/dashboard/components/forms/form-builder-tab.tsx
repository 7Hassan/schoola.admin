'use client'

import React, { useState } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@workspace/ui/components/ui/tabs'
import { Button } from '@workspace/ui/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/ui/card'
import { Input } from '@workspace/ui/components/ui/input'
import { Label } from '@workspace/ui/components/ui/label'
import { Textarea } from '@workspace/ui/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@workspace/ui/components/ui/alert-dialog'
import { toast } from '@workspace/ui/hooks/use-toast'
import {
  Settings,
  Eye,
  Code,
  Download,
  Upload,
  Trash2,
  Save,
  FileText
} from 'lucide-react'

import { useFormBuilder } from '../../hooks/use-form-builder'
import {
  FormSchema,
  SchemaExport,
  FormValues,
  FormSubmissionResult
} from '@/types/forms/form-builder-types'
import { SchemaEditor } from './schema-editor'
import { FormPreview } from './form-preview'

interface FormBuilderTabProps {
  initialSchema?: FormSchema
  onSave?: (schema: FormSchema) => Promise<void>
  onSubmit?: (data: FormValues) => Promise<FormSubmissionResult>
  className?: string
}

export function FormBuilderTab({
  initialSchema,
  onSave,
  onSubmit,
  className
}: FormBuilderTabProps) {
  const { state, actions } = useFormBuilder(initialSchema)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'settings'>(
    'edit'
  )
  const [isSaving, setIsSaving] = useState(false)

  // Form info editing state
  const [formTitle, setFormTitle] = useState(state.schema.title)
  const [formDescription, setFormDescription] = useState(
    state.schema.description || ''
  )
  const [formCoverImage, setFormCoverImage] = useState(
    state.schema.coverImage || ''
  )

  const handleSave = async () => {
    if (!onSave) return

    setIsSaving(true)
    try {
      await onSave(state.schema)
      toast({
        title: 'Form saved',
        description: 'Your form has been saved successfully.'
      })
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Failed to save the form. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    const exportData = actions.exportSchema()
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${state.schema.title || 'form'}-schema.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: 'Form exported',
      description: 'Your form schema has been exported successfully.'
    })
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const exportData: SchemaExport = JSON.parse(content)

        const success = actions.importSchema(exportData)
        if (success) {
          // Update local form info state
          setFormTitle(exportData.schema.title)
          setFormDescription(exportData.schema.description || '')
          setFormCoverImage(exportData.schema.coverImage || '')

          toast({
            title: 'Form imported',
            description: 'Your form schema has been imported successfully.'
          })
        } else {
          throw new Error('Invalid schema format')
        }
      } catch (error) {
        toast({
          title: 'Import failed',
          description:
            'Failed to import the form schema. Please check the file format.',
          variant: 'destructive'
        })
      }
    }
    reader.readAsText(file)

    // Reset the input
    event.target.value = ''
  }

  const updateFormInfo = () => {
    actions.updateFormInfo({
      title: formTitle,
      description: formDescription,
      coverImage: formCoverImage
    })
  }

  const handleFieldAdd = (field: (typeof state.schema.fields)[0]) => {
    actions.addField(field.type, state.schema.fields.length)
  }

  const handleFieldsReorder = (activeId: string, overId: string) => {
    const activeIndex = state.schema.fields.findIndex((f) => f.id === activeId)
    const overIndex = state.schema.fields.findIndex((f) => f.id === overId)

    if (activeIndex !== -1 && overIndex !== -1) {
      actions.reorderFields(activeIndex, overIndex)
    }
  }

  const handleFieldMove = (fieldId: string, direction: 'up' | 'down') => {
    const currentIndex = state.schema.fields.findIndex((f) => f.id === fieldId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex >= 0 && newIndex < state.schema.fields.length) {
      actions.reorderFields(currentIndex, newIndex)
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Form Builder</h2>
          <p className="text-muted-foreground">
            Create and customize your form with drag-and-drop fields
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            id="import-input"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('import-input')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={state.schema.fields.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          {onSave && (
            <Button
              onClick={handleSave}
              disabled={isSaving || !state.isDirty}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab as any}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="edit"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="edit"
          className="mt-6"
        >
          <SchemaEditor
            fields={state.schema.fields}
            selectedFieldId={state.selectedFieldId}
            onFieldSelect={actions.selectField}
            onFieldAdd={handleFieldAdd}
            onFieldUpdate={actions.updateField}
            onFieldDelete={actions.deleteField}
            onFieldMove={handleFieldMove}
            onFieldsReorder={handleFieldsReorder}
          />
        </TabsContent>

        <TabsContent
          value="preview"
          className="mt-6"
        >
          <FormPreview
            schema={state.schema}
            onSubmit={onSubmit}
            className="w-full"
          />
        </TabsContent>

        <TabsContent
          value="settings"
          className="mt-6"
        >
          <div className="grid gap-6 max-w-2xl">
            {/* Form Information */}
            <Card>
              <CardHeader>
                <CardTitle>Form Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="form-title">Form Title</Label>
                  <Input
                    id="form-title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    onBlur={updateFormInfo}
                    placeholder="Enter form title..."
                  />
                </div>

                <div>
                  <Label htmlFor="form-description">Description</Label>
                  <Textarea
                    id="form-description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    onBlur={updateFormInfo}
                    placeholder="Enter form description..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="form-cover">Cover Image URL</Label>
                  <Input
                    id="form-cover"
                    value={formCoverImage}
                    onChange={(e) => setFormCoverImage(e.target.value)}
                    onBlur={updateFormInfo}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="submit-button-text">Submit Button Text</Label>
                  <Input
                    id="submit-button-text"
                    value={state.schema.settings?.submitButtonText || 'Submit'}
                    onChange={(e) =>
                      actions.updateFormInfo({
                        settings: {
                          ...state.schema.settings,
                          submitButtonText: e.target.value
                        }
                      })
                    }
                    placeholder="Submit"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Reset Form
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset Form</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all fields and reset the
                        form to its initial state. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={actions.resetForm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Reset Form
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


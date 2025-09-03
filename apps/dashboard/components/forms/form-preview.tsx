'use client'

import React from 'react'
import { useFormPreview } from '../../hooks/use-form-preview'
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
import { Checkbox } from '@workspace/ui/components/ui/checkbox'
import {
  RadioGroup,
  RadioGroupItem
} from '@workspace/ui/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import { Progress } from '@workspace/ui/components/ui/progress'
import { Badge } from '@workspace/ui/components/ui/badge'
import {
  FormSchema,
  FormValues,
  FormSubmissionResult
} from '@/types/forms/form-builder-types'

interface FormPreviewProps {
  schema: FormSchema
  onSubmit?: (data: FormValues) => Promise<FormSubmissionResult>
  className?: string
}

export function FormPreview({ schema, onSubmit, className }: FormPreviewProps) {
  const { state, actions, helpers } = useFormPreview(schema)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!actions.validateForm()) {
      return
    }

    if (onSubmit) {
      await actions.submitForm(onSubmit)
    } else {
      // Default submission - just log the data
      console.log('Form submitted:', state.values)
    }
  }

  const renderField = (field: (typeof schema.fields)[0]) => {
    const fieldProps = helpers.getFieldProps(field.id)
    const error = helpers.getFieldError(field.id)
    const touched = helpers.isFieldTouched(field.id)

    const fieldContent = (() => {
      switch (field.type) {
        case 'text':
        case 'email':
          return (
            <Input
              type={field.type}
              placeholder={field.placeholder}
              value={fieldProps.value || ''}
              onChange={(e) => fieldProps.onChange(e.target.value)}
              onBlur={fieldProps.onBlur}
              className={error && touched ? 'border-destructive' : ''}
            />
          )

        case 'number':
          return (
            <Input
              type="number"
              placeholder={field.placeholder}
              value={fieldProps.value || ''}
              onChange={(e) =>
                fieldProps.onChange(Number(e.target.value) || '')
              }
              onBlur={fieldProps.onBlur}
              className={error && touched ? 'border-destructive' : ''}
            />
          )

        case 'textarea':
          return (
            <Textarea
              placeholder={field.placeholder}
              value={fieldProps.value || ''}
              onChange={(e) => fieldProps.onChange(e.target.value)}
              onBlur={fieldProps.onBlur}
              className={error && touched ? 'border-destructive' : ''}
              rows={4}
            />
          )

        case 'checkbox':
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={fieldProps.value || false}
                onCheckedChange={fieldProps.onChange}
                onBlur={fieldProps.onBlur}
              />
              <Label className="text-sm font-normal">{field.label}</Label>
            </div>
          )

        case 'radio':
          return (
            <RadioGroup
              value={fieldProps.value || ''}
              onValueChange={fieldProps.onChange}
              onBlur={fieldProps.onBlur}
            >
              {field.options?.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={option.value}
                    id={option.id}
                  />
                  <Label
                    htmlFor={option.id}
                    className="text-sm font-normal"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )

        case 'select':
          return (
            <Select
              value={fieldProps.value || ''}
              onValueChange={fieldProps.onChange}
            >
              <SelectTrigger
                className={error && touched ? 'border-destructive' : ''}
              >
                <SelectValue
                  placeholder={field.placeholder || 'Select an option'}
                />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem
                    key={option.id}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )

        case 'file':
          return (
            <Input
              type="file"
              onChange={(e) => fieldProps.onChange(e.target.files?.[0] || null)}
              onBlur={fieldProps.onBlur}
              className={error && touched ? 'border-destructive' : ''}
            />
          )

        default:
          return null
      }
    })()

    return (
      <div
        key={field.id}
        className="space-y-2"
      >
        {field.type !== 'checkbox' && (
          <Label
            htmlFor={field.id}
            className="text-sm font-medium"
          >
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}

        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}

        <div>{fieldContent}</div>

        {error && touched && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }

  const progress =
    schema.fields.length > 0
      ? (Object.keys(state.values).length /
          schema.fields.filter((f) => f.required).length) *
        100
      : 0

  return (
    <div className={className}>
      <Card className="w-full max-w-2xl mx-auto">
        {/* Header */}
        {(schema.title || schema.description || schema.coverImage) && (
          <CardHeader>
            {schema.coverImage && (
              <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                <img
                  src={schema.coverImage}
                  alt="Form cover"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {schema.title && (
              <CardTitle className="text-2xl font-bold">
                {schema.title}
              </CardTitle>
            )}

            {schema.description && (
              <p className="text-muted-foreground">{schema.description}</p>
            )}

            {schema.settings?.showProgressBar &&
              schema.fields.some((f) => f.required) && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Completion Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2"
                  />
                </div>
              )}
          </CardHeader>
        )}

        {/* Form Content */}
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Render Fields */}
            {schema.fields.sort((a, b) => a.order - b.order).map(renderField)}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                {state.errors && Object.keys(state.errors).length > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-xs"
                  >
                    {Object.keys(state.errors).length} error(s)
                  </Badge>
                )}
                {state.isValid && Object.keys(state.values).length > 0 && (
                  <Badge
                    variant="default"
                    className="text-xs bg-green-100 text-green-800"
                  >
                    Ready to submit
                  </Badge>
                )}
              </div>

              <Button
                type="submit"
                disabled={state.isSubmitting || !state.isValid}
                className="min-w-[120px]"
              >
                {state.isSubmitting
                  ? 'Submitting...'
                  : schema.settings?.submitButtonText || 'Submit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


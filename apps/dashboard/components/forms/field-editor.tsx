/**
 * Field Editor Component
 * Allows editing of individual field configurations
 */

'use client'

import React, { useState } from 'react'
import { Card } from '@workspace/ui/components/ui/card'
import { Input } from '@workspace/ui/components/ui/input'
import { Button } from '@workspace/ui/components/ui/button'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Label } from '@workspace/ui/components/ui/label'
import { Textarea } from '@workspace/ui/components/ui/textarea'
import { Switch } from '@workspace/ui/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@workspace/ui/components/ui/collapsible'
import {
  Trash2,
  Plus,
  Settings,
  ChevronDown,
  ChevronRight,
  Copy,
  ImageIcon,
  Type,
  Hash,
  Mail,
  FileText,
  CheckSquare,
  Circle,
  List,
  Upload
} from 'lucide-react'
import {
  FieldDefinition,
  FieldType,
  FieldOption
} from '@/types/forms/form-builder-types'

interface FieldEditorProps {
  field: FieldDefinition
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<FieldDefinition>) => void
  onDelete: () => void
  onDuplicate: () => void
}

const fieldIcons: Record<FieldType, React.ComponentType<any>> = {
  text: Type,
  number: Hash,
  email: Mail,
  textarea: FileText,
  checkbox: CheckSquare,
  radio: Circle,
  select: List,
  file: Upload
}

const fieldTypeLabels: Record<FieldType, string> = {
  text: 'Text Input',
  number: 'Number Input',
  email: 'Email Address',
  textarea: 'Long Text',
  checkbox: 'Checkbox',
  radio: 'Radio Buttons',
  select: 'Dropdown',
  file: 'File Upload'
}

export function FieldEditor({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate
}: FieldEditorProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [isEditingLabel, setIsEditingLabel] = useState(false)

  const Icon = fieldIcons[field.type] || Type

  const handleLabelChange = (label: string) => {
    onUpdate({ label })
    setIsEditingLabel(false)
  }

  const handleAddOption = () => {
    const currentOptions = field.options || []
    const newOption: FieldOption = {
      id: Math.random().toString(36).substr(2, 9),
      label: `Option ${currentOptions.length + 1}`,
      value: `option${currentOptions.length + 1}`
    }
    onUpdate({ options: [...currentOptions, newOption] })
  }

  const handleUpdateOption = (
    optionId: string,
    updates: Partial<FieldOption>
  ) => {
    const updatedOptions = (field.options || []).map((option: FieldOption) =>
      option.id === optionId ? { ...option, ...updates } : option
    )
    onUpdate({ options: updatedOptions })
  }

  const handleDeleteOption = (optionId: string) => {
    const updatedOptions = (field.options || []).filter(
      (option: FieldOption) => option.id !== optionId
    )
    onUpdate({ options: updatedOptions })
  }

  const hasOptions = field.type === 'select' || field.type === 'radio'

  return (
    <Card
      className={`p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-blue-500 border-blue-200'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Field Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div
            className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}
          >
            <Icon
              className={`h-4 w-4 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            {isEditingLabel ? (
              <Input
                value={field.label}
                onChange={(e) => handleLabelChange(e.target.value)}
                onBlur={() => setIsEditingLabel(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingLabel(false)
                  }
                }}
                className="text-sm font-medium"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div>
                <h3
                  className="text-sm font-medium text-gray-900 truncate cursor-text"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditingLabel(true)
                  }}
                >
                  {field.label}
                </h3>
                <p className="text-xs text-gray-500">
                  {fieldTypeLabels[field.type]}
                  {field.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate()
            }}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsAdvancedOpen(!isAdvancedOpen)
            }}
            className="h-8 w-8 p-0"
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Field Configuration - Only shown when selected */}
      {isSelected && (
        <div
          className="space-y-4 border-t pt-4"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Basic Settings */}
          <div className="space-y-3">
            <div>
              <Label
                htmlFor="placeholder"
                className="text-xs font-medium text-gray-700"
              >
                Placeholder
              </Label>
              <Input
                id="placeholder"
                value={field.placeholder || ''}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Enter placeholder text..."
                className="mt-1"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-xs font-medium text-gray-700"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={field.description || ''}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Add a description..."
                className="mt-1"
                rows={2}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={field.required}
                onCheckedChange={(required) => onUpdate({ required })}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
              <Label
                htmlFor="required"
                className="text-sm"
              >
                Required field
              </Label>
            </div>

            {/* Cover Image */}
            <div>
              <Label
                htmlFor="coverImage"
                className="text-xs font-medium text-gray-700"
              >
                Cover Image URL
              </Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="coverImage"
                  value={field.coverImage || ''}
                  onChange={(e) => onUpdate({ coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
              {field.coverImage && (
                <div className="mt-2">
                  <img
                    src={field.coverImage}
                    alt="Field cover"
                    className="w-full h-20 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Options for Select/Radio fields */}
          {hasOptions && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-gray-700">
                  Options
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddOption()
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="h-7 px-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-2">
                {(field.options || []).map((option, index) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-xs text-gray-500 w-6">
                      {index + 1}.
                    </span>
                    <Input
                      value={option.label}
                      onChange={(e) =>
                        handleUpdateOption(option.id, { label: e.target.value })
                      }
                      placeholder="Option label"
                      className="flex-1"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                    <Input
                      value={option.value}
                      onChange={(e) =>
                        handleUpdateOption(option.id, { value: e.target.value })
                      }
                      placeholder="Value"
                      className="flex-1"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteOption(option.id)
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="h-8 w-8 p-0 text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          <Collapsible
            open={isAdvancedOpen}
            onOpenChange={setIsAdvancedOpen}
          >
            <CollapsibleTrigger className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
              {isAdvancedOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span>Advanced Settings</span>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-3 mt-3">
              {/* Validation Rules */}
              <div className="space-y-3">
                <Label className="text-xs font-medium text-gray-700">
                  Validation
                </Label>

                {/* Text/Email/Textarea validations */}
                {(field.type === 'text' ||
                  field.type === 'email' ||
                  field.type === 'textarea') && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label
                        htmlFor="minLength"
                        className="text-xs text-gray-600"
                      >
                        Min Length
                      </Label>
                      <Input
                        id="minLength"
                        type="number"
                        value={field.validation?.minLength || ''}
                        onChange={(e) =>
                          onUpdate({
                            validation: {
                              ...field.validation,
                              minLength: e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            }
                          })
                        }
                        className="mt-1"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="maxLength"
                        className="text-xs text-gray-600"
                      >
                        Max Length
                      </Label>
                      <Input
                        id="maxLength"
                        type="number"
                        value={field.validation?.maxLength || ''}
                        onChange={(e) =>
                          onUpdate({
                            validation: {
                              ...field.validation,
                              maxLength: e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            }
                          })
                        }
                        className="mt-1"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}

                {/* Number validations */}
                {field.type === 'number' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label
                        htmlFor="min"
                        className="text-xs text-gray-600"
                      >
                        Minimum Value
                      </Label>
                      <Input
                        id="min"
                        type="number"
                        value={field.validation?.min || ''}
                        onChange={(e) =>
                          onUpdate({
                            validation: {
                              ...field.validation,
                              min: e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            }
                          })
                        }
                        className="mt-1"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="max"
                        className="text-xs text-gray-600"
                      >
                        Maximum Value
                      </Label>
                      <Input
                        id="max"
                        type="number"
                        value={field.validation?.max || ''}
                        onChange={(e) =>
                          onUpdate({
                            validation: {
                              ...field.validation,
                              max: e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            }
                          })
                        }
                        className="mt-1"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}

                {/* Pattern validation */}
                {(field.type === 'text' || field.type === 'textarea') && (
                  <div>
                    <Label
                      htmlFor="pattern"
                      className="text-xs text-gray-600"
                    >
                      Pattern (Regex)
                    </Label>
                    <Input
                      id="pattern"
                      value={field.validation?.pattern || ''}
                      onChange={(e) =>
                        onUpdate({
                          validation: {
                            ...field.validation,
                            pattern: e.target.value || undefined
                          }
                        })
                      }
                      placeholder="^[a-zA-Z]+$"
                      className="mt-1"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  </div>
                )}

                {/* Custom validation message */}
                <div>
                  <Label
                    htmlFor="customMessage"
                    className="text-xs text-gray-600"
                  >
                    Custom Error Message
                  </Label>
                  <Input
                    id="customMessage"
                    value={field.validation?.customMessage || ''}
                    onChange={(e) =>
                      onUpdate({
                        validation: {
                          ...field.validation,
                          customMessage: e.target.value || undefined
                        }
                      })
                    }
                    placeholder="Please enter a valid value"
                    className="mt-1"
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* Default Value */}
              <div>
                <Label
                  htmlFor="defaultValue"
                  className="text-xs font-medium text-gray-700"
                >
                  Default Value
                </Label>
                {field.type === 'checkbox' ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Switch
                      checked={field.defaultValue || false}
                      onCheckedChange={(checked) =>
                        onUpdate({ defaultValue: checked })
                      }
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm text-gray-600">
                      Default checked
                    </span>
                  </div>
                ) : field.type === 'select' || field.type === 'radio' ? (
                  <Select
                    value={field.defaultValue || ''}
                    onValueChange={(value) => onUpdate({ defaultValue: value })}
                  >
                    <SelectTrigger
                      className="mt-1"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <SelectValue placeholder="Select default option..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(field.options || []).map((option) => (
                        <SelectItem
                          key={option.id}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="defaultValue"
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={field.defaultValue || ''}
                    onChange={(e) =>
                      onUpdate({
                        defaultValue:
                          field.type === 'number'
                            ? e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                            : e.target.value
                      })
                    }
                    className="mt-1"
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </Card>
  )
}


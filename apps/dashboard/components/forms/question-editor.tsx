'use client'

import { useState } from 'react'
import { Card } from '@workspace/ui/components/ui/card'
import { Input } from '@workspace/ui/components/ui/input'
import { Button } from '@workspace/ui/components/ui/button'
import { Switch } from '@workspace/ui/components/ui/switch'
import { Label } from '@workspace/ui/components/ui/label'
import {
  Trash2,
  Plus,
  GripVertical,
  Type,
  CheckSquare,
  Circle,
  ChevronDown
} from 'lucide-react'
import { FormQuestion, useFormStore } from '@workspace/ui/lib/store'

interface QuestionEditorProps {
  question: FormQuestion
  isSelected: boolean
  onSelect: () => void
}

const questionIcons = {
  text: Type,
  checkbox: CheckSquare,
  radio: Circle,
  select: ChevronDown
}

export function QuestionEditor({
  question,
  isSelected,
  onSelect
}: QuestionEditorProps) {
  const {
    updateQuestion,
    deleteQuestion,
    addOption,
    updateOption,
    deleteOption
  } = useFormStore()
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  const Icon = questionIcons[question.type]

  const handleTitleChange = (title: string) => {
    updateQuestion(question.id, { title })
  }

  const handleRequiredToggle = (required: boolean) => {
    updateQuestion(question.id, { required })
  }

  const renderQuestionPreview = () => {
    switch (question.type) {
      case 'text':
        return (
          <div className="mt-4">
            <Input
              placeholder="Your answer"
              disabled
              className="bg-gray-50"
            />
          </div>
        )

      case 'checkbox':
        return (
          <div className="mt-4 space-y-2">
            {question.options?.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  disabled
                  className="rounded"
                />
                {isSelected ? (
                  <Input
                    value={option.text}
                    onChange={(e) =>
                      updateOption(question.id, option.id, e.target.value)
                    }
                    className="flex-1 border-none shadow-none p-0 focus-visible:ring-0"
                  />
                ) : (
                  <span className="text-gray-700">{option.text}</span>
                )}
                {isSelected && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteOption(question.id, option.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {isSelected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addOption(question.id)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add option
              </Button>
            )}
          </div>
        )

      case 'radio':
        return (
          <div className="mt-4 space-y-2">
            {question.options?.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2"
              >
                <input
                  type="radio"
                  name={question.id}
                  disabled
                  className="rounded-full"
                />
                {isSelected ? (
                  <Input
                    value={option.text}
                    onChange={(e) =>
                      updateOption(question.id, option.id, e.target.value)
                    }
                    className="flex-1 border-none shadow-none p-0 focus-visible:ring-0"
                  />
                ) : (
                  <span className="text-gray-700">{option.text}</span>
                )}
                {isSelected && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteOption(question.id, option.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {isSelected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addOption(question.id)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add option
              </Button>
            )}
          </div>
        )

      case 'select':
        return (
          <div className="mt-4">
            <select
              disabled
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
            >
              <option>Choose</option>
              {question.options?.map((option) => (
                <option key={option.id}>{option.text}</option>
              ))}
            </select>
            {isSelected && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Options:</h4>
                {question.options?.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2"
                  >
                    <Input
                      value={option.text}
                      onChange={(e) =>
                        updateOption(question.id, option.id, e.target.value)
                      }
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteOption(question.id, option.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addOption(question.id)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add option
                </Button>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card
      className={`p-6 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-blue-500 border-blue-200 shadow-md'
          : 'hover:shadow-md border-gray-200'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1">
          <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-500 capitalize">
              {question.type}
            </span>
            {question.required && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </div>

          <div className="mb-4">
            {isEditingTitle ? (
              <Input
                value={question.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingTitle(false)
                  }
                }}
                className="text-lg font-medium border-none shadow-none p-0 focus-visible:ring-0"
                autoFocus
              />
            ) : (
              <h3
                className="text-lg font-medium text-gray-900 cursor-pointer hover:bg-gray-50 p-1 -m-1 rounded"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditingTitle(true)
                }}
              >
                {question.title}
              </h3>
            )}
          </div>

          {renderQuestionPreview()}

          {isSelected && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={question.required}
                    onCheckedChange={handleRequiredToggle}
                    id={`required-${question.id}`}
                  />
                  <Label
                    htmlFor={`required-${question.id}`}
                    className="text-sm text-gray-700"
                  >
                    Required
                  </Label>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteQuestion(question.id)
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}


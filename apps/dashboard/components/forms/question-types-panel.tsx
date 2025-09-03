'use client'

import { Card } from '@workspace/ui/components/ui/card'
import { Button } from '@workspace/ui/components/ui/button'
import { Type, CheckSquare, Circle, ChevronDown, Plus } from 'lucide-react'
import { useFormStore, QuestionType } from '@workspace/ui/lib/store'

const questionTypes = [
  {
    type: 'text' as QuestionType,
    label: 'Text Input',
    icon: Type,
    description: 'Single line text input'
  },
  {
    type: 'checkbox' as QuestionType,
    label: 'Checkboxes',
    icon: CheckSquare,
    description: 'Multiple choice selection'
  },
  {
    type: 'radio' as QuestionType,
    label: 'Radio Buttons',
    icon: Circle,
    description: 'Single choice selection'
  },
  {
    type: 'select' as QuestionType,
    label: 'Dropdown',
    icon: ChevronDown,
    description: 'Dropdown selection'
  }
]

export function QuestionTypesPanel() {
  const { addQuestion } = useFormStore()

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Question Types
        </h3>
        <p className="text-sm text-gray-600">
          Click to add a question to your form
        </p>
      </div>

      <div className="space-y-2">
        {questionTypes.map((questionType) => {
          const Icon = questionType.icon
          return (
            <Button
              key={questionType.type}
              variant="ghost"
              className="w-full justify-start h-auto p-3 hover:bg-blue-50 hover:border-blue-200 border border-transparent"
              onClick={() => addQuestion(questionType.type)}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="flex-shrink-0">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {questionType.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {questionType.description}
                  </div>
                </div>
                <Plus className="h-4 w-4 text-gray-400" />
              </div>
            </Button>
          )
        })}
      </div>
    </Card>
  )
}


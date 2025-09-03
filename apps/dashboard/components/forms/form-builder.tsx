'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {
  SortableContext as SortableContextComponent,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { FormHeader } from '@/components/forms/form-header'
import { QuestionEditor } from '@/components/forms/question-editor'
import { useFormStore } from '@workspace/ui/lib/store'

function SortableQuestionEditor({ question }: { question: any }) {
  const { selectedQuestionId, setSelectedQuestion } = useFormStore()
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <QuestionEditor
        question={question}
        isSelected={selectedQuestionId === question.id}
        onSelect={() => setSelectedQuestion(question.id)}
      />
    </div>
  )
}

export function FormBuilder() {
  const {
    currentForm,
    selectedQuestionId,
    setSelectedQuestion,
    reorderQuestions
  } = useFormStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = currentForm.questions.findIndex(
        (q) => q.id === active.id
      )
      const newIndex = currentForm.questions.findIndex((q) => q.id === over.id)

      const newQuestions = arrayMove(currentForm.questions, oldIndex, newIndex)
      reorderQuestions(newQuestions)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <FormHeader />

      <div className="space-y-4">
        {currentForm.questions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No questions yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start building your form by adding questions from the panel on the
              left.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={currentForm.questions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {currentForm.questions.map((question) => (
                <SortableQuestionEditor
                  key={question.id}
                  question={question}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}


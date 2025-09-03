import { create } from 'zustand'

export type QuestionType = 'text' | 'checkbox' | 'radio' | 'select'

export interface QuestionOption {
  id: string
  text: string
}

export interface FormQuestion {
  id: string
  type: QuestionType
  title: string
  description?: string
  required: boolean
  options?: QuestionOption[]
}

export interface FormData {
  id: string
  title: string
  description: string
  questions: FormQuestion[]
}

interface FormStore {
  currentForm: FormData
  selectedQuestionId: string | null
  setFormTitle: (title: string) => void
  setFormDescription: (description: string) => void
  addQuestion: (type: QuestionType) => void
  updateQuestion: (id: string, updates: Partial<FormQuestion>) => void
  deleteQuestion: (id: string) => void
  reorderQuestions: (questions: FormQuestion[]) => void
  setSelectedQuestion: (id: string | null) => void
  addOption: (questionId: string) => void
  updateOption: (questionId: string, optionId: string, text: string) => void
  deleteOption: (questionId: string, optionId: string) => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useFormStore = create<FormStore>((set, get) => ({
  currentForm: {
    id: 'form-1',
    title: 'Untitled Form',
    description: 'Form description',
    questions: []
  },
  selectedQuestionId: null,

  setFormTitle: (title) =>
    set((state) => ({
      currentForm: { ...state.currentForm, title }
    })),

  setFormDescription: (description) =>
    set((state) => ({
      currentForm: { ...state.currentForm, description }
    })),

  addQuestion: (type) => {
    const newQuestion: FormQuestion = {
      id: generateId(),
      type,
      title: 'Untitled Question',
      required: false,
      options:
        type === 'text' ? undefined : [{ id: generateId(), text: 'Option 1' }]
    }

    set((state) => ({
      currentForm: {
        ...state.currentForm,
        questions: [...state.currentForm.questions, newQuestion]
      },
      selectedQuestionId: newQuestion.id
    }))
  },

  updateQuestion: (id, updates) =>
    set((state) => ({
      currentForm: {
        ...state.currentForm,
        questions: state.currentForm.questions.map((q) =>
          q.id === id ? { ...q, ...updates } : q
        )
      }
    })),

  deleteQuestion: (id) =>
    set((state) => ({
      currentForm: {
        ...state.currentForm,
        questions: state.currentForm.questions.filter((q) => q.id !== id)
      },
      selectedQuestionId:
        state.selectedQuestionId === id ? null : state.selectedQuestionId
    })),

  reorderQuestions: (questions) =>
    set((state) => ({
      currentForm: { ...state.currentForm, questions }
    })),

  setSelectedQuestion: (id) => set({ selectedQuestionId: id }),

  addOption: (questionId) => {
    const optionNumber =
      get().currentForm.questions.find((q) => q.id === questionId)?.options
        ?.length || 0
    const newOption: QuestionOption = {
      id: generateId(),
      text: `Option ${optionNumber + 1}`
    }

    set((state) => ({
      currentForm: {
        ...state.currentForm,
        questions: state.currentForm.questions.map((q) =>
          q.id === questionId
            ? { ...q, options: [...(q.options || []), newOption] }
            : q
        )
      }
    }))
  },

  updateOption: (questionId, optionId, text) =>
    set((state) => ({
      currentForm: {
        ...state.currentForm,
        questions: state.currentForm.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options?.map((opt) =>
                  opt.id === optionId ? { ...opt, text } : opt
                )
              }
            : q
        )
      }
    })),

  deleteOption: (questionId, optionId) =>
    set((state) => ({
      currentForm: {
        ...state.currentForm,
        questions: state.currentForm.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options?.filter((opt) => opt.id !== optionId)
              }
            : q
        )
      }
    }))
}))


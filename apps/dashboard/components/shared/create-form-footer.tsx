'use client'

import React from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'

interface CreateFormFooterProps {
  onCancel: () => void
  onSubmit: () => void
  isSubmitting: boolean
  isValid: boolean
  submitText?: string
  cancelText?: string
  showSaveAsDraft?: boolean
  onSaveAsDraft?: () => void
}

export function CreateFormFooter({
  onCancel,
  onSubmit,
  isSubmitting,
  isValid,
  submitText = 'Create',
  cancelText = 'Cancel',
  showSaveAsDraft = false,
  onSaveAsDraft
}: CreateFormFooterProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>* Required fields</p>
        <p className="mt-1">
          Make sure all required information is filled out before submitting.
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelText}
        </Button>
        {showSaveAsDraft && onSaveAsDraft && (
          <Button
            type="button"
            variant="outline"
            onClick={onSaveAsDraft}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
        )}
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitting || !isValid}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!isSubmitting && <Save className="h-4 w-4 mr-2" />}
          {isSubmitting ? 'Creating...' : submitText}
        </Button>
      </div>
    </div>
  )
}


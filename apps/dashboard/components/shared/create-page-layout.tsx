'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@workspace/ui/components/ui/alert-dialog'

interface CreatePageLayoutProps {
  title: string
  description: string
  backRoute: string
  onReset: () => void
  isSubmitting?: boolean
  hasUnsavedChanges?: boolean
  children: React.ReactNode
  actions?: React.ReactNode
}

export function CreatePageLayout({
  title,
  description,
  backRoute,
  onReset,
  isSubmitting = false,
  hasUnsavedChanges = false,
  children,
  actions
}: CreatePageLayoutProps) {
  const router = useRouter()
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showNavigationDialog, setShowNavigationDialog] = useState(false)

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowNavigationDialog(true)
    } else {
      router.push(backRoute)
    }
  }

  const handleReset = () => {
    if (hasUnsavedChanges) {
      setShowResetDialog(true)
    } else {
      onReset()
    }
  }

  const confirmReset = () => {
    onReset()
    setShowResetDialog(false)
  }

  const confirmNavigation = () => {
    setShowNavigationDialog(false)
    router.push(backRoute)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed at top */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 lg:px-8 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Management
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
              className="flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Form
            </Button>
          </div>
        </div>
      </div>

      {/* Content - Scrollable area */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-gray-50 dark:bg-gray-900">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="w-full space-y-6">{children}</div>
        </div>
      </div>

      {/* Actions Footer - Fixed at bottom */}
      {actions && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 md:px-6 lg:px-8 py-4 flex-shrink-0">
          {actions}
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      <AlertDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Form</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the form? All unsaved changes will
              be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReset}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reset Form
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Navigation Confirmation Dialog */}
      <AlertDialog
        open={showNavigationDialog}
        onOpenChange={setShowNavigationDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost if you leave this page.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay on Page</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmNavigation}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Leave Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


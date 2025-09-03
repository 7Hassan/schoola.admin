'use client'

import React from 'react'
import { X } from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@workspace/ui/components/ui/sheet'
import { useTeachersManagementStore } from '@/stores/teachers/management-store'

export function TeacherDrawer() {
  const { isDrawerOpen, selectedTeacher, closeDrawer } =
    useTeachersManagementStore()

  const isAddMode = selectedTeacher === null

  return (
    <Sheet
      open={isDrawerOpen}
      onOpenChange={closeDrawer}
    >
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>
                {isAddMode ? 'Add New Teacher' : 'Edit Teacher'}
              </SheetTitle>
              <SheetDescription>
                {isAddMode
                  ? 'Create a new teacher profile'
                  : `Edit ${selectedTeacher?.name || 'teacher'} profile`}
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeDrawer}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">
              Teacher form will be implemented here
            </p>
            <p className="text-sm text-gray-400 mt-2">
              This will be part of Phase 2 implementation
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}


"use client"

import React from 'react'
import { Label } from '@workspace/ui/components/ui/label'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { Student } from '@/stores/students-store'

export type SystemInfoProps = {
  selectedStudent: Student
}

export function SystemInfo({ selectedStudent }: SystemInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold">System Information</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <Label className="text-gray-500">Created At</Label>
          <p className="font-medium">{format(selectedStudent.createdAt, 'PPP')}</p>
        </div>
        <div>
          <Label className="text-gray-500">Last Updated</Label>
          <p className="font-medium">{format(selectedStudent.lastUpdatedAt, 'PPP')}</p>
        </div>
      </div>
    </div>
  )
}

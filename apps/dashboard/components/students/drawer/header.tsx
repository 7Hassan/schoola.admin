"use client"

import React from 'react'
import { Avatar, AvatarFallback } from '@workspace/ui/components/ui/avatar'
import { Badge } from '@workspace/ui/components/ui/badge'
import { User } from 'lucide-react'
import { SheetTitle, SheetDescription } from '@workspace/ui/components/ui/sheet'
import { Student } from '@/stores/students-store'

export type StudentDrawerHeaderProps = {
  isAddMode: boolean
  title: string
  description: string
  selectedStudent?: Student | null
  getStatusColor: (status: string) => string
}

export function StudentDrawerHeader({ isAddMode, title, description, selectedStudent, getStatusColor }: StudentDrawerHeaderProps) {
  return (
    <>
      {isAddMode ? (
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-lg">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <SheetTitle className="text-xl">{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </div>
        </div>
      ) : selectedStudent ? (
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-lg">
              {`${selectedStudent.childName || ''} ${selectedStudent.parentName || ''}`
                .trim()
                .split(/[ /]+/)
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <SheetTitle className="text-xl">{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getStatusColor(selectedStudent.status)}>
                {selectedStudent.status}
              </Badge>
              <Badge className={selectedStudent.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {selectedStudent.paid ? 'Paid' : 'Unpaid'}
              </Badge>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

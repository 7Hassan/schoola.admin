'use client'

import React from 'react'
import { useTeachersManagementStore } from '@/stores/teachers'
import { TeacherCard } from './teacher-card'
import { TeachersPagination } from './teachers-pagination'

export function TeachersGrid() {
  const { getPaginatedTeachers } = useTeachersManagementStore()
  const teachers = getPaginatedTeachers()

  if (teachers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="rounded-full bg-gray-100 p-6 mx-auto w-24 h-24 flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No teachers found
          </h3>
          <p className="text-gray-500">
            There are no teachers matching your current filters. Try adjusting
            your search criteria.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
          />
        ))}
      </div>
      <TeachersPagination />
    </div>
  )
}


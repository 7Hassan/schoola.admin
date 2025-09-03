'use client'

import React from 'react'
import { useCoursesStore } from '@/stores/courses-store'
import { CourseCard } from './course-card'

export function CoursesGrid() {
  const {
    getPaginatedCourses,
    isDeleteMode,
    selectedCoursesForDeletion,
    toggleCourseForDeletion
  } = useCoursesStore()

  const courses = getPaginatedCourses()

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No courses found</div>
        <div className="text-gray-400 text-sm">
          Try adjusting your search criteria or create a new course
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          isSelected={
            isDeleteMode && selectedCoursesForDeletion.includes(course.id)
          }
          onSelect={isDeleteMode ? toggleCourseForDeletion : undefined}
        />
      ))}
    </div>
  )
}


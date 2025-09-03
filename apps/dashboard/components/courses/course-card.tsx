'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Users,
  Clock,
  Edit,
  Archive,
  Star,
  TrendingUp,
  FileText,
  Calendar,
  Check
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Card } from '@workspace/ui/components/ui/card'
import { useCoursesStore, type Course } from '@/stores/courses-store'

interface CourseCardProps {
  course: Course
  isSelected?: boolean
  onSelect?: (courseId: string) => void
}

export function CourseCard({ course, isSelected, onSelect }: CourseCardProps) {
  const router = useRouter()
  const { userRole, archiveCourse, isDeleteMode } = useCoursesStore()

  const categoryColor = useCoursesStore(
    (state) =>
      state.categories.find((cat) => cat.id === course.category)?.color ||
      '#6B7280'
  )

  // Get number of related groups for this course
  const relatedGroupsCount = course.relatedGroupIds.length

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Navigate to course profile page for editing
    router.push(`/courses/${course.id}`)
  }

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation()
    archiveCourse(course.id)
  }

  const handleCardClick = () => {
    if (isDeleteMode) {
      // In delete mode, clicking toggles selection
      onSelect?.(course.id)
    } else {
      // In normal mode, clicking navigates to course profile
      router.push(`/courses/${course.id}`)
    }
  }

  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'draft':
        return 'bg-yellow-500'
      case 'archived':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getLevelColor = (level: Course['level']) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const canEdit = userRole === 'admin' || userRole === 'super-admin'

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer ${
        isSelected
          ? 'ring-2 ring-red-500 shadow-lg bg-red-50 dark:bg-red-950/30'
          : isDeleteMode
            ? 'hover:ring-1 hover:ring-red-300 hover:bg-red-25 dark:hover:bg-red-950/10'
            : 'hover:ring-1 hover:ring-blue-300'
      }`}
      onClick={handleCardClick}
    >
      {/* Delete mode selection indicator */}
      {isDeleteMode && (
        <div className="absolute top-2 right-2 z-10">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              isSelected
                ? 'bg-red-500 border-red-500 text-white'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 group-hover:border-red-400'
            }`}
          >
            {isSelected && <Check className="w-3 h-3" />}
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${getStatusColor(course.status)}`}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="secondary"
                className="text-xs"
                style={{
                  backgroundColor: `${categoryColor}20`,
                  color: categoryColor
                }}
              >
                {course.code}
              </Badge>
              <Badge className={`text-xs ${getLevelColor(course.level)}`}>
                {course.level}
              </Badge>
            </div>
            <h3
              className={`font-semibold truncate transition-colors ${
                isDeleteMode
                  ? isSelected
                    ? 'text-red-900 dark:text-red-100'
                    : 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-600'
              }`}
            >
              {course.name}
            </h3>
            <p
              className={`text-sm line-clamp-2 mt-1 transition-colors ${
                isDeleteMode
                  ? 'text-gray-600 dark:text-gray-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {course.description}
            </p>
          </div>

          {/* Direct Action Buttons - Only show in normal mode for active courses */}
          {!isDeleteMode && canEdit && course.status === 'active' && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleArchive}
                className="h-8 px-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Archive className="h-4 w-4 mr-1" />
                Archive
              </Button>
            </div>
          )}
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration} weeks
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="h-4 w-4 mr-1" />
            {course.totalLectures} lectures
          </div>
        </div>

        {/* Age Range */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            Ages {course.validAgeRange.minAge}-{course.validAgeRange.maxAge}
          </div>
        </div>

        {/* Related Groups */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Related Groups
            </span>
            <span className="text-sm text-gray-600">
              {relatedGroupsCount} group{relatedGroupsCount !== 1 ? 's' : ''}
            </span>
          </div>
          {relatedGroupsCount > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span>
                Taught in {relatedGroupsCount} group
                {relatedGroupsCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Material Links Count */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="h-4 w-4 mr-1" />
            {course.materialLinks.length} material
            {course.materialLinks.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            {course.status === 'active' && (
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">Active</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {relatedGroupsCount > 2 && (
              <Badge
                variant="secondary"
                className="text-xs"
              >
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}


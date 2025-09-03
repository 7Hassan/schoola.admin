'use client'

import React, { useEffect } from 'react'
import {
  Plus,
  Upload,
  Minus,
  X,
  FileText,
  Users,
  GraduationCap,
  TrendingUp
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Card } from '@workspace/ui/components/ui/card'

import { useCoursesStore } from '@/stores/courses-store'
import { CoursesFilters } from './courses-filters'
import { CoursesGrid } from './courses-grid'
import { CoursesPagination } from './courses-pagination'
import { CourseEditDrawer } from './course-edit-drawer'
import { DeleteConfirmationModal } from '../shared/delete-confirmation-modal'
import { ExportModal } from '../shared/export-modal'
import { useRouter } from 'next/navigation'

export function CoursesDashboard() {
  const {
    courses,
    getFilteredCourses,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    getTotalPages,
    userRole,
    isDeleteMode,
    selectedCoursesForDeletion,
    enterDeleteMode,
    exitDeleteMode,
    confirmDeleteSelectedCourses,
    isDeleteModalOpen,
    closeDeleteModal,
    executeDeleteSelectedCourses,
    isExportModalOpen,
    openExportModal,
    closeExportModal
  } = useCoursesStore()

  const router = useRouter()
  const filteredCourses = getFilteredCourses()
  const totalCourses = courses.length
  const activeCourses = courses.filter(
    (course) => course.status === 'active'
  ).length
  const archivedCourses = courses.filter(
    (course) => course.status === 'archived'
  ).length
  const draftCourses = courses.filter(
    (course) => course.status === 'draft'
  ).length
  const totalGroups = courses.reduce(
    (sum, course) => sum + course.relatedGroupIds.length,
    0
  )

  const navigateAddCourse = () => {
    router.push('/courses/create')
  }

  // Calculate pagination
  const totalPages = getTotalPages()

  // Update pagination when filters change
  useEffect(() => {
    // Reset to first page if current page is beyond available pages
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [filteredCourses.length, currentPage, totalPages, setCurrentPage])

  const canEdit = userRole === 'admin' || userRole === 'super-admin'

  // Prepare modal data
  const selectedCourseNames = courses
    .filter((course) => selectedCoursesForDeletion.includes(course.id))
    .map((course) => course.name)

  // Mock export data format
  const formatCoursesForExport = (coursesToExport: typeof courses) => {
    return coursesToExport.map((course) => ({
      id: course.id,
      name: course.name,
      code: course.code,
      level: course.level,
      status: course.status,
      category: course.category,
      duration: course.duration,
      totalLectures: course.totalLectures,
      minAge: course.validAgeRange.minAge,
      maxAge: course.validAgeRange.maxAge,
      relatedGroups: course.relatedGroupIds.length,
      materialLinks: course.materialLinks.length,
      createdAt: course.createdAt.toISOString(),
      lastUpdated: course.lastUpdatedAt.toISOString()
    }))
  }

  return (
    <div className="space-y-6 p-6 h-screen overflow-y-auto">
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
          isDeleteMode
            ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
            : ''
        }`}
      >
        <div>
          <h1
            className={`text-3xl font-bold transition-colors ${
              isDeleteMode
                ? 'text-red-900 dark:text-red-100'
                : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {isDeleteMode ? 'Delete Courses' : 'Courses Management'}
          </h1>
          <p
            className={`mt-1 transition-colors ${
              isDeleteMode
                ? 'text-red-700 dark:text-red-300'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {isDeleteMode
              ? `${selectedCoursesForDeletion.length} course${selectedCoursesForDeletion.length !== 1 ? 's' : ''} selected for deletion`
              : 'Manage your course catalog and track student progress'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {!isDeleteMode ? (
            // Normal mode buttons
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={openExportModal}
              >
                <Upload className="h-4 w-4 mr-2" />
                Export
              </Button>

              {canEdit && (
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={navigateAddCourse}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              )}
              {canEdit && (
                <Button
                  size="sm"
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={enterDeleteMode}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Delete Courses
                </Button>
              )}
            </>
          ) : (
            // Delete mode buttons
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={exitDeleteMode}
                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950/30"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={confirmDeleteSelectedCourses}
                disabled={selectedCoursesForDeletion.length === 0}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Minus className="h-4 w-4 mr-2" />
                Delete ({selectedCoursesForDeletion.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-2xl font-bold text-foreground">
                {totalCourses}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-foreground">
                {activeCourses}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Draft</p>
              <p className="text-2xl font-bold text-foreground">
                {draftCourses}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-900/20 rounded-lg">
              <GraduationCap className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Archived</p>
              <p className="text-2xl font-bold text-foreground">
                {archivedCourses}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Related Groups</p>
              <p className="text-2xl font-bold text-foreground">
                {totalGroups}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <CoursesFilters />

      {/* Courses Grid */}
      <CoursesGrid />

      {/* Pagination */}
      <CoursesPagination />

      {/* Course Edit Drawer - Managed by individual course cards */}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={executeDeleteSelectedCourses}
        selectedCount={selectedCoursesForDeletion.length}
        selectedNames={selectedCourseNames}
        itemType="course"
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        data={formatCoursesForExport(filteredCourses)}
        defaultFilename="courses_export"
        title="Export Courses Data"
        description="Choose your preferred format to export the current course data:"
      />
    </div>
  )
}


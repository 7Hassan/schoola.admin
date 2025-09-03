'use client'

import React from 'react'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Upload,
  Minus,
  X,
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  Building2
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Input } from '@workspace/ui/components/ui/input'
import { Card } from '@workspace/ui/components/ui/card'
import {
  useTeachersManagementStore,
  type TeacherProfile
} from '@/stores/teachers'
import { TeacherDrawer } from './teacher-drawer'
import { TeachersFilters } from './teachers-filters'
import { TeachersGrid } from './teachers-grid'
import { DeleteConfirmationModal } from '../shared/delete-confirmation-modal'
import { ExportModal } from '../shared/export-modal'
import { formatTeachersForExport } from '@/utils/export-utils'
import Link from 'next/link'

export function TeachersDashboard() {
  const {
    // Data
    teachers,
    getFilteredTeachers,
    getPaginatedTeachers,
    departments,
    subjects,

    // UI State
    isDrawerOpen,
    isDeleteMode,
    selectedTeachersForDeletion,
    isDeleteModalOpen,
    isExportModalOpen,

    // Actions
    openDrawer,
    updateFilters,
    enterDeleteMode,
    exitDeleteMode,
    clearTeacherSelection,
    openDeleteModal,
    closeDeleteModal,
    deleteMultipleTeachers,
    openExportModal,
    closeExportModal,

    // Filters
    filters
  } = useTeachersManagementStore()

  const filteredTeachers = getFilteredTeachers()
  const paginatedTeachers = getPaginatedTeachers()

  const stats = {
    total: teachers.length,
    active: teachers.filter((t: TeacherProfile) => t.status === 'active')
      .length,
    inactive: teachers.filter((t: TeacherProfile) => t.status === 'inactive')
      .length,
    departments: new Set(teachers.map((t: TeacherProfile) => t.department)).size
  }

  const handleSearchChange = (value: string) => {
    updateFilters({ searchQuery: value })
  }

  // Prepare modal data
  const selectedTeacherNames = teachers
    .filter((teacher: TeacherProfile) =>
      selectedTeachersForDeletion.includes(teacher.id)
    )
    .map((teacher: TeacherProfile) => teacher.name)

  return (
    <div className="space-y-6 p-6 overflow-y-auto w-full h-screen">
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
            {isDeleteMode ? 'Delete Teachers' : 'Teachers Management'}
          </h1>
          <p
            className={`mt-1 transition-colors ${
              isDeleteMode
                ? 'text-red-700 dark:text-red-300'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {isDeleteMode
              ? `${selectedTeachersForDeletion.length} teacher${selectedTeachersForDeletion.length !== 1 ? 's' : ''} selected for deletion`
              : 'Manage teacher profiles, assignments, and academic information'}
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

              <Button
                size="sm"
                className="bg-destructive hover:bg-destructive/90"
                onClick={enterDeleteMode}
              >
                <Minus className="h-4 w-4 mr-2" />
                Delete Teacher
              </Button>

              <Link href="/teachers/create">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Teacher
                </Button>
              </Link>
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
                onClick={openDeleteModal}
                disabled={selectedTeachersForDeletion.length === 0}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Minus className="h-4 w-4 mr-2" />
                Delete ({selectedTeachersForDeletion.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Teachers</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.active}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.inactive}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Departments</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.departments}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <TeachersFilters />

      {/* Teachers Grid */}
      <TeachersGrid />

      {/* Teacher Drawer */}
      <TeacherDrawer />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => {
          deleteMultipleTeachers(selectedTeachersForDeletion)
          closeDeleteModal()
        }}
        selectedCount={selectedTeachersForDeletion.length}
        selectedNames={selectedTeacherNames}
        itemType="teacher"
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        data={formatTeachersForExport(filteredTeachers, departments, subjects)}
        defaultFilename="teachers_export"
        title="Export Teachers Data"
        description="Choose your preferred format to export the current teachers data:"
      />
    </div>
  )
}


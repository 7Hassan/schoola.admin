"use client"

import { StudentsFilters } from './students-filters'
import { StudentsGrid } from './students-grid'
import { StudentDrawer } from './student-drawer'
import { DeleteConfirmationModal } from '../shared/delete-confirmation-modal'
import { ExportModal } from '../shared/export-modal'
import { useStudentsStore } from '@/stores/students-store'
import { formatStudentsForExport } from '@/utils/export-utils'
import { StudentsHeader } from './students-header'
import { StudentsStats } from './students-stats'
import React from 'react'

export function StudentsDashboard() {
  const {
    getFilteredStudents,
    userRole,
    setUserRole,
    openAddDrawer,
    isDeleteMode,
    selectedStudentsForDeletion,
    enterDeleteMode,
    exitDeleteMode,
    confirmDeleteSelectedStudents,
    isDeleteModalOpen,
    closeDeleteModal,
    executeDeleteSelectedStudents,
    students: allStudents,
    isExportModalOpen,
    openExportModal,
    closeExportModal
  } = useStudentsStore()

  const students = getFilteredStudents()

  const stats = {
    total: students.length,
    active: students.filter((s) => s.status === 'Active').length,
    archived: students.filter((s) => s.status === 'Archived').length,
    freeDay: students.filter((s) => s.status === 'Free-day').length,
    waiting: students.filter((s) => s.status === 'Waiting').length
  }

  const canEdit = userRole === 'admin' || userRole === 'super-admin'

  // Prepare modal data
  const selectedStudentNames = allStudents
    .filter((student) => selectedStudentsForDeletion.includes(student.id))
    .map((student) => student.childName)

  return (
    <div className="space-y-6">
      <StudentsHeader
        isDeleteMode={isDeleteMode}
        selectedCount={selectedStudentsForDeletion.length}
        openExportModal={openExportModal}
        openAddDrawer={openAddDrawer}
        enterDeleteMode={enterDeleteMode}
        exitDeleteMode={exitDeleteMode}
        confirmDeleteSelectedStudents={confirmDeleteSelectedStudents}
        canEdit={canEdit}
      />

      <StudentsStats
        total={stats.total}
        active={stats.active}
        archived={stats.archived}
        freeDay={stats.freeDay}
        waiting={stats.waiting}
      />

      {/* Filters */}
      <StudentsFilters />

      {/* Students Grid */}
      <StudentsGrid />

      {/* Student Edit Drawer */}
      <StudentDrawer />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={executeDeleteSelectedStudents}
        selectedCount={selectedStudentsForDeletion.length}
        selectedNames={selectedStudentNames}
        itemType="student"
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        data={formatStudentsForExport(students)}
        defaultFilename="students_export"
        title="Export Students Data"
        description="Choose your preferred format to export the current student data:"
      />
    </div>
  )
}


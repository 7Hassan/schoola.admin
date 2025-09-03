'use client'

import { useStudentsStore } from '@/stores/students-store'
import React from 'react'
import { StudentsResultsSummary } from './grid/students-results-summary'
import { StudentsCardsGrid } from './grid/students-cards-grid'
import { StudentsPagination } from './grid/students-pagination'
import { computeVisiblePages } from './grid/pagination-utils'
import { StudentsEmptyState } from './grid/students-empty-state'

export function StudentsGrid() {
  const {
    getPaginatedStudents,
    getFilteredStudents,
    currentPage,
    setCurrentPage,
    getTotalPages,
    itemsPerPage,
    isDeleteMode,
    selectedStudentsForDeletion,
    selectAllStudentsForDeletion,
    clearSelectedStudentsForDeletion
  } = useStudentsStore()

  const students = getPaginatedStudents()
  const totalStudents = getFilteredStudents().length
  const totalPages = getTotalPages()
  const allStudents = getFilteredStudents()
  const allStudentsSelected =
    allStudents.length > 0 && allStudents.every((student) => selectedStudentsForDeletion.includes(student.id))

  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalStudents)

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handleSelectAll = () => {
    if (allStudentsSelected) clearSelectedStudentsForDeletion()
    else selectAllStudentsForDeletion()
  }

  const handlePageClick = (page: number) => setCurrentPage(page)

  const getVisiblePages = () => computeVisiblePages(currentPage, totalPages)

  if (students.length === 0) return <StudentsEmptyState />
  console.log('🚀 ~ students:', students)

  return (
    <div className="space-y-6">
      <StudentsResultsSummary
        startIndex={startIndex}
        endIndex={endIndex}
        totalStudents={totalStudents}
        isDeleteMode={isDeleteMode}
        allStudentsSelected={allStudentsSelected}
        onSelectAll={handleSelectAll}
        selectedCount={selectedStudentsForDeletion.length}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <StudentsCardsGrid students={students} />

      <StudentsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
        onPageClick={handlePageClick}
        getVisiblePages={getVisiblePages}
      />
    </div>
  )
}



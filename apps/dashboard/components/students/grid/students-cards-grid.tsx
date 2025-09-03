"use client"

import React from 'react'
import { StudentCard } from '../student-card'

export interface StudentsCardsGridProps {
  students: any[]
}

export function StudentsCardsGrid({ students }: StudentsCardsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  )
}

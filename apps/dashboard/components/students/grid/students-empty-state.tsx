"use client"

import React from 'react'
import { Users } from 'lucide-react'

export function StudentsEmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Users className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
      <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria to find students.</p>
    </div>
  )
}

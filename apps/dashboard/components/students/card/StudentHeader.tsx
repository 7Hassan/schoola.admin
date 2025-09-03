import React from 'react'
import { StudentStatusBadges } from './StudentStatusBadges'
import { StudentStatus } from '@/stores/students-store'

interface StudentHeaderProps {
  childName: string
  parentName: string
  id: string
  isDeleteMode: boolean
  isSelectedForDeletion: boolean
  StudentAvatar: React.ComponentType<{ name: string }>
  status: StudentStatus
  paid: boolean
}

export function StudentHeader({
  childName,
  parentName,
  isDeleteMode,
  isSelectedForDeletion,
  StudentAvatar,
  status,
  paid
}: StudentHeaderProps) {
  const displayName = parentName ? `${childName} ${parentName}` : childName;

  return (
    <div className="flex items-center space-x-3 w-full mb-4">
      <StudentAvatar name={displayName} />
      <div className="min-w-0 flex-1 overflow-hidden">
        <h3
          title={displayName}
          className={`font-semibold mt-2 transition-colors truncate whitespace-nowrap text-overflow-ellipsis ${isDeleteMode
            ? isSelectedForDeletion
              ? 'text-red-900 dark:text-red-100'
              : 'text-gray-900 dark:text-gray-100'
            : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-600'
            }`}
        >
          {displayName}
        </h3>
        <div className="flex flex-row justify-end items-end space-x-1">
          <StudentStatusBadges status={status} paid={paid} />
        </div>
      </div>

    </div>
  )
}

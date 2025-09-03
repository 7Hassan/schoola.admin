import React from 'react'

interface StudentHeaderProps {
  childName: string
  parentName: string
  id: string
  isDeleteMode: boolean
  isSelectedForDeletion: boolean
  StudentAvatar: React.ComponentType<{ name: string }>
}

export function StudentHeader({ childName, parentName, isDeleteMode, isSelectedForDeletion, StudentAvatar }: StudentHeaderProps) {
  const displayName = parentName ? `${childName} ${parentName}` : childName;
  return (
    <div className="flex items-center space-x-3">
      <StudentAvatar name={displayName} />
      <div>
        <h3
          className={`font-semibold transition-colors ${isDeleteMode
            ? isSelectedForDeletion
              ? 'text-red-900 dark:text-red-100'
              : 'text-gray-900 dark:text-gray-100'
            : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-600'
            }`}
        >
          {displayName}
        </h3>
      </div>
    </div>
  )
}

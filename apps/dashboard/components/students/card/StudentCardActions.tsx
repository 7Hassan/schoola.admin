import { Button } from '@workspace/ui/components/ui/button'
import { Edit, Eye } from 'lucide-react'
import { Student } from '@/stores/students-store'

interface StudentCardActionsProps {
  canEdit: boolean
  isDeleteMode: boolean
  isSelectedForDeletion: boolean
  openEditDrawer: (student: Student) => void
  student: Student
}

export function StudentCardActions({
  canEdit,
  isDeleteMode,
  isSelectedForDeletion,
  openEditDrawer,
  student
}: StudentCardActionsProps) {
  if (!isDeleteMode) {
    return (
      <Button
        onClick={(e) => {
          e.stopPropagation()
          openEditDrawer(student)
        }}
        variant="outline"
        size="sm"
        className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"
      >
        {canEdit ? (
          <>
            <Edit className="h-4 w-4 mr-2" />
            Edit Details
          </>
        ) : (
          <>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </>
        )}
      </Button>
    )
  }
  return (
    <div className="text-center">
      <p
        className={`text-sm font-medium ${isSelectedForDeletion
          ? 'text-red-700 dark:text-red-300'
          : 'text-gray-500 dark:text-gray-400'
          }`}
      >
        {isSelectedForDeletion ? 'Selected for deletion' : 'Click to select'}
      </p>
    </div>
  )
}

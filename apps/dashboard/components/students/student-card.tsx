
import { Card } from '@workspace/ui/components/ui/card'
import { useRouter } from 'next/navigation'
import { Student, useStudentsStore } from '@/stores/students-store'
import { StudentDetails } from './card/StudentDetails'
import { StudentCardActions } from './card/StudentCardActions'
import { StudentHeader } from './card/StudentHeader'
import { StudentAvatar } from './card/StudentAvatar'
import { StudentStatusBadges } from './card/StudentStatusBadges'
import { StudentContact } from './card/StudentContact'

interface StudentCardProps {
  student: Student
}

export function StudentCard({ student }: StudentCardProps) {
  const router = useRouter()
  const {
    userRole,
    isDeleteMode,
    selectedStudentsForDeletion,
    toggleStudentForDeletion,
    openEditDrawer
  } = useStudentsStore()
  const canEdit = userRole === 'admin' || userRole === 'super-admin'
  const isSelectedForDeletion = selectedStudentsForDeletion.includes(student.id)

  const handleCardClick = () => {
    if (isDeleteMode) {
      toggleStudentForDeletion(student.id)
    } else {
      router.push(`/students/profile/${student.id}`)
    }
  }

  return (
    <Card
      className={`p-6 transition-all duration-200 cursor-pointer group ${isDeleteMode
        ? isSelectedForDeletion
          ? 'border-2 border-red-500 bg-red-50 dark:bg-red-950/20 shadow-lg'
          : 'border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
        : 'hover:shadow-lg'
        }`}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <StudentHeader
          childName={student.childName}
          parentName={student.parentName}
          id={student.id}
          isDeleteMode={isDeleteMode}
          isSelectedForDeletion={isSelectedForDeletion}
          StudentAvatar={StudentAvatar}
        />
        <div className="flex flex-col items-end space-y-2">
          <StudentStatusBadges status={student.status} paid={student.paid} />
        </div>
      </div>
      <StudentContact parentPhone={student.parentPhone} />

      <StudentDetails
        age={student.age}
        group={student.group}
        source={student.source}
        info={student.info}
        createdAt={student.createdAt}
        lastUpdatedAt={student.lastUpdatedAt}
      />

      <div className="mt-4 pt-4 border-t border-gray-100">
        <StudentCardActions
          canEdit={canEdit}
          isDeleteMode={isDeleteMode}
          isSelectedForDeletion={isSelectedForDeletion}
          openEditDrawer={openEditDrawer}
          student={student}
        />
      </div>
    </Card>
  )
}


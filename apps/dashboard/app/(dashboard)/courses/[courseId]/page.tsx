import { CourseProfile } from '@/components/courses'

interface CourseProfilePageProps {
  params: {
    courseId: string
  }
}

export default function CourseProfilePage({ params }: CourseProfilePageProps) {
  return <CourseProfile courseId={params.courseId} />
}


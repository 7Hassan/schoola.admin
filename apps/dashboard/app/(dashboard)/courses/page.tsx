import { redirect } from 'next/navigation'

export default function CoursesPage() {
  // Redirect to the management sub-page by default
  redirect('/courses/management')
}


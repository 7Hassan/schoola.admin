import { redirect } from 'next/navigation'

export default function StudentsPage() {
  // Redirect to the management sub-page by default
  redirect('/students/management')
}


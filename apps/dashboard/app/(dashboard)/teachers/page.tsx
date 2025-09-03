import { redirect } from 'next/navigation'

export default function TeachersPage() {
  // Redirect to the management sub-page by default
  redirect('/teachers/management')
}


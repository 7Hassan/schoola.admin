import { redirect } from 'next/navigation'

export default function FormsPage() {
  // Redirect to the form management page by default
  redirect('/forms/management')
}


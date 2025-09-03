import { redirect } from 'next/navigation'

export default function DashboardPage() {
  // Redirect to the overview sub-page by default
  redirect('/dashboard/home')
}


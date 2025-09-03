import { redirect } from 'next/navigation'

export default function GroupsPage() {
  // Redirect to the overview sub-page by default
  redirect('/groups/management')
}


import { redirect } from 'next/navigation'

export default function SettingsPage() {
  // Redirect to the profile settings sub-page by default
  redirect('/settings/profile')
}


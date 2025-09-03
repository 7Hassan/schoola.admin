import { redirect } from 'next/navigation'

export default function LocationsPage() {
  // Redirect to the management sub-page by default
  redirect('/locations/management')
}


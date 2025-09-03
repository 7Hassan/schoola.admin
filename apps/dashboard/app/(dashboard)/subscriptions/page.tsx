import { redirect } from 'next/navigation'

export default function SubscriptionsIndex() {
  // Redirect to the management sub-page by default
  redirect('/subscriptions/management')
}

import { SidebarWrapper } from '../../components/sidebar-wrapper'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarWrapper />
      <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
    </div>
  )
}


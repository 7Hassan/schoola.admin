import { SidebarWrapper } from '../../components/sidebar-wrapper'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full bg-gray-50">
      <SidebarWrapper />
      <main className="flex-1 h-screen overflow-hidden">{children}</main>
    </div>
  )
}


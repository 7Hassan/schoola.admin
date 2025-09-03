import { Activity, Clock, User, FileText, Users, Bell } from 'lucide-react'

export default function DashboardActivityPage() {
  const activities = [
    {
      id: 1,
      type: 'enrollment',
      title: 'New student enrollment',
      description: 'John Smith has been enrolled in Grade 10',
      user: 'Sarah Johnson',
      timestamp: '2 minutes ago',
      icon: User,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 2,
      type: 'form',
      title: 'Form published',
      description: 'Student Feedback Form has been published',
      user: 'Mike Davis',
      timestamp: '1 hour ago',
      icon: FileText,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 3,
      type: 'group',
      title: 'Group created',
      description: 'Math Advanced Group has been created',
      user: 'Emma Wilson',
      timestamp: '2 hours ago',
      icon: Users,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 4,
      type: 'attendance',
      title: 'Attendance recorded',
      description: 'Morning attendance for Grade 9A has been recorded',
      user: 'David Brown',
      timestamp: '3 hours ago',
      icon: Clock,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      id: 5,
      type: 'system',
      title: 'System maintenance',
      description: 'Scheduled maintenance completed successfully',
      user: 'System',
      timestamp: '1 day ago',
      icon: Bell,
      color: 'text-gray-600 bg-gray-100'
    }
  ]

  return (
    <div className="p-6 h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Recent Activity</h1>
          <p className="text-gray-600 mt-2">
            Track all recent activities and changes in your system
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="whitespace-nowrap py-2 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
                All Activity
              </button>
              <button className="whitespace-nowrap py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Forms
              </button>
              <button className="whitespace-nowrap py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Students
              </button>
              <button className="whitespace-nowrap py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Teachers
              </button>
              <button className="whitespace-nowrap py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                System
              </button>
            </nav>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Activity Timeline
            </h2>

            <div className="space-y-4">
              {activities.map((activity, index) => {
                const IconComponent = activity.icon
                return (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4"
                  >
                    <div
                      className={`flex-shrink-0 p-2 rounded-full ${activity.color}`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.timestamp}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        by {activity.user}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Load More Button */}
            <div className="mt-6 text-center">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Load More Activities
              </button>
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Today's Forms
                </p>
                <p className="text-lg font-semibold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  New Students
                </p>
                <p className="text-lg font-semibold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Active Users
                </p>
                <p className="text-lg font-semibold text-gray-900">145</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


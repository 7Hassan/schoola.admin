import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Download,
  Filter,
  Search,
  User
} from 'lucide-react'

export default function StudentsAttendancePage() {
  const attendanceData = [
    {
      id: 1,
      name: 'John Smith',
      grade: '10th Grade',
      totalDays: 180,
      presentDays: 172,
      absentDays: 8,
      attendanceRate: 95.6,
      status: 'present',
      lastAttended: '2024-08-07'
    },
    {
      id: 2,
      name: 'Emma Johnson',
      grade: '10th Grade',
      totalDays: 180,
      presentDays: 178,
      absentDays: 2,
      attendanceRate: 98.9,
      status: 'present',
      lastAttended: '2024-08-07'
    },
    {
      id: 3,
      name: 'Michael Brown',
      grade: '10th Grade',
      totalDays: 180,
      presentDays: 165,
      absentDays: 15,
      attendanceRate: 91.7,
      status: 'absent',
      lastAttended: '2024-08-05'
    }
  ]

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600 bg-green-100'
    if (rate >= 90) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusIcon = (status: string) => {
    return status === 'present' ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Management
          </h1>
          <p className="text-gray-600 mt-2">
            Track and manage student attendance records
          </p>
        </div>

        {/* Attendance Overview Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Overall Attendance
                </p>
                <p className="text-2xl font-bold text-gray-900">94.2%</p>
                <p className="text-xs text-green-600 mt-1">
                  +1.2% from last week
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Present Today
                </p>
                <p className="text-2xl font-bold text-gray-900">1,156</p>
                <p className="text-xs text-gray-600 mt-1">
                  out of 1,234 students
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Absent Today
                </p>
                <p className="text-2xl font-bold text-gray-900">78</p>
                <p className="text-xs text-red-600 mt-1">
                  6.3% of total students
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Late Arrivals
                </p>
                <p className="text-2xl font-bold text-gray-900">15</p>
                <p className="text-xs text-yellow-600 mt-1">
                  Arrived after 8:30 AM
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Take Attendance
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                Mark All Present
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
                <Download className="h-4 w-4 inline mr-2" />
                Export Report
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Today: August 7, 2024
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>All Grades</option>
                <option>9th Grade</option>
                <option>10th Grade</option>
                <option>11th Grade</option>
                <option>12th Grade</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>All Status</option>
                <option>Present</option>
                <option>Absent</option>
                <option>Late</option>
              </select>
              <input
                type="date"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                defaultValue="2024-08-07"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Attendance List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Student Attendance
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Present/Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Attended
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.grade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(student.status)}
                          <span
                            className={`ml-2 text-sm font-medium ${
                              student.status === 'present'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {student.status === 'present'
                              ? 'Present'
                              : 'Absent'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getAttendanceColor(student.attendanceRate)}`}
                        >
                          {student.attendanceRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.presentDays}/{student.totalDays}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.lastAttended}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-center">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Load More Students
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Calendar */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Attendance Calendar
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-3">
                This Week
              </h3>
              <div className="space-y-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(
                  (day, index) => (
                    <div
                      key={day}
                      className="flex items-center justify-between p-2 rounded border"
                    >
                      <span className="text-sm text-gray-700">{day}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600">
                          Present: 95%
                        </span>
                        <span className="text-sm text-red-600">Absent: 5%</span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-3">
                Monthly Summary
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Average Daily Attendance
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    94.2%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Best Day</span>
                  <span className="text-sm font-medium text-gray-900">
                    Monday (96.8%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lowest Day</span>
                  <span className="text-sm font-medium text-gray-900">
                    Friday (91.5%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Chronic Absentees
                  </span>
                  <span className="text-sm font-medium text-red-600">
                    12 students
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


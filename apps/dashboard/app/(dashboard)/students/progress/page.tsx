import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Award,
  Calendar,
  User,
  BookOpen,
  Target
} from 'lucide-react'

export default function StudentsProgressPage() {
  const students = [
    {
      id: 1,
      name: 'John Smith',
      grade: '10th Grade',
      overallGrade: 85,
      trend: 'up',
      subjects: [
        { name: 'Mathematics', grade: 88, trend: 'up' },
        { name: 'English', grade: 82, trend: 'stable' },
        { name: 'Science', grade: 90, trend: 'up' },
        { name: 'History', grade: 78, trend: 'down' }
      ]
    },
    {
      id: 2,
      name: 'Emma Johnson',
      grade: '10th Grade',
      overallGrade: 92,
      trend: 'up',
      subjects: [
        { name: 'Mathematics', grade: 95, trend: 'up' },
        { name: 'English', grade: 90, trend: 'up' },
        { name: 'Science', grade: 88, trend: 'stable' },
        { name: 'History', grade: 94, trend: 'up' }
      ]
    },
    {
      id: 3,
      name: 'Michael Brown',
      grade: '10th Grade',
      overallGrade: 76,
      trend: 'down',
      subjects: [
        { name: 'Mathematics', grade: 72, trend: 'down' },
        { name: 'English', grade: 80, trend: 'stable' },
        { name: 'Science', grade: 75, trend: 'down' },
        { name: 'History', grade: 78, trend: 'up' }
      ]
    }
  ]

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === 'down')
      return <TrendingDown className="h-4 w-4 text-red-600" />
    return <div className="h-4 w-4" />
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-100'
    if (grade >= 80) return 'text-blue-600 bg-blue-100'
    if (grade >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Progress Tracking
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor academic performance and track student progress over time
          </p>
        </div>

        {/* Progress Overview Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Grade
                </p>
                <p className="text-2xl font-bold text-gray-900">84.3%</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.1% from last month
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Top Performers
                </p>
                <p className="text-2xl font-bold text-gray-900">23</p>
                <p className="text-xs text-gray-600 mt-1">Students with 90%+</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  At Risk Students
                </p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-red-600 mt-1">Below 70% average</p>
              </div>
              <Target className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Improvement Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">76%</p>
                <p className="text-xs text-green-600 mt-1">
                  Students improving
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filter and Search */}
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
                <option>All Subjects</option>
                <option>Mathematics</option>
                <option>English</option>
                <option>Science</option>
                <option>History</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
              />
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Student Progress List */}
        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-600">{student.grade}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(student.overallGrade)}`}
                  >
                    {student.overallGrade}%
                  </div>
                  {getTrendIcon(student.trend)}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {student.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {subject.name}
                      </h4>
                      {getTrendIcon(subject.trend)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-lg font-bold ${getGradeColor(subject.grade).split(' ')[0]}`}
                      >
                        {subject.grade}%
                      </span>
                      <BookOpen className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View Detailed Report
                </button>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Last updated: 2 hours ago</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-6 text-center">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Load More Students
          </button>
        </div>

        {/* Progress Analytics */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Progress Analytics
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-3">
                Grade Distribution
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">A (90-100%)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: '35%' }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">35%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">B (80-89%)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: '45%' }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">C (70-79%)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: '15%' }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">15%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">D (60-69%)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: '5%' }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">5%</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-3">
                Subject Performance
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mathematics</span>
                  <span className="text-sm font-medium text-gray-900">
                    83.2%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">English</span>
                  <span className="text-sm font-medium text-gray-900">
                    86.1%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Science</span>
                  <span className="text-sm font-medium text-gray-900">
                    84.7%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">History</span>
                  <span className="text-sm font-medium text-gray-900">
                    82.5%
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


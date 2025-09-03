export default function StudentsEnrollmentPage() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Enrollment
          </h1>
          <p className="text-gray-600 mt-2">
            Manage student registration and enrollment processes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Enrollment Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Enrolled Students</span>
                <span className="font-semibold text-green-600">1,186</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Applications</span>
                <span className="font-semibold text-yellow-600">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Waitlisted</span>
                <span className="font-semibold text-blue-600">14</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rejected</span>
                <span className="font-semibold text-red-600">8</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Process Pending Applications
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Bulk Enrollment
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                Generate Enrollment Report
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Enrollment Applications
              </h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add New Student
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Pending Applications
              </h3>
              <p className="text-gray-500">
                Student enrollment applications will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


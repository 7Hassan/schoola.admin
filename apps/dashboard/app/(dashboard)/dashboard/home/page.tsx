import {
  Users,
  FileText,
  GraduationCap,
  TrendingUp,
  BookOpen,
  MapPin
} from 'lucide-react'

import { actionCategoryArray } from '@/statics/dashboardQuickActions'
import Link from 'next/link'

export default function DashboardHomePage() {
  return (
    <div className="p-6 h-screen overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Home</h1>
          <p className="text-gray-600 mt-2">
            Welcome to your Schoola dashboard overview
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
                <p className="text-xs text-green-600 mt-1">
                  +12% from last month
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Teachers
                </p>
                <p className="text-2xl font-bold text-gray-900">87</p>
                <p className="text-xs text-green-600 mt-1">+3 new this week</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Forms
                </p>
                <p className="text-2xl font-bold text-gray-900">42</p>
                <p className="text-xs text-blue-600 mt-1">8 submitted today</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Attendance Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">94.2%</p>
                <p className="text-xs text-green-600 mt-1">
                  +2.1% from last week
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      New student enrollment: John Smith
                    </p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Form "Student Feedback" published
                    </p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Teacher assignment updated: Math Grade 9
                    </p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {actionCategoryArray.map((actionCategory) => (
                <div key={actionCategory.category}>
                  <p className="font-semibold text-gray-900">
                    {actionCategory.category}
                  </p>
                  {actionCategory.actions.map((action) =>
                    action.type === 'link' && action.href ? (
                      <Link
                        key={action.title}
                        className="w-full text-left flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
                        href={action.href}
                      >
                        <action.icon className="h-5 w-5 text-gray-600" />
                        <span className="text-sm text-gray-900">
                          {action.title}
                        </span>
                      </Link>
                    ) : (
                      <button
                        key={action.title}
                        className="w-full text-left flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
                        type="button"
                        onClick={action.onClick}
                      >
                        <action.icon className="h-5 w-5 text-gray-600" />
                        <span className="text-sm text-gray-900">
                          {action.title}
                        </span>
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


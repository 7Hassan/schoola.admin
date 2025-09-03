'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Edit,
  Archive,
  Clock,
  BookOpen,
  Users,
  FileText,
  Calendar,
  Star,
  TrendingUp,
  Link as LinkIcon,
  Download,
  Eye,
  Settings
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Card } from '@workspace/ui/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@workspace/ui/components/ui/tabs'
import { Separator } from '@workspace/ui/components/ui/separator'
import {
  useCoursesStore,
  type Course,
  type MaterialLink
} from '@/stores/courses-store'
import { CourseEditDrawer } from './course-edit-drawer'

interface CourseProfileProps {
  courseId: string
}

export function CourseProfile({ courseId }: CourseProfileProps) {
  const router = useRouter()
  const { courses, userRole, archiveCourse } = useCoursesStore()
  const [course, setCourse] = useState<Course | null>(null)

  useEffect(() => {
    const foundCourse = courses.find((c) => c.id === courseId)
    if (foundCourse) {
      setCourse(foundCourse)
    } else {
      // Course not found, redirect back to management
      router.push('/courses/management')
    }
  }, [courseId, courses, router])

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">Course not found</div>
          <Button
            variant="outline"
            onClick={() => router.push('/courses/management')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    )
  }

  const categoryColor = useCoursesStore(
    (state) =>
      state.categories.find((cat) => cat.id === course.category)?.color ||
      '#6B7280'
  )

  const handleArchive = () => {
    archiveCourse(course.id)
    router.push('/courses/management')
  }

  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'draft':
        return 'bg-yellow-500'
      case 'archived':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getLevelColor = (level: Course['level']) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getMaterialTypeIcon = (type: MaterialLink['type']) => {
    switch (type) {
      case 'video':
        return <Eye className="h-4 w-4" />
      case 'pdf':
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'link':
        return <LinkIcon className="h-4 w-4" />
      case 'image':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const canEdit = userRole === 'admin' || userRole === 'super-admin'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/courses/management')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="secondary"
                className="text-xs"
                style={{
                  backgroundColor: `${categoryColor}20`,
                  color: categoryColor
                }}
              >
                {course.code}
              </Badge>
              <Badge className={`text-xs ${getLevelColor(course.level)}`}>
                {course.level}
              </Badge>
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(course.status)}`}
                title={`Status: ${course.status}`}
              />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {course.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {course.description}
            </p>
          </div>
        </div>

        {canEdit && course.status === 'active' && (
          <div className="flex items-center gap-2">
            <CourseEditDrawer course={course}>
              <Button
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            </CourseEditDrawer>
            <Button
              variant="outline"
              size="sm"
              onClick={handleArchive}
              className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-xl font-bold text-foreground">
                {course.duration} weeks
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lectures</p>
              <p className="text-xl font-bold text-foreground">
                {course.totalLectures}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Groups</p>
              <p className="text-xl font-bold text-foreground">
                {course.relatedGroupIds.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Materials</p>
              <p className="text-xl font-bold text-foreground">
                {course.materialLinks.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        defaultValue="overview"
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="groups">Related Groups</TabsTrigger>
          {canEdit && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>

        <TabsContent
          value="overview"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Course Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Age Range
                  </span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-sm">
                      {course.validAgeRange.minAge}-
                      {course.validAgeRange.maxAge} years
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    {course.status === 'active' && (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    )}
                    <span className="text-sm capitalize">{course.status}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {course.createdAt.toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Updated
                  </span>
                  <span className="text-sm">
                    {course.lastUpdatedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Learning Objectives */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Learning Objectives
              </h3>
              <ul className="space-y-2">
                {course.learningObjectives.map((objective, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2"
                  >
                    <Star className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {objective}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value="materials"
          className="space-y-6"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Course Materials</h3>
            {course.materialLinks.length > 0 ? (
              <div className="space-y-3">
                {course.materialLinks.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getMaterialTypeIcon(material.type)}
                      <div>
                        <p className="text-sm font-medium">{material.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {material.type} • Added{' '}
                          {material.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                      {material.isRequired && (
                        <Badge
                          variant="secondary"
                          className="text-xs"
                        >
                          Required
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No materials uploaded yet</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent
          value="groups"
          className="space-y-6"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Related Groups</h3>
            {course.relatedGroupIds.length > 0 ? (
              <div className="space-y-3">
                {/* Mock group data - in real implementation, fetch actual group info */}
                {course.relatedGroupIds.map((groupId) => (
                  <div
                    key={groupId}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Group {groupId}</p>
                        <p className="text-xs text-muted-foreground">
                          Active students taking this course
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      View Group
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No groups assigned to this course
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        {canEdit && (
          <TabsContent
            value="settings"
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Course Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Edit Course Details</p>
                    <p className="text-sm text-muted-foreground">
                      Update course information, materials, and settings
                    </p>
                  </div>
                  <CourseEditDrawer course={course}>
                    <Button>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Course
                    </Button>
                  </CourseEditDrawer>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Archive Course</p>
                    <p className="text-sm text-muted-foreground">
                      Remove this course from active listings
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleArchive}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}


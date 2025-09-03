'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Student, useStudentsStore } from '@/stores/students-store'
import { Card } from '@workspace/ui/components/ui/card'
import { Button } from '@workspace/ui/components/ui/button'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Avatar, AvatarFallback } from '@workspace/ui/components/ui/avatar'
import { Separator } from '@workspace/ui/components/ui/separator'
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  Calendar,
  Users,
  FileText,
  User,
  MapPin,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'
import { parsePhoneNumber, getPhoneDigits } from '@/utils/phone-utils'

export default function StudentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { students, openEditDrawer, userRole } = useStudentsStore()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  const canEdit = userRole === 'admin' || userRole === 'super-admin'
  const studentId = params.id as string

  useEffect(() => {
    const loadStudent = () => {
      setLoading(true)

      // Find student in the store
      const foundStudent = students.find((s) => s.id === studentId)
      setStudent(foundStudent || null)
      setLoading(false)
    }

    loadStudent()
  }, [studentId, students])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Archived':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Free-day':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPaidStatusColor = (paid: boolean) => {
    return paid
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200'
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">
            Loading student profile...
          </div>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Student Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              The student with ID "{studentId}" could not be found.
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Student Profile
            </h1>
            <p className="text-muted-foreground">
              Detailed information about {student.name}
            </p>
          </div>
        </div>
        {canEdit && (
          <Button onClick={() => openEditDrawer(student)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Student
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-start space-x-6 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-2xl">
                  {student.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {student.name}
                  </h2>
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(student.status)}>
                      {student.status}
                    </Badge>
                    <Badge className={getPaidStatusColor(student.paid)}>
                      {student.paid ? 'Paid' : 'Unpaid'}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  ID: {student.id}
                </p>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Parent Phone
                    </p>
                    <a
                      href={`tel:${getPhoneDigits(student.parentPhone)}`}
                      className="font-medium hover:text-blue-600 hover:underline transition-colors"
                    >
                      {parsePhoneNumber(student.parentPhone).formatted ||
                        student.parentPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${student.email}`}
                      className="font-medium hover:text-blue-600 hover:underline transition-colors break-all"
                    >
                      {student.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">{student.age} years old</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Group</p>
                    <Badge variant="outline">{student.group}</Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Source</p>
                    <p className="font-medium">{student.source}</p>
                  </div>
                </div>
              </div>
            </div>

            {student.info && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Additional Information
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {student.info}
                    </p>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Side Info Cards */}
        <div className="space-y-6">
          {/* Timestamps */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {format(student.createdAt, 'MMM dd, yyyy')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(student.createdAt, 'HH:mm')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {format(student.lastUpdatedAt, 'MMM dd, yyyy')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(student.lastUpdatedAt, 'HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Phone className="h-4 w-4 mr-2" />
                <a
                  href={`tel:${getPhoneDigits(student.parentPhone)}`}
                  className="flex-1 text-left"
                >
                  Call Parent
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Mail className="h-4 w-4 mr-2" />
                <a
                  href={`mailto:${student.email}`}
                  className="flex-1 text-left"
                >
                  Send Email
                </a>
              </Button>
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => openEditDrawer(student)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}


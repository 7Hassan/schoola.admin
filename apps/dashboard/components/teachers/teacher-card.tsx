'use client'

import React from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  GraduationCap,
  Building2,
  Users,
  Edit,
  User,
  UserCheck,
  UserX,
  Briefcase
} from 'lucide-react'
import { Card } from '@workspace/ui/components/ui/card'
import { Button } from '@workspace/ui/components/ui/button'
import { Badge } from '@workspace/ui/components/ui/badge'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@workspace/ui/components/ui/avatar'
import {
  TeacherProfile,
  useTeachersManagementStore
} from '@/stores/teachers/management-store'

interface TeacherCardProps {
  teacher: TeacherProfile
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  const {
    departments,
    subjects,
    openDrawer,
    isDeleteMode,
    selectedTeachersForDeletion,
    toggleTeacherSelection
  } = useTeachersManagementStore()

  const getDepartmentName = (departmentId: string) => {
    return (
      departments.find((d) => d.id === departmentId)?.name ||
      'Unknown Department'
    )
  }

  const getSubjectNames = (subjectIds: string[]) => {
    return subjectIds
      .map((id) => subjects.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3) // Show max 3 subjects
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <UserCheck className="h-4 w-4 text-green-600" />
      case 'inactive':
        return <UserX className="h-4 w-4 text-red-600" />
      case 'on_leave':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'full_time':
        return 'bg-blue-100 text-blue-800'
      case 'part_time':
        return 'bg-purple-100 text-purple-800'
      case 'contract':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatEmploymentType = (type: string) => {
    switch (type) {
      case 'full_time':
        return 'Full Time'
      case 'part_time':
        return 'Part Time'
      case 'contract':
        return 'Contract'
      default:
        return type
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date))
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const isSelected = selectedTeachersForDeletion.includes(teacher.id)

  const handleCardClick = () => {
    if (isDeleteMode) {
      toggleTeacherSelection(teacher.id)
    } else {
      openDrawer(teacher)
    }
  }

  return (
    <Card
      className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isDeleteMode
          ? isSelected
            ? 'ring-2 ring-red-500 ring-offset-2 bg-red-50 dark:bg-red-950/20'
            : 'hover:ring-2 hover:ring-red-300 hover:ring-offset-2'
          : 'hover:ring-2 hover:ring-primary/20 hover:ring-offset-2'
      }`}
      onClick={handleCardClick}
    >
      {/* Header with Avatar and Basic Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={teacher.profilePhoto}
              alt={teacher.name}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(teacher.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {teacher.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ID: {teacher.employeeId}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={`text-xs ${getStatusColor(teacher.status)}`}>
                {getStatusIcon(teacher.status)}
                <span className="ml-1 capitalize">
                  {teacher.status.replace('_', ' ')}
                </span>
              </Badge>
              <Badge
                className={`text-xs ${getEmploymentTypeColor(teacher.employmentType)}`}
              >
                <Briefcase className="h-3 w-3 mr-1" />
                {formatEmploymentType(teacher.employmentType)}
              </Badge>
            </div>
          </div>
        </div>

        {!isDeleteMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              openDrawer(teacher)
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Department and Experience */}
      <div className="flex items-center space-x-4 mb-3">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Building2 className="h-4 w-4 mr-1" />
          <span>{getDepartmentName(teacher.department)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <GraduationCap className="h-4 w-4 mr-1" />
          <span>{teacher.experienceYears} years exp.</span>
        </div>
      </div>

      {/* Subjects */}
      <div className="mb-3">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
          <Users className="h-4 w-4 mr-1" />
          <span>Subjects:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {getSubjectNames(teacher.subjects).map((subject, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs"
            >
              {subject}
            </Badge>
          ))}
          {teacher.subjects.length > 3 && (
            <Badge
              variant="outline"
              className="text-xs"
            >
              +{teacher.subjects.length - 3} more
            </Badge>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Mail className="h-4 w-4 mr-2" />
          <span className="truncate">{teacher.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Phone className="h-4 w-4 mr-2" />
          <span>{teacher.phone}</span>
        </div>
      </div>

      {/* Hire Date and Salary */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Hired: {formatDate(teacher.hireDate)}</span>
        </div>
        {teacher.salary && (
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {teacher.salary.amount.toLocaleString()}{' '}
            {teacher.salary.currency.toUpperCase()}
          </div>
        )}
      </div>

      {/* Additional Info */}
      {teacher.lastLogin && (
        <div className="flex items-center justify-end mt-2">
          <div className="text-xs text-gray-500">
            Last login: {formatDate(teacher.lastLogin)}
          </div>
        </div>
      )}
    </Card>
  )
}


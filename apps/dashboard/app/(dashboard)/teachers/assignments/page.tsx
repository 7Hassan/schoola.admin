'use client'

import React, { useState } from 'react'
import {
  Users,
  Search,
  Filter,
  Plus,
  Minus,
  ArrowRight,
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  UserCheck,
  AlertCircle,
  Edit,
  Eye,
  X
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Input } from '@workspace/ui/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/ui/card'
import { Badge } from '@workspace/ui/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@workspace/ui/components/ui/dialog'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@workspace/ui/components/ui/avatar'

// Mock data for teachers
const teachers = [
  {
    id: '1',
    name: 'Dr. Ahmed Hassan',
    email: 'ahmed.hassan@school.com',
    department: 'Mathematics',
    subjects: ['Calculus', 'Algebra', 'Statistics'],
    status: 'active',
    profilePhoto: null
  },
  {
    id: '2',
    name: 'Prof. Sarah Johnson',
    email: 'sarah.johnson@school.com',
    department: 'Computer Science',
    subjects: ['Python Programming', 'Data Science'],
    status: 'active',
    profilePhoto: null
  },
  {
    id: '3',
    name: 'Dr. Mohammed Al-Rashid',
    email: 'mohammed.rashid@school.com',
    department: 'Physics',
    subjects: ['Quantum Physics', 'Mechanics'],
    status: 'active',
    profilePhoto: null
  },
  {
    id: '4',
    name: 'Ms. Emily Davis',
    email: 'emily.davis@school.com',
    department: 'English',
    subjects: ['Literature', 'Writing'],
    status: 'active',
    profilePhoto: null
  }
]

// Mock data for groups
const groups = [
  {
    id: '1',
    name: 'Sun [ 9:00 AM - 11:00 AM ] ~ Tue [ 2:00 PM - 4:00 PM ]',
    course: 'Advanced Python Programming',
    location: 'Downtown Campus',
    capacity: 25,
    enrolled: 18,
    totalLectures: 20,
    currentLecture: 8,
    status: 'active',
    assignedTeachers: ['1', '2']
  },
  {
    id: '2',
    name: 'Mon [ 10:00 AM - 12:00 PM ] ~ Wed [ 3:30 PM - 5:30 PM ]',
    course: 'Web Development Fundamentals',
    location: 'Virtual Classroom A',
    capacity: 30,
    enrolled: 22,
    totalLectures: 16,
    currentLecture: 5,
    status: 'active',
    assignedTeachers: ['3']
  },
  {
    id: '3',
    name: 'Sun [ 4:00 PM - 6:00 PM ] ~ Thu [ 9:00 AM - 11:30 AM ]',
    course: 'Data Analysis & Mathematics',
    location: 'Maadi Branch',
    capacity: 20,
    enrolled: 15,
    totalLectures: 40,
    currentLecture: 15,
    status: 'active',
    assignedTeachers: ['1', '2']
  },
  {
    id: '4',
    name: 'Tue [ 1:00 PM - 3:00 PM ]',
    course: 'Mobile App Development',
    location: 'Alexandria Hub',
    capacity: 15,
    enrolled: 15,
    totalLectures: 12,
    currentLecture: 12,
    status: 'completed',
    assignedTeachers: ['4']
  }
]

export default function TeacherGroupAssignmentsPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  // Filter teachers based on search and filters
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment =
      !departmentFilter ||
      departmentFilter === 'all' ||
      teacher.department === departmentFilter
    const matchesStatus =
      !statusFilter || statusFilter === 'all' || teacher.status === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
  })

  // Get teacher's assigned groups
  const getTeacherGroups = (teacherId: string) => {
    return groups.filter((group) => group.assignedTeachers.includes(teacherId))
  }

  // Get available groups for assignment (not assigned to selected teacher)
  const getAvailableGroups = (teacherId: string) => {
    return groups.filter(
      (group) =>
        !group.assignedTeachers.includes(teacherId) && group.status === 'active'
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDepartments = () => {
    return [...new Set(teachers.map((t) => t.department))]
  }

  return (
    <div className="space-y-6 p-6 overflow-y-auto w-full h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Teacher-Group Assignments
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage teacher assignments to groups and track their lecture
            schedules
          </p>
        </div>
        <Button onClick={() => setIsAssignModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Bulk Assignment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Teachers</p>
              <p className="text-2xl font-bold text-foreground">
                {teachers.filter((t) => t.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Groups</p>
              <p className="text-2xl font-bold text-foreground">
                {groups.filter((g) => g.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Assignments</p>
              <p className="text-2xl font-bold text-foreground">
                {groups.reduce(
                  (acc, group) => acc + group.assignedTeachers.length,
                  0
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unassigned Groups</p>
              <p className="text-2xl font-bold text-foreground">
                {
                  groups.filter(
                    (g) =>
                      g.assignedTeachers.length === 0 && g.status === 'active'
                  ).length
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search teachers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <Select
            value={departmentFilter}
            onValueChange={setDepartmentFilter}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {getDepartments().map((dept) => (
                <SelectItem
                  key={dept}
                  value={dept}
                >
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm ||
            (departmentFilter && departmentFilter !== 'all') ||
            (statusFilter && statusFilter !== 'all')) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setDepartmentFilter('all')
                setStatusFilter('all')
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teachers Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Teachers ({filteredTeachers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTeacher === teacher.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedTeacher(teacher.id)}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={teacher.profilePhoto || ''}
                      alt={teacher.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(teacher.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {teacher.name}
                      </h3>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {getTeacherGroups(teacher.id).length} groups
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 truncate">
                      {teacher.email}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {teacher.department}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.slice(0, 2).map((subject) => (
                          <Badge
                            key={subject}
                            variant="outline"
                            className="text-xs"
                          >
                            {subject}
                          </Badge>
                        ))}
                        {teacher.subjects.length > 2 && (
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            +{teacher.subjects.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Teacher's Groups Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                {selectedTeacher
                  ? `${teachers.find((t) => t.id === selectedTeacher)?.name}'s Groups`
                  : 'Select a Teacher'}
              </div>
              {selectedTeacher && (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedGroup(selectedTeacher)
                    setIsAssignModalOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Assign
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTeacher ? (
              <div className="space-y-4">
                {getTeacherGroups(selectedTeacher).length > 0 ? (
                  getTeacherGroups(selectedTeacher).map((group) => (
                    <div
                      key={group.id}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {group.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {group.course}
                          </p>
                        </div>
                        <Badge className={getStatusColor(group.status)}>
                          {group.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {group.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {group.enrolled}/{group.capacity} students
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Lecture {group.currentLecture}/{group.totalLectures}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {group.assignedTeachers.length} teacher
                          {group.assignedTeachers.length !== 1 ? 's' : ''}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {group.assignedTeachers.map((teacherId) => {
                            const teacher = teachers.find(
                              (t) => t.id === teacherId
                            )
                            return teacher ? (
                              <Avatar
                                key={teacherId}
                                className="h-6 w-6"
                              >
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {getInitials(teacher.name)}
                                </AvatarFallback>
                              </Avatar>
                            ) : null
                          })}
                        </div>

                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Groups Assigned
                    </h3>
                    <p className="text-gray-500 mb-4">
                      This teacher is not currently assigned to any groups.
                    </p>
                    <Button onClick={() => setIsAssignModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Assign to Group
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Teacher
                </h3>
                <p className="text-gray-500">
                  Choose a teacher from the left panel to view their group
                  assignments.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assignment Modal - Placeholder for now */}
      <Dialog
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Teacher to Groups</DialogTitle>
            <DialogDescription>
              Select groups to assign to the selected teacher
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-center text-gray-500">
              Assignment interface will be implemented in the next phase
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button>Save Assignments</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


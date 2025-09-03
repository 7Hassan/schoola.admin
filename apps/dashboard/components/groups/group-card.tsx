'use client'

import React from 'react'
import {
  Users,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  DollarSign,
  Play,
  CheckCircle,
  XCircle,
  Edit
} from 'lucide-react'
import { Card } from '@workspace/ui/components/ui/card'
import { Button } from '@workspace/ui/components/ui/button'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Group, useGroupsStore } from '@/stores/groups-store'
import { formatDateRange, SessionTimeHelper } from '@/utils/date-utils'
import { ColorLabel, getTeacherColor } from '@/components/ui/color-label'

// Lecture states
type LectureState =
  | 'completed'
  | 'current'
  | 'upcoming'
  | 'dismissed'
  | 'next'
  | 'scheduled'

interface GroupCardProps {
  group: Group
}

export function GroupCard({ group }: GroupCardProps) {
  const {
    teachers,
    courses,
    locations,
    openEditDrawer,
    isDeleteMode,
    selectedGroupsForDeletion,
    toggleGroupForDeletion
  } = useGroupsStore()

  // Generate the display name based on sessions using the same logic as the store
  const getDisplayName = (group: Group) => {
    if (!group.sessions || group.sessions.length === 0) {
      return 'New Group'
    }

    // Helper function to abbreviate day names
    const abbreviateDay = (day: string): string => {
      const dayAbbr: Record<string, string> = {
        Sunday: 'Sun',
        Monday: 'Mon',
        Tuesday: 'Tue',
        Wednesday: 'Wed',
        Thursday: 'Thu'
      }
      return dayAbbr[day] || day.slice(0, 3)
    }

    // Helper function to format time to 12-hour format
    const formatTime = (date: Date): string => {
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours % 12 || 12
      const displayMinutes = minutes.toString().padStart(2, '0')
      return `${displayHours}:${displayMinutes} ${ampm}`
    }

    // Sort sessions by day of week for consistent ordering
    const dayOrder: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4
    }

    const sortedSessions = [...group.sessions].sort((a, b) => {
      const orderA = dayOrder[a.day] ?? 999
      const orderB = dayOrder[b.day] ?? 999
      return orderA - orderB
    })

    if (sortedSessions.length === 1) {
      // Single session: "Sun [ 2:30 AM - 3:30 AM ]"
      const session = sortedSessions[0]
      if (!session) return 'New Group'

      const dayAbbr = abbreviateDay(session.day)
      const startTime = formatTime(session.startTime)
      const endTime = formatTime(session.endTime)
      return `${dayAbbr} [ ${startTime} - ${endTime} ]`
    } else if (sortedSessions.length === 2) {
      // Two sessions: "Sun [ 2:30 AM - 3:30 AM ] ~ Thu [ 5:40 PM - 6:40 PM ]"
      const session1 = sortedSessions[0]
      const session2 = sortedSessions[1]

      if (!session1 || !session2) return 'New Group'

      const day1Abbr = abbreviateDay(session1.day)
      const start1Time = formatTime(session1.startTime)
      const end1Time = formatTime(session1.endTime)

      const day2Abbr = abbreviateDay(session2.day)
      const start2Time = formatTime(session2.startTime)
      const end2Time = formatTime(session2.endTime)

      return `${day1Abbr} [ ${start1Time} - ${end1Time} ] ~ ${day2Abbr} [ ${start2Time} - ${end2Time} ]`
    } else {
      // Multiple sessions (>2): "Multiple (3 Sessions)"
      return `Multiple (${sortedSessions.length} Sessions)`
    }
  }

  const getTeacherNames = (teacherIds: string[]) => {
    return teacherIds
      .map((id) => teachers.find((t) => t.id === id)?.name)
      .filter(Boolean)
      .join(', ')
  }

  const getCourseNames = (courseIds: string[]) => {
    // Since we now have only one course, just get the first one
    if (courseIds.length === 0) return ''
    const course = courses.find((c) => c.id === courseIds[0])
    return course?.name || ''
  }

  const getLocationName = (locationId: string) => {
    return (
      locations.find((l) => l.id === locationId)?.name || 'Unknown Location'
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4 text-green-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'canceled':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
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

  const renderLectureIcons = () => {
    const icons = []

    for (let i = 1; i <= group.totalLectures; i++) {
      // Find the assignment for this lecture
      const assignment = group.teacherAssignments.find(
        (a) => a.lectureNumber === i
      )

      let lectureState: LectureState
      let circleClass = ''
      let borderClass = ''

      // Use assignment status if available, otherwise derive from lecture numbers
      if (assignment) {
        lectureState = assignment.status as LectureState
      } else {
        // Fallback logic if no assignment exists
        if (i < group.currentLectureNumber) {
          lectureState = 'completed'
        } else if (i === group.currentLectureNumber) {
          lectureState = 'current'
        } else if (i === group.upcomingLectureNumber) {
          lectureState = 'next'
        } else {
          lectureState = 'upcoming'
        }
      }

      // Set circle styles based on state
      switch (lectureState) {
        case 'completed':
          circleClass = 'bg-green-500 border-green-500'
          break
        case 'current':
          circleClass = 'bg-orange-500 border-orange-500'
          break
        case 'next':
          circleClass = 'bg-gray-300 border-blue-500 border-2'
          break
        case 'upcoming':
          circleClass = 'bg-gray-300 border-gray-300'
          break
        case 'dismissed':
          circleClass = 'bg-red-500 border-red-500'
          break
        default:
          circleClass = 'bg-gray-300 border-gray-300'
      }

      // Add teacher assignment indicator
      if (assignment?.teacherId) {
        const teacher = teachers.find((t) => t.id === assignment.teacherId)
        const teacherColor = getTeacherColor(assignment.teacherId)

        // Use ring color based on teacher
        const ringColors = {
          blue: 'ring-blue-400',
          green: 'ring-green-400',
          purple: 'ring-purple-400',
          orange: 'ring-orange-400',
          pink: 'ring-pink-400',
          indigo: 'ring-indigo-400',
          teal: 'ring-teal-400',
          red: 'ring-red-400'
        }

        borderClass = `ring-2 ${ringColors[teacherColor]} ring-offset-1`

        // Also add bottom border for teacher indication
        borderClass += ` border-b-2 border-${teacherColor}-500`
      }

      const getLectureStateTitle = (
        state: LectureState,
        lectureNum: number
      ) => {
        const baseTitle = `Lecture ${lectureNum}`
        let statusText = ''

        switch (state) {
          case 'completed':
            statusText = 'Completed'
            break
          case 'current':
            statusText = 'Current/Ongoing'
            break
          case 'next':
            statusText = 'Next (Upcoming)'
            break
          case 'upcoming':
            statusText = 'Scheduled'
            break
          case 'dismissed':
            statusText = 'Dismissed/Cancelled'
            break
          case 'scheduled':
            statusText = 'Scheduled'
            break
          default:
            statusText = 'Unknown'
        }

        let teacherInfo = ''
        if (assignment?.teacherId) {
          const teacher = teachers.find((t) => t.id === assignment.teacherId)
          teacherInfo = ` - Assigned to: ${teacher?.name || 'Unknown Teacher'}`
        }

        return `${baseTitle} - ${statusText}${teacherInfo}`
      }

      icons.push(
        <div
          key={i}
          className={`relative h-3 w-3 m-[2px] rounded-full border transition-all duration-200 cursor-help ${circleClass} ${borderClass}`}
          title={getLectureStateTitle(lectureState, i)}
        />
      )
    }

    return icons
  }

  const isSelected = selectedGroupsForDeletion.includes(group.id)

  const handleCardClick = () => {
    if (isDeleteMode) {
      toggleGroupForDeletion(group.id)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    openEditDrawer(group)
  }

  return (
    <Card
      className={`p-6 transition-all duration-200 cursor-pointer group ${
        isDeleteMode
          ? isSelected
            ? 'border-2 border-red-500 bg-red-50 dark:bg-red-950/20 shadow-lg'
            : 'border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
          : 'hover:shadow-lg'
      }`}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {getStatusIcon(group.status)}
            <h3
              className={`font-semibold transition-colors ${
                isDeleteMode
                  ? isSelected
                    ? 'text-red-900 dark:text-red-100'
                    : 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-600'
              }`}
            >
              {getDisplayName(group)}
            </h3>
          </div>
          <p className="text-sm text-gray-500">ID: {group.id}</p>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <Badge className={getStatusColor(group.status)}>{group.status}</Badge>
        </div>
      </div>
      <div className="space-y-3">
        {/* Teachers & Courses with Assignment Indicators */}
        <div className="space-y-3">
          {/* Teachers with Color Labels */}
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4 mt-0.5" />
            <div className="flex-1">
              <div className="flex flex-wrap gap-1">
                {group.teachers.length > 0 ? (
                  group.teachers.map((teacherId) => {
                    const teacher = teachers.find((t) => t.id === teacherId)
                    const teacherColor = getTeacherColor(teacherId)
                    const assignmentCount = group.teacherAssignments.filter(
                      (a) => a.teacherId === teacherId
                    ).length

                    return (
                      <ColorLabel
                        key={teacherId}
                        color={teacherColor}
                        size="sm"
                        className="text-xs"
                      >
                        {teacher?.name || 'Unknown Teacher'}
                        {assignmentCount > 0 && (
                          <span className="ml-1 bg-white/20 px-1 rounded text-xs">
                            {assignmentCount}
                          </span>
                        )}
                      </ColorLabel>
                    )
                  })
                ) : (
                  <span className="text-gray-400 italic">
                    No teachers assigned
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <BookOpen className="h-4 w-4" />
            <div className="flex-1">
              {group.courses.length > 0 ? (
                (() => {
                  const course = courses.find((c) => c.id === group.courses[0])
                  return course ? (
                    <div>
                      <span className="font-medium">{course.name}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({course.level})
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">
                      Course not found
                    </span>
                  )
                })()
              ) : (
                <span className="text-gray-400 italic">No course assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">
            {getLocationName(group.location)}
          </span>
        </div>

        {/* Date Range */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span className="text-xs">
            {formatDateRange(group.startDate, group.endDate)}
          </span>
        </div>

        {/* Sessions Preview */}
        {group.sessions && group.sessions.length > 0 && (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Sessions:</span>
            </div>
            <div className="space-y-1">
              {group.sessions.slice(0, 1).map((session) => (
                <p
                  key={session.id}
                  className="text-xs line-clamp-1"
                >
                  {SessionTimeHelper.formatSessionTime(session)}
                </p>
              ))}
              {group.sessions.length > 1 && (
                <p className="text-xs text-gray-500">
                  +{group.sessions.length - 1} more sessions
                </p>
              )}
            </div>
          </div>
        )}

        {/* Enrollment Status with Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span>Enrollment:</span>
            </div>
            <span className="font-semibold">
              {group.currentEnrollment}/{group.capacityLimit}
            </span>
          </div>

          {/* Enrollment Progress Bar */}
          <div className="w-full">
            {(() => {
              const enrollmentPercentage =
                (group.currentEnrollment / group.capacityLimit) * 100
              const isLow = enrollmentPercentage < 70
              const isGood =
                enrollmentPercentage >= 70 && enrollmentPercentage <= 100
              const isOverEnrolled = enrollmentPercentage > 100
              const overEnrolledCount = Math.max(
                0,
                group.currentEnrollment - group.capacityLimit
              )

              let bgColor = 'bg-orange-500' // Low enrollment
              if (isGood) bgColor = 'bg-green-500' // Good enrollment
              if (isOverEnrolled) bgColor = 'bg-red-500' // Over enrolled

              return (
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${bgColor}`}
                      style={{
                        width: `${Math.min(enrollmentPercentage, 100)}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{enrollmentPercentage.toFixed(0)}% filled</span>
                    {isOverEnrolled && (
                      <span className="text-red-600 font-medium">
                        +{overEnrolledCount} over capacity
                      </span>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

        {/* Lectures Progress with Visual Indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Lectures Progress:</span>
            </div>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {group.currentLectureNumber}/{group.totalLectures}
            </span>
          </div>

          {/* Lecture Circles */}
          <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded">
            {renderLectureIcons()}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-gray-300 border border-blue-500"></div>
              <span>Next</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-gray-300"></div>
              <span>Upcoming</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span>Dismissed</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-gray-300 ring-1 ring-blue-400"></div>
              <span>Assigned</span>
            </div>
          </div>
        </div>

        {/* Subscription & Price */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4" />
          {group.subscriptions.length === 0 ? (
            <span>No pricing set</span>
          ) : group.subscriptions.length === 1 ? (
            <span>
              {group.subscriptions[0]?.cost.amount}{' '}
              {group.subscriptions[0]?.cost.currency.toUpperCase()}
            </span>
          ) : (
            <span>
              {group.subscriptions.map((sub, index) => (
                <span key={sub.id}>
                  {sub.cost.amount} {sub.cost.currency.toUpperCase()}
                  {index < group.subscriptions.length - 1 ? ' • ' : ''}
                </span>
              ))}
            </span>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>
                Created: {new Date(group.createdAt).toLocaleDateString()}
              </span>
            </div>
            <span>
              Updated: {new Date(group.lastUpdatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        {!isDeleteMode && (
          <Button
            onClick={(e) => {
              e.stopPropagation()
              openEditDrawer(group)
            }}
            variant="outline"
            size="sm"
            className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
        )}
        {isDeleteMode && (
          <div className="text-center">
            <p
              className={`text-sm font-medium ${
                isSelected
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {isSelected ? 'Selected for deletion' : 'Click to select'}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}


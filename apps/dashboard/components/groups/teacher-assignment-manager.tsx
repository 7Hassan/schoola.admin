'use client'

import React, { useState, useEffect } from 'react'
import {
  Users,
  ChevronDown,
  ChevronUp,
  Save,
  RotateCcw,
  AlertCircle
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Card } from '@workspace/ui/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@workspace/ui/components/ui/collapsible'
import { Textarea } from '@workspace/ui/components/ui/textarea'
import { Label } from '@workspace/ui/components/ui/label'
import { ColorLabel, getTeacherColor } from '@/components/ui/color-label'
import {
  Group,
  TeacherLectureAssignment,
  useGroupsStore
} from '@/stores/groups-store'

interface TeacherAssignmentManagerProps {
  group: Group
  onAssignmentsChange?: (assignments: TeacherLectureAssignment[]) => void
}

export function TeacherAssignmentManager({
  group,
  onAssignmentsChange
}: TeacherAssignmentManagerProps) {
  const {
    teachers,
    updateTeacherAssignment,
    bulkUpdateTeacherAssignments,
    getTeacherAssignments
  } = useGroupsStore()

  const [isExpanded, setIsExpanded] = useState(false)
  const [localAssignments, setLocalAssignments] = useState<
    TeacherLectureAssignment[]
  >([])
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize local assignments from group data
  useEffect(() => {
    const assignments = getTeacherAssignments(group.id)
    setLocalAssignments(assignments)
  }, [group.id, getTeacherAssignments])

  // Generate assignments for all lectures if not exists
  useEffect(() => {
    const allLectureNumbers = Array.from(
      { length: group.totalLectures },
      (_, i) => i + 1
    )
    const existingLectures = new Set(
      localAssignments.map((a) => a.lectureNumber)
    )

    const missingAssignments = allLectureNumbers
      .filter((num) => !existingLectures.has(num))
      .map((num) => ({
        lectureNumber: num,
        teacherId: group.teachers[0] || '', // Default to first teacher
        status:
          num < group.currentLectureNumber
            ? ('completed' as const)
            : num === group.currentLectureNumber
              ? ('current' as const)
              : num === group.upcomingLectureNumber
                ? ('next' as const)
                : ('upcoming' as const)
      }))

    if (missingAssignments.length > 0) {
      const updatedAssignments = [
        ...localAssignments,
        ...missingAssignments
      ].sort((a, b) => a.lectureNumber - b.lectureNumber)
      setLocalAssignments(updatedAssignments)
    }
  }, [
    group.totalLectures,
    group.teachers,
    group.currentLectureNumber,
    group.upcomingLectureNumber,
    localAssignments
  ])

  const handleAssignmentChange = (
    lectureNumber: number,
    field: keyof TeacherLectureAssignment,
    value: string
  ) => {
    const updatedAssignments = localAssignments.map((assignment) => {
      if (assignment.lectureNumber === lectureNumber) {
        return {
          ...assignment,
          [field]: value
        }
      }
      return assignment
    })

    setLocalAssignments(updatedAssignments)
    setHasChanges(true)
    onAssignmentsChange?.(updatedAssignments)
  }

  const saveAssignments = () => {
    bulkUpdateTeacherAssignments(group.id, localAssignments)
    setHasChanges(false)
  }

  const resetAssignments = () => {
    const originalAssignments = getTeacherAssignments(group.id)
    setLocalAssignments(originalAssignments)
    setHasChanges(false)
  }

  const autoAssignTeachers = () => {
    if (group.teachers.length === 0) return

    const updatedAssignments = localAssignments.map((assignment) => {
      // Alternate teachers based on lecture number
      const teacherIndex =
        (assignment.lectureNumber - 1) % group.teachers.length
      return {
        ...assignment,
        teacherId: group.teachers[teacherIndex] || group.teachers[0] || ''
      }
    })

    setLocalAssignments(updatedAssignments)
    setHasChanges(true)
    onAssignmentsChange?.(updatedAssignments)
  }

  const getStatusBadgeColor = (status: TeacherLectureAssignment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'current':
        return 'bg-orange-100 text-orange-800'
      case 'next':
        return 'bg-blue-100 text-blue-800'
      case 'upcoming':
        return 'bg-gray-100 text-gray-800'
      case 'scheduled':
        return 'bg-purple-100 text-purple-800'
      case 'dismissed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTeacherStats = () => {
    const stats = group.teachers.map((teacherId) => {
      const teacher = teachers.find((t) => t.id === teacherId)
      const assignmentCount = localAssignments.filter(
        (a) => a.teacherId === teacherId
      ).length
      const completedCount = localAssignments.filter(
        (a) => a.teacherId === teacherId && a.status === 'completed'
      ).length

      return {
        teacherId,
        name: teacher?.name || 'Unknown Teacher',
        color: getTeacherColor(teacherId),
        totalAssigned: assignmentCount,
        completed: completedCount,
        upcoming: assignmentCount - completedCount
      }
    })

    return stats
  }

  const teacherStats = getTeacherStats()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Teacher Assignments</h3>
          {hasChanges && <AlertCircle className="h-4 w-4 text-orange-500" />}
        </div>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetAssignments}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={saveAssignments}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Teacher Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {teacherStats.map((stat) => (
          <Card
            key={stat.teacherId}
            className="p-3"
          >
            <div className="flex items-center justify-between">
              <ColorLabel
                color={stat.color}
                size="sm"
              >
                {stat.name}
              </ColorLabel>
              <div className="text-right text-xs text-gray-600">
                <div>{stat.totalAssigned} total</div>
                <div className="flex space-x-2">
                  <span className="text-green-600">{stat.completed} done</span>
                  <span className="text-gray-500">{stat.upcoming} pending</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={autoAssignTeachers}
          disabled={group.teachers.length === 0}
        >
          Auto-Assign Teachers
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show Details
            </>
          )}
        </Button>
      </div>

      {/* Detailed Assignment Manager */}
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
      >
        <CollapsibleContent className="space-y-4">
          <div className="max-h-96 overflow-y-auto space-y-2">
            {localAssignments.map((assignment) => {
              const teacher = teachers.find(
                (t) => t.id === assignment.teacherId
              )

              return (
                <Card
                  key={assignment.lectureNumber}
                  className="p-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                    {/* Lecture Number */}
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        Lecture {assignment.lectureNumber}
                      </span>
                      <Badge className={getStatusBadgeColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>

                    {/* Teacher Selection */}
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Teacher</Label>
                      <Select
                        value={assignment.teacherId}
                        onValueChange={(value) =>
                          handleAssignmentChange(
                            assignment.lectureNumber,
                            'teacherId',
                            value
                          )
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue>
                            {teacher ? (
                              <ColorLabel
                                color={getTeacherColor(assignment.teacherId)}
                                size="sm"
                              >
                                {teacher.name}
                              </ColorLabel>
                            ) : (
                              'Select Teacher'
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {group.teachers.map((teacherId) => {
                            const t = teachers.find(
                              (teacher) => teacher.id === teacherId
                            )
                            return (
                              <SelectItem
                                key={teacherId}
                                value={teacherId}
                              >
                                <ColorLabel
                                  color={getTeacherColor(teacherId)}
                                  size="sm"
                                >
                                  {t?.name || 'Unknown Teacher'}
                                </ColorLabel>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status Selection */}
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Status</Label>
                      <Select
                        value={assignment.status}
                        onValueChange={(value) =>
                          handleAssignmentChange(
                            assignment.lectureNumber,
                            'status',
                            value as TeacherLectureAssignment['status']
                          )
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="next">Next</SelectItem>
                          <SelectItem value="current">Current</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="dismissed">Dismissed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Notes</Label>
                      <Textarea
                        value={assignment.notes || ''}
                        onChange={(e) =>
                          handleAssignmentChange(
                            assignment.lectureNumber,
                            'notes',
                            e.target.value
                          )
                        }
                        placeholder="Optional notes..."
                        className="h-8 text-xs resize-none"
                      />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}


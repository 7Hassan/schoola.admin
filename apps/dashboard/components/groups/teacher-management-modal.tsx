'use client'

import React, { useState, useEffect } from 'react'
import {
  Users,
  Plus,
  Trash2,
  Palette,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Card } from '@workspace/ui/components/ui/card'
import { Label } from '@workspace/ui/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@workspace/ui/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import { Checkbox } from '@workspace/ui/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@workspace/ui/components/ui/collapsible'
import { Textarea } from '@workspace/ui/components/ui/textarea'
import { Separator } from '@workspace/ui/components/ui/separator'
import {
  ColorLabel,
  getTeacherColor,
  ColorScheme,
  COLOR_SCHEMES
} from '@/components/ui/color-label'
import {
  Group,
  TeacherLectureAssignment,
  useGroupsStore
} from '@/stores/groups-store'

interface TeacherManagementModalProps {
  selectedTeachers: string[]
  totalLectures: number
  currentLectureNumber: number
  upcomingLectureNumber: number
  onTeachersChange: (teachers: string[]) => void
  group?: Group // For existing groups with assignments
  children: React.ReactNode
}

interface TeacherColorMapping {
  [teacherId: string]: ColorScheme
}

export function TeacherManagementModal({
  selectedTeachers,
  totalLectures,
  currentLectureNumber,
  upcomingLectureNumber,
  onTeachersChange,
  group,
  children
}: TeacherManagementModalProps) {
  const {
    teachers,
    updateTeacherAssignment,
    bulkUpdateTeacherAssignments,
    getTeacherAssignments
  } = useGroupsStore()

  const [isOpen, setIsOpen] = useState(false)
  const [localSelectedTeachers, setLocalSelectedTeachers] =
    useState<string[]>(selectedTeachers)
  const [localAssignments, setLocalAssignments] = useState<
    TeacherLectureAssignment[]
  >([])
  const [teacherColors, setTeacherColors] = useState<TeacherColorMapping>({})
  const [isAssignmentExpanded, setIsAssignmentExpanded] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize data when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelectedTeachers(selectedTeachers)

      // Initialize teacher colors
      const colors: TeacherColorMapping = {}
      selectedTeachers.forEach((teacherId) => {
        colors[teacherId] = getTeacherColor(teacherId)
      })
      setTeacherColors(colors)

      // Initialize assignments if editing existing group
      if (group) {
        const assignments = getTeacherAssignments(group.id)
        setLocalAssignments(assignments)
      } else {
        // Generate default assignments for new group
        generateDefaultAssignments(selectedTeachers)
      }
    }
  }, [isOpen, selectedTeachers, group, getTeacherAssignments])

  const generateDefaultAssignments = (teacherIds: string[]) => {
    if (teacherIds.length === 0) return

    const assignments: TeacherLectureAssignment[] = []
    for (let i = 1; i <= totalLectures; i++) {
      const teacherIndex = (i - 1) % teacherIds.length
      const teacherId = teacherIds[teacherIndex] || teacherIds[0] || ''

      let status: TeacherLectureAssignment['status'] = 'upcoming'
      if (i < currentLectureNumber) {
        status = 'completed'
      } else if (i === currentLectureNumber) {
        status = 'current'
      } else if (i === upcomingLectureNumber) {
        status = 'next'
      }

      assignments.push({
        lectureNumber: i,
        teacherId,
        status
      })
    }
    setLocalAssignments(assignments)
  }

  const handleTeacherToggle = (teacherId: string, checked: boolean) => {
    let updatedTeachers: string[]

    if (checked) {
      updatedTeachers = [...localSelectedTeachers, teacherId]
      // Assign default color
      setTeacherColors((prev) => ({
        ...prev,
        [teacherId]: getTeacherColor(teacherId)
      }))
    } else {
      updatedTeachers = localSelectedTeachers.filter((id) => id !== teacherId)
      // Remove color mapping
      setTeacherColors((prev) => {
        const newColors = { ...prev }
        delete newColors[teacherId]
        return newColors
      })
    }

    setLocalSelectedTeachers(updatedTeachers)
    generateDefaultAssignments(updatedTeachers)
    setHasChanges(true)
  }

  const handleColorChange = (teacherId: string, color: ColorScheme) => {
    setTeacherColors((prev) => ({
      ...prev,
      [teacherId]: color
    }))
    setHasChanges(true)
  }

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
  }

  const autoAssignTeachers = () => {
    generateDefaultAssignments(localSelectedTeachers)
    setHasChanges(true)
  }

  const handleSave = () => {
    // Save teacher selection
    onTeachersChange(localSelectedTeachers)

    // Save assignments if editing existing group
    if (group) {
      bulkUpdateTeacherAssignments(group.id, localAssignments)
    }

    // TODO: Save teacher color preferences to a global store or localStorage

    setHasChanges(false)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setLocalSelectedTeachers(selectedTeachers)
    setHasChanges(false)
    setIsOpen(false)
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
    return localSelectedTeachers.map((teacherId) => {
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
        color: teacherColors[teacherId] || getTeacherColor(teacherId),
        totalAssigned: assignmentCount,
        completed: completedCount,
        upcoming: assignmentCount - completedCount
      }
    })
  }

  const teacherStats = getTeacherStats()

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Teacher Management</span>
            {hasChanges && <AlertCircle className="h-4 w-4 text-orange-500" />}
          </DialogTitle>
          <DialogDescription>
            Select teachers, assign them to lectures, and customize their
            colors.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Teacher Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Teachers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-48 overflow-y-auto">
              {teachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`teacher-${teacher.id}`}
                        checked={localSelectedTeachers.includes(teacher.id)}
                        onCheckedChange={(checked) =>
                          handleTeacherToggle(teacher.id, checked as boolean)
                        }
                      />
                      <div>
                        <Label
                          htmlFor={`teacher-${teacher.id}`}
                          className="text-sm font-medium"
                        >
                          {teacher.name}
                        </Label>
                        <p className="text-xs text-gray-600">
                          {teacher.specialization}
                        </p>
                      </div>
                    </div>

                    {localSelectedTeachers.includes(teacher.id) && (
                      <div className="flex items-center space-x-2">
                        <ColorLabel
                          color={
                            teacherColors[teacher.id] ||
                            getTeacherColor(teacher.id)
                          }
                          size="sm"
                        >
                          Color
                        </ColorLabel>
                        <Select
                          value={
                            teacherColors[teacher.id] ||
                            getTeacherColor(teacher.id)
                          }
                          onValueChange={(color: ColorScheme) =>
                            handleColorChange(teacher.id, color)
                          }
                        >
                          <SelectTrigger className="w-12 h-8 p-1">
                            <Palette className="h-4 w-4" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(COLOR_SCHEMES).map((colorKey) => (
                              <SelectItem
                                key={colorKey}
                                value={colorKey}
                              >
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`w-4 h-4 rounded-full ${COLOR_SCHEMES[colorKey as ColorScheme].solid}`}
                                  />
                                  <span className="capitalize">{colorKey}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Selected Teachers Summary */}
          {localSelectedTeachers.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Selected Teachers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                        <div>{stat.totalAssigned} lectures</div>
                        <div className="flex space-x-2">
                          <span className="text-green-600">
                            {stat.completed} done
                          </span>
                          <span className="text-gray-500">
                            {stat.upcoming} pending
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Lecture Assignment Management */}
          {localSelectedTeachers.length > 0 && totalLectures > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Lecture Assignments</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={autoAssignTeachers}
                  >
                    Auto-Assign
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setIsAssignmentExpanded(!isAssignmentExpanded)
                    }
                  >
                    {isAssignmentExpanded ? (
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
              </div>

              <Collapsible
                open={isAssignmentExpanded}
                onOpenChange={setIsAssignmentExpanded}
              >
                <CollapsibleContent className="space-y-4">
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {localAssignments.map((assignment) => {
                      const teacher = teachers.find(
                        (t) => t.id === assignment.teacherId
                      )
                      const teacherColor =
                        teacherColors[assignment.teacherId] ||
                        getTeacherColor(assignment.teacherId)

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
                              <Badge
                                className={getStatusBadgeColor(
                                  assignment.status
                                )}
                              >
                                {assignment.status}
                              </Badge>
                            </div>

                            {/* Teacher Selection */}
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-600">
                                Teacher
                              </Label>
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
                                        color={teacherColor}
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
                                  {localSelectedTeachers.map((teacherId) => {
                                    const t = teachers.find(
                                      (teacher) => teacher.id === teacherId
                                    )
                                    const color =
                                      teacherColors[teacherId] ||
                                      getTeacherColor(teacherId)
                                    return (
                                      <SelectItem
                                        key={teacherId}
                                        value={teacherId}
                                      >
                                        <ColorLabel
                                          color={color}
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
                              <Label className="text-xs text-gray-600">
                                Status
                              </Label>
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
                                  <SelectItem value="scheduled">
                                    Scheduled
                                  </SelectItem>
                                  <SelectItem value="upcoming">
                                    Upcoming
                                  </SelectItem>
                                  <SelectItem value="next">Next</SelectItem>
                                  <SelectItem value="current">
                                    Current
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                  <SelectItem value="dismissed">
                                    Dismissed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Notes */}
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-600">
                                Notes
                              </Label>
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
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={localSelectedTeachers.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


'use client'

import React, { useState, useEffect } from 'react'
import { Clock, Plus, Edit3, Trash2, X } from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Input } from '@workspace/ui/components/ui/input'
import { Label } from '@workspace/ui/components/ui/label'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import { Badge } from '@workspace/ui/components/ui/badge'
import { Alert, AlertDescription } from '@workspace/ui/components/ui/alert'
import {
  SessionTime,
  DayOfWeek,
  ALLOWED_DAYS,
  SessionValidator,
  SessionTimeHelper,
  UTCDateManager
} from '@/utils/date-utils'

interface SessionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (session: Omit<SessionTime, 'id'>) => void
  existingSessions: SessionTime[]
  editingSession?: SessionTime
  title?: string
}

export function SessionDialog({
  isOpen,
  onClose,
  onSave,
  existingSessions,
  editingSession,
  title = 'Create Session'
}: SessionDialogProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Sunday')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [errors, setErrors] = useState<string[]>([])

  const timeOptions = SessionTimeHelper.generateTimeOptions()

  // Initialize form when editing
  useEffect(() => {
    if (editingSession) {
      setSelectedDay(editingSession.day)
      const startComponents = SessionTimeHelper.getTimeComponents(
        editingSession.startTime
      )
      const endComponents = SessionTimeHelper.getTimeComponents(
        editingSession.endTime
      )
      setStartTime(
        `${startComponents.hours.toString().padStart(2, '0')}:${startComponents.minutes.toString().padStart(2, '0')}`
      )
      setEndTime(
        `${endComponents.hours.toString().padStart(2, '0')}:${endComponents.minutes.toString().padStart(2, '0')}`
      )
    } else {
      // Reset form for new session
      setSelectedDay('Sunday')
      setStartTime('09:00')
      setEndTime('10:00')
    }
    setErrors([])
  }, [editingSession, isOpen])

  const handleSave = () => {
    const startParts = startTime.split(':')
    const endParts = endTime.split(':')

    if (
      startParts.length !== 2 ||
      endParts.length !== 2 ||
      !startParts[0] ||
      !startParts[1] ||
      !endParts[0] ||
      !endParts[1]
    ) {
      setErrors(['Invalid time format'])
      return
    }

    const startHours = parseInt(startParts[0], 10)
    const startMinutes = parseInt(startParts[1], 10)
    const endHours = parseInt(endParts[0], 10)
    const endMinutes = parseInt(endParts[1], 10)

    if (
      isNaN(startHours) ||
      isNaN(startMinutes) ||
      isNaN(endHours) ||
      isNaN(endMinutes)
    ) {
      setErrors(['Invalid time values'])
      return
    }

    const startTimeDate = SessionTimeHelper.createTodayTime(
      startHours,
      startMinutes
    )
    const endTimeDate = SessionTimeHelper.createTodayTime(endHours, endMinutes)

    const sessionData = {
      day: selectedDay,
      startTime: startTimeDate,
      endTime: endTimeDate
    }

    const validation = SessionValidator.validateSession(
      sessionData,
      existingSessions,
      editingSession?.id
    )

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    onSave(sessionData)
    onClose()
    setErrors([])
  }

  const handleClose = () => {
    onClose()
    setErrors([])
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {editingSession ? 'Edit Session' : title}
          </DialogTitle>
          <DialogDescription>
            {editingSession
              ? 'Modify the session schedule details.'
              : 'Schedule a new session for this group. Sessions can only be on Sunday through Thursday.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Day Selection */}
          <div className="grid gap-2">
            <Label htmlFor="day">Day of Week</Label>
            <Select
              value={selectedDay}
              onValueChange={(value: DayOfWeek) => setSelectedDay(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {ALLOWED_DAYS.map((day) => (
                  <SelectItem
                    key={day}
                    value={day}
                  >
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Select
                value={startTime}
                onValueChange={(value) => {
                  setStartTime(value)
                  // Auto-adjust end time if it becomes invalid
                  const startParts = value.split(':')
                  const endParts = endTime.split(':')

                  if (
                    startParts.length === 2 &&
                    endParts.length === 2 &&
                    startParts[0] &&
                    startParts[1] &&
                    endParts[0] &&
                    endParts[1]
                  ) {
                    const startHours = parseInt(startParts[0], 10)
                    const startMinutes = parseInt(startParts[1], 10)
                    const endHours = parseInt(endParts[0], 10)
                    const endMinutes = parseInt(endParts[1], 10)

                    if (
                      !isNaN(startHours) &&
                      !isNaN(startMinutes) &&
                      !isNaN(endHours) &&
                      !isNaN(endMinutes)
                    ) {
                      const startTotalMinutes = startHours * 60 + startMinutes
                      const endTotalMinutes = endHours * 60 + endMinutes

                      if (endTotalMinutes <= startTotalMinutes) {
                        // Set end time to 1 hour after start time
                        const newEndMinutes = startTotalMinutes + 60
                        const newEndHours = Math.floor(newEndMinutes / 60) % 24
                        const remainingMinutes = newEndMinutes % 60
                        setEndTime(
                          `${newEndHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`
                        )
                      }
                    }
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Start time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <Select
                value={endTime}
                onValueChange={(value) => {
                  // Validate that end time is after start time
                  const startParts = startTime.split(':')
                  const endParts = value.split(':')

                  if (
                    startParts.length === 2 &&
                    endParts.length === 2 &&
                    startParts[0] &&
                    startParts[1] &&
                    endParts[0] &&
                    endParts[1]
                  ) {
                    const startHours = parseInt(startParts[0], 10)
                    const startMinutes = parseInt(startParts[1], 10)
                    const endHours = parseInt(endParts[0], 10)
                    const endMinutes = parseInt(endParts[1], 10)

                    if (
                      !isNaN(startHours) &&
                      !isNaN(startMinutes) &&
                      !isNaN(endHours) &&
                      !isNaN(endMinutes)
                    ) {
                      const startTotalMinutes = startHours * 60 + startMinutes
                      const endTotalMinutes = endHours * 60 + endMinutes

                      // Only set if end time is after start time
                      if (endTotalMinutes > startTotalMinutes) {
                        setEndTime(value)
                      }
                      // If end time is not valid, don't update it
                    } else {
                      setEndTime(value)
                    }
                  } else {
                    setEndTime(value)
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="End time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          <div className="grid gap-2">
            <Label>Preview</Label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="text-sm font-medium">
                {selectedDay} -{' '}
                {timeOptions.find((t) => t.value === startTime)?.label} →{' '}
                {timeOptions.find((t) => t.value === endTime)?.label}
              </div>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingSession ? 'Update Session' : 'Create Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface SessionListProps {
  sessions: SessionTime[]
  onEdit: (session: SessionTime) => void
  onDelete: (sessionId: string) => void
  onCreateNew: () => void
}

export function SessionList({
  sessions,
  onEdit,
  onDelete,
  onCreateNew
}: SessionListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Sessions Schedule</h3>
          <p className="text-sm text-gray-600">
            Manage lecture times for this group
          </p>
        </div>
        <Button
          onClick={onCreateNew}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No sessions scheduled
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first session to get started.
          </p>
          <Button
            onClick={onCreateNew}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Session
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">
                    {SessionTimeHelper.formatSessionTime(session)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {UTCDateManager.formatForDisplay(
                      session.startTime,
                      'h:mm aa'
                    )}{' '}
                    -{' '}
                    {UTCDateManager.formatForDisplay(
                      session.endTime,
                      'h:mm aa'
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(session)}
                  className="h-8 w-8 p-0"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(session.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface SessionManagerProps {
  groupId: string
  initialSessions?: SessionTime[]
  onSessionsChange?: (sessions: SessionTime[]) => void
}

export function SessionManager({
  groupId,
  initialSessions = [],
  onSessionsChange
}: SessionManagerProps) {
  const [sessions, setSessions] = useState<SessionTime[]>(initialSessions)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<
    SessionTime | undefined
  >()

  const generateSessionId = () =>
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const handleCreateSession = () => {
    setEditingSession(undefined)
    setIsDialogOpen(true)
  }

  const handleEditSession = (session: SessionTime) => {
    setEditingSession(session)
    setIsDialogOpen(true)
  }

  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter((s) => s.id !== sessionId)
    setSessions(updatedSessions)
    onSessionsChange?.(updatedSessions)
  }

  const handleSaveSession = (sessionData: Omit<SessionTime, 'id'>) => {
    let updatedSessions: SessionTime[]

    if (editingSession) {
      // Update existing session
      updatedSessions = sessions.map((s) =>
        s.id === editingSession.id
          ? { ...sessionData, id: editingSession.id }
          : s
      )
    } else {
      // Create new session
      const newSession: SessionTime = {
        ...sessionData,
        id: generateSessionId()
      }
      updatedSessions = [...sessions, newSession]
    }

    setSessions(updatedSessions)
    onSessionsChange?.(updatedSessions)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingSession(undefined)
  }

  return (
    <div>
      <SessionList
        sessions={sessions}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
        onCreateNew={handleCreateSession}
      />

      <SessionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveSession}
        existingSessions={sessions}
        editingSession={editingSession}
      />
    </div>
  )
}


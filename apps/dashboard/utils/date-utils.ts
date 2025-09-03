import {
  format,
  parseISO,
  startOfDay,
  endOfDay,
  addHours,
  differenceInMinutes,
  isAfter,
  isBefore,
  setHours,
  setMinutes,
  getDay,
  isValid,
  toDate
} from 'date-fns'

// UTC Date Management Layer
export class UTCDateManager {
  /**
   * Creates a UTC date from local time components
   */
  static createUTCDate(
    year: number,
    month: number,
    day: number,
    hours = 0,
    minutes = 0
  ): Date {
    return new Date(Date.UTC(year, month, day, hours, minutes))
  }

  /**
   * Converts a local date to UTC
   */
  static toUTC(localDate: Date): Date {
    return new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000)
  }

  /**
   * Converts a UTC date to local time for display
   */
  static toLocal(utcDate: Date): Date {
    return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000)
  }

  /**
   * Gets the current UTC date
   */
  static nowUTC(): Date {
    return new Date()
  }

  /**
   * Parses an ISO string and returns UTC date
   */
  static parseUTC(isoString: string): Date {
    return parseISO(isoString)
  }

  /**
   * Formats a UTC date for display in local time
   */
  static formatForDisplay(utcDate: Date, formatString = 'PPpp'): string {
    const localDate = this.toLocal(utcDate)
    return format(localDate, formatString)
  }

  /**
   * Formats a UTC date for time display (HH:mm)
   */
  static formatTime(utcDate: Date): string {
    return this.formatForDisplay(utcDate, 'HH:mm')
  }

  /**
   * Formats a UTC date for day display
   */
  static formatDay(utcDate: Date): string {
    return this.formatForDisplay(utcDate, 'EEEE')
  }
}

// Original date formatting functions (updated to use UTCDateManager)
export const formatDateWithDay = (date: Date) => {
  const dayName = UTCDateManager.formatForDisplay(date, 'EEE')
  const dateTime = UTCDateManager.formatForDisplay(date, 'MM/dd/yyyy, hh:mm aa')
  return `${dayName} ${dateTime}`
}

export const formatDateRange = (startDate: Date, endDate: Date) => {
  return `${formatDateWithDay(startDate)}, ${formatDateWithDay(endDate)}`
}

// Session-specific utilities
export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'

export const ALLOWED_DAYS: DayOfWeek[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday'
]

export const DAY_MAPPING: Record<DayOfWeek, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4
}

export interface SessionTime {
  id: string
  day: DayOfWeek
  startTime: Date // UTC time
  endTime: Date // UTC time
}

export class SessionValidator {
  /**
   * Validates if a day is allowed (Sunday-Thursday)
   */
  static isValidDay(day: DayOfWeek): boolean {
    return ALLOWED_DAYS.includes(day)
  }

  /**
   * Validates if the session duration is at least 1 hour
   */
  static isValidDuration(startTime: Date, endTime: Date): boolean {
    const durationMinutes = differenceInMinutes(endTime, startTime)
    return durationMinutes >= 60
  }

  /**
   * Validates if start time is before end time
   */
  static isValidTimeOrder(startTime: Date, endTime: Date): boolean {
    return isBefore(startTime, endTime)
  }

  /**
   * Checks if a session conflicts with existing sessions (same day)
   */
  static hasConflict(
    newSession: Omit<SessionTime, 'id'>,
    existingSessions: SessionTime[],
    excludeSessionId?: string
  ): boolean {
    return existingSessions.some((session) => {
      if (excludeSessionId && session.id === excludeSessionId) {
        return false
      }
      return session.day === newSession.day
    })
  }

  /**
   * Validates a complete session
   */
  static validateSession(
    session: Omit<SessionTime, 'id'>,
    existingSessions: SessionTime[] = [],
    excludeSessionId?: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!this.isValidDay(session.day)) {
      errors.push('Sessions can only be scheduled on Sunday through Thursday')
    }

    if (!this.isValidTimeOrder(session.startTime, session.endTime)) {
      errors.push('Start time must be before end time')
    }

    if (!this.isValidDuration(session.startTime, session.endTime)) {
      errors.push('Session must be at least 1 hour long')
    }

    if (this.hasConflict(session, existingSessions, excludeSessionId)) {
      errors.push(`A session already exists for ${session.day}`)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export class SessionTimeHelper {
  /**
   * Creates a session time from hour and minute components
   */
  static createTimeFromComponents(hours: number, minutes: number): Date {
    const date = new Date()
    date.setUTCHours(hours, minutes, 0, 0)
    return date
  }

  /**
   * Formats session time for display
   */
  static formatSessionTime(session: SessionTime): string {
    const startTime = UTCDateManager.formatTime(session.startTime)
    const endTime = UTCDateManager.formatTime(session.endTime)
    return `${session.day} - ${startTime} → ${endTime}`
  }

  /**
   * Gets hour and minute from UTC date for form inputs
   */
  static getTimeComponents(utcDate: Date): { hours: number; minutes: number } {
    return {
      hours: utcDate.getUTCHours(),
      minutes: utcDate.getUTCMinutes()
    }
  }

  /**
   * Creates a UTC date from local time components for today
   */
  static createTodayTime(hours: number, minutes: number): Date {
    const utcDate = new Date()
    utcDate.setUTCHours(hours, minutes, 0, 0)
    return utcDate
  }

  /**
   * Generates time options for dropdowns (15-minute intervals)
   */
  static generateTimeOptions(): Array<{
    value: string
    label: string
    hours: number
    minutes: number
  }> {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = new Date()
        time.setHours(hour, minute, 0, 0)
        const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const label = format(time, 'h:mm aa')
        options.push({ value, label, hours: hour, minutes: minute })
      }
    }
    return options
  }
}


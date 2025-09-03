"use client"

import React from 'react'
import { Label } from '@workspace/ui/components/ui/label'
import { Button } from '@workspace/ui/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/ui/popover'
import { Calendar } from '@workspace/ui/components/ui/calendar'
import { CalendarIcon, RotateCcw } from 'lucide-react'
import { format } from 'date-fns'

export interface DateRangeFilterProps {
  dateRange: [Date | null, Date | null]
  open: boolean
  setOpen: (v: boolean) => void
  onSelect: (range?: { from?: Date; to?: Date }) => void
}

export function DateRangeFilter({ dateRange, open, setOpen, onSelect }: DateRangeFilterProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Registration Date</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={!dateRange[0] && !dateRange[1] ? 'text-muted-foreground w-full justify-start text-left font-normal' : 'w-full justify-start text-left font-normal'}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange[0] && dateRange[1]
              ? `${format(dateRange[0], 'MMM dd')} - ${format(dateRange[1], 'MMM dd')}`
              : dateRange[0]
                ? `From ${format(dateRange[0], 'MMM dd, yyyy')}`
                : 'Pick date range'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b flex justify-between items-center">
            <span className="text-sm font-medium">Registration Date Range</span>
            {(dateRange[0] || dateRange[1]) && (
              <Button variant="ghost" size="sm" onClick={() => onSelect(undefined)} className="h-6 px-2 text-xs">
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange[0] || undefined}
            selected={{ from: dateRange[0] || undefined, to: dateRange[1] || undefined }}
            onSelect={onSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

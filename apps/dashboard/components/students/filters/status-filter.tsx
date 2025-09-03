"use client"

import React from 'react'
import { Label } from '@workspace/ui/components/ui/label'
import { Button } from '@workspace/ui/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@workspace/ui/components/ui/command'
import { Checkbox } from '@workspace/ui/components/ui/checkbox'
import { ChevronDown, X } from 'lucide-react'
import { StudentStatus } from '@/stores/students-store'

export interface StatusFilterProps {
  statusOptions: StudentStatus[]
  selectedStatus: StudentStatus[]
  open: boolean
  setOpen: (v: boolean) => void
  onToggle: (status: StudentStatus) => void
}

export function StatusFilter({ statusOptions, selectedStatus, open, setOpen, onToggle }: StatusFilterProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Status</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selectedStatus.length === 0 ? 'Select status...' : `${selectedStatus.length} selected`}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search status..." />
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {statusOptions.map((status) => (
                <CommandItem key={status} onSelect={() => onToggle(status)}>
                  <Checkbox checked={selectedStatus.includes(status)} className="mr-2" />
                  {status}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedStatus.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedStatus.map((status) => (
            <div key={status} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
              {status}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => onToggle(status)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import React from 'react'
import { Label } from '@workspace/ui/components/ui/label'
import { Button } from '@workspace/ui/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@workspace/ui/components/ui/command'
import { Checkbox } from '@workspace/ui/components/ui/checkbox'
import { ChevronDown, X } from 'lucide-react'

export interface GroupsFilterProps {
  studyGroups: { id: string; name: string; level?: string }[]
  selectedGroups: string[] // contains group ids, or '' for No Group
  open: boolean
  setOpen: (v: boolean) => void
  onToggle: (groupName: string) => void
}

export function GroupsFilter({ studyGroups, selectedGroups, open, setOpen, onToggle }: GroupsFilterProps) {
  return (
    <div className="space-y-2 md:col-span-2">
      <Label className="text-sm font-medium">Study Groups</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selectedGroups.length === 0 ? 'Select groups...' : `${selectedGroups.length} selected`}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search groups..." />
            <CommandEmpty>No groups found.</CommandEmpty>
            <CommandGroup>
              {studyGroups.map((group) => (
                <CommandItem key={group.id} onSelect={() => onToggle(group.id)}>
                  <Checkbox checked={selectedGroups.includes(group.id)} className="mr-2" />
                  <div>
                    <div className="font-medium">{group.name}</div>
                    <div className="text-xs text-gray-500">{group.level}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedGroups.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedGroups.map((groupId) => {
            const grp = studyGroups.find((g) => g.id === groupId)
            const label = grp ? grp.name : groupId === '' ? '(No Group)' : groupId
            return (
              <div key={groupId} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
                {label}
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => onToggle(groupId)} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

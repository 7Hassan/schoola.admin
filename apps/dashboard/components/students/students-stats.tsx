"use client"

import React from 'react'
import { Card } from '@workspace/ui/components/ui/card'
import { Users, UserCheck, UserX, Clock } from 'lucide-react'

export interface StudentsStatsProps {
  total: number
  active: number
  archived: number
  freeDay: number
  waiting: number
}

export function StudentsStats({ total, active, archived, freeDay, waiting }: StudentsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Students</p>
            <p className="text-2xl font-bold text-foreground">{total}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-foreground">{active}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-900/20 rounded-lg">
            <UserX className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Archived</p>
            <p className="text-2xl font-bold text-foreground">{archived}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Free-day</p>
            <p className="text-2xl font-bold text-foreground">{freeDay}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Waiting</p>
            <p className="text-2xl font-bold text-foreground">{waiting}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

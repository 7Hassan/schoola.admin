'use client'

import React from 'react'
import { useGroupsStore } from '@/stores/groups-store'
import { GroupCard } from './group-card'

export function GroupsGrid() {
  const { getPaginatedGroups } = useGroupsStore()
  const groups = getPaginatedGroups()

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="rounded-full bg-gray-100 p-6 mx-auto w-24 h-24 flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No groups found
          </h3>
          <p className="text-gray-500">
            There are no groups matching your current filters. Try adjusting
            your search criteria.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
        />
      ))}
    </div>
  )
}


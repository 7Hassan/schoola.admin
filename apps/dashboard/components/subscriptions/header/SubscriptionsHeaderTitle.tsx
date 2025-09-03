"use client"

import React from 'react'
import { SubscriptionsHeaderProps } from './types'

export default function SubscriptionsHeaderTitle({ isDeleteMode = false, selectedCount = 0 }: Pick<SubscriptionsHeaderProps, 'isDeleteMode' | 'selectedCount'>) {
  return (
    <div>
      <h1 className={`text-2xl font-bold ${isDeleteMode ? 'text-red-900' : 'text-gray-900'}`}>
        {isDeleteMode ? 'Delete Subscriptions' : 'Subscriptions Management'}
      </h1>
      <p className={`mt-1 ${isDeleteMode ? 'text-red-700' : 'text-gray-600'}`}>
        {isDeleteMode ? `${selectedCount} subscription${selectedCount !== 1 ? 's' : ''} selected` : 'Manage and track subscriptions and plans'}
      </p>
    </div>
  )
}

"use client"

import React from 'react'
import SubscriptionsHeaderTitle from './SubscriptionsHeaderTitle'
import SubscriptionsHeaderActions from './SubscriptionsHeaderActions'
import { SubscriptionsHeaderProps } from './types'

export default function SubscriptionsHeader(props: SubscriptionsHeaderProps) {
  const { isDeleteMode = false, selectedCount = 0 } = props
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg transition-colors ${isDeleteMode ? 'bg-red-50 border border-red-200' : ''}`}>
      <SubscriptionsHeaderTitle isDeleteMode={isDeleteMode} selectedCount={selectedCount} />
      <SubscriptionsHeaderActions {...props} />
    </div>
  )
}

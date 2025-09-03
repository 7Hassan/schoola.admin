"use client"

import React from 'react'
import { Subscription } from './types'

export default function SubscriptionsStats({ subscriptions, payments }: { subscriptions: Subscription[], payments: any[] }) {
  const totalRevenue = payments.reduce((s, p) => s + (p.amount || 0), 0)
  const counts = {
    active: subscriptions.filter(s => s.status === 'active').length,
    due_soon: subscriptions.filter(s => s.status === 'due_soon').length,
    expired: subscriptions.filter(s => s.status === 'expired').length,
  }
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
      <div style={{ padding: 12, border: '1px solid #ddd' }}>
        <div>Total revenue</div>
        <div style={{ fontSize: 20 }}>${totalRevenue}</div>
      </div>
      <div style={{ padding: 12, border: '1px solid #ddd' }}>
        <div>Active subs</div>
        <div style={{ fontSize: 20 }}>{counts.active}</div>
      </div>
      <div style={{ padding: 12, border: '1px solid #ddd' }}>
        <div>Due soon</div>
        <div style={{ fontSize: 20 }}>{counts.due_soon}</div>
      </div>
      <div style={{ padding: 12, border: '1px solid #ddd' }}>
        <div>Expired</div>
        <div style={{ fontSize: 20 }}>{counts.expired}</div>
      </div>
    </div>
  )
}

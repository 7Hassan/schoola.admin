"use client"

import React from 'react'

export default function SubscriptionsFilters({ query, onQuery, status, onStatus }: { query: string, onQuery: (s: string) => void, status: string, onStatus: (s: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <input placeholder="Search subscriptions" value={query} onChange={e => onQuery(e.target.value)} />
      <select value={status} onChange={e => onStatus(e.target.value)}>
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="due_soon">Due soon</option>
        <option value="expired">Expired</option>
      </select>
    </div>
  )
}

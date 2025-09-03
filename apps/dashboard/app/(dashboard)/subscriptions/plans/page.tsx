"use client"

import React, { useMemo, useState } from 'react'
import { Plan } from '../types'

const initialPlans: Plan[] = [
  { id: 'p1', name: 'Intro', durationMonths: 1, sessions: 4, price: 50 },
  { id: 'p2', name: 'Standard', durationMonths: 3, sessions: 12, price: 140 },
  { id: 'p3', name: 'Premium', durationMonths: 6, sessions: 24, price: 260 },
]

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return plans
    return plans.filter(p => p.name.toLowerCase().includes(q) || p.id.includes(q))
  }, [plans, query])

  function addPlan() {
    const id = `p${Date.now()}`
    setPlans(prev => [...prev, { id, name: `New Plan ${prev.length + 1}`, durationMonths: 1, sessions: 4, price: 0 }])
  }

  function deletePlan(id: string) {
    setPlans(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div>
      <h2>Plans</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="search plans" value={query} onChange={e => setQuery(e.target.value)} />
        <button onClick={addPlan}>Add plan</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong>{p.name}</strong>
              <small>{p.id}</small>
            </div>
            <div>Duration: {p.durationMonths} months</div>
            <div>Sessions: {p.sessions}</div>
            <div>Price: ${p.price}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button onClick={() => deletePlan(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

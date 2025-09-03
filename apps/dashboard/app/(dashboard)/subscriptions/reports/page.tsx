"use client"

import React from 'react'
import { Payment, Subscription } from '../types'

const mockPayments: Payment[] = [
  { id: 'pay1', studentId: 's1', studentName: 'Alice', subscriptionId: 'sub1', amount: 50, paymentDate: '2025-08-02', method: 'card' },
  { id: 'pay2', studentId: 's2', studentName: 'Bob', subscriptionId: 'sub2', amount: 140, paymentDate: '2025-07-15', method: 'cash' },
]

const mockSubs: Subscription[] = [
  { id: 'sub1', studentId: 's1', studentName: 'Alice', planId: 'p1', planName: 'Intro', startDate: '2025-08-01', endDate: '2025-09-01', status: 'active' },
  { id: 'sub2', studentId: 's2', studentName: 'Bob', planId: 'p2', planName: 'Standard', startDate: '2025-06-01', endDate: '2025-09-01', status: 'due_soon' },
  { id: 'sub3', studentId: 's3', studentName: 'Charlie', planId: 'p2', planName: 'Standard', startDate: '2025-01-01', endDate: '2025-04-01', status: 'expired' },
]

export default function ReportsPage() {
  const totalRevenue = mockPayments.reduce((s, p) => s + p.amount, 0)
  const counts = {
    active: mockSubs.filter(s => s.status === 'active').length,
    due_soon: mockSubs.filter(s => s.status === 'due_soon').length,
    expired: mockSubs.filter(s => s.status === 'expired').length,
  }

  return (
    <div>
      <h2>Reports</h2>
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

      <h3>Payments</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {mockPayments.map(p => (
            <tr key={p.id} style={{ borderTop: '1px solid #eee' }}>
              <td>{p.id}</td>
              <td>{p.studentName}</td>
              <td>{p.amount}</td>
              <td>{p.paymentDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Subscriptions</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Plan</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {mockSubs.map(s => (
            <tr key={s.id} style={{ borderTop: '1px solid #eee' }}>
              <td>{s.id}</td>
              <td>{s.studentName}</td>
              <td>{s.planName}</td>
              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

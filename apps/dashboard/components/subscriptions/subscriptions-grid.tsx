"use client"

import React from 'react'
import { Subscription } from './types'

function statusBadge(status: Subscription['status']) {
  if (status === 'active') return 'text-green-600 bg-green-100'
  if (status === 'due_soon') return 'text-yellow-600 bg-yellow-100'
  return 'text-red-600 bg-red-100'
}

export default function SubscriptionsGrid({ items, onDelete, onUpdateStatus, isDeleteMode = false, selectedIds = [], onToggleSelect, onRequestDelete }: { items: Subscription[], onDelete: (id: string) => void, onUpdateStatus: (id: string, status: Subscription['status']) => void, isDeleteMode?: boolean, selectedIds?: string[], onToggleSelect?: (id: string) => void, onRequestDelete?: (id: string) => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscriptions</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  {isDeleteMode && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => onToggleSelect && onToggleSelect(s.id)} />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{s.studentName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.planName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.endDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge(s.status)}`}>{s.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button className="text-blue-600 hover:text-blue-900" onClick={() => onUpdateStatus(s.id, 'active')}>Active</button>
                      <button className="text-yellow-600 hover:text-yellow-900" onClick={() => onUpdateStatus(s.id, 'due_soon')}>Due soon</button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => onUpdateStatus(s.id, 'expired')}>Expired</button>
                      <button className="text-gray-600 hover:text-gray-900" onClick={() => { if (onRequestDelete) onRequestDelete(s.id); else onDelete(s.id) }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Load More Subscriptions
          </button>
        </div>
      </div>
    </div>
  )
}

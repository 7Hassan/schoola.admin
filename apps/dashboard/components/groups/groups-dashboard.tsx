'use client'

import React from 'react'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Upload,
  Minus,
  X,
  Users,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Input } from '@workspace/ui/components/ui/input'
import { Card } from '@workspace/ui/components/ui/card'
import { useGroupsStore } from '@/stores/groups-store'
import { GroupCard } from './group-card'
import { GroupDrawer } from './group-drawer'
import { GroupsFilters } from './groups-filters'
import { GroupsGrid } from './groups-grid'
import { GroupsPagination } from './groups-pagination'
import { DeleteConfirmationModal } from '../shared/delete-confirmation-modal'
import { ExportModal } from '../shared/export-modal'
import { formatGroupsForExport } from '@/utils/export-utils'
import Link from 'next/link'

export function GroupsDashboard() {
  const {
    // Data
    groups,
    getFilteredGroups,
    getPaginatedGroups,
    teachers,
    courses,
    locations,

    // UI State
    isDrawerOpen,
    isDeleteMode,
    selectedGroupsForDeletion,
    isDeleteModalOpen,
    isExportModalOpen,

    // Actions
    openAddDrawer,
    updateFilters,
    enterDeleteMode,
    exitDeleteMode,
    clearSelectedGroupsForDeletion,
    confirmDeleteSelectedGroups,
    closeDeleteModal,
    executeDeleteSelectedGroups,
    openExportModal,
    closeExportModal,

    // Filters
    filters
  } = useGroupsStore()

  const filteredGroups = getFilteredGroups()
  const paginatedGroups = getPaginatedGroups()

  const stats = {
    total: groups.length,
    active: groups.filter((g) => g.status === 'active').length,
    completed: groups.filter((g) => g.status === 'completed').length,
    canceled: groups.filter((g) => g.status === 'canceled').length
  }

  const handleSearchChange = (value: string) => {
    updateFilters({ searchQuery: value })
  }

  // Prepare modal data
  const selectedGroupNames = groups
    .filter((group) => selectedGroupsForDeletion.includes(group.id))
    .map((group) => group.name)

  return (
    <div className="space-y-6 p-6 overflow-y-auto w-full h-screen">
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
          isDeleteMode
            ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
            : ''
        }`}
      >
        <div>
          <h1
            className={`text-3xl font-bold transition-colors ${
              isDeleteMode
                ? 'text-red-900 dark:text-red-100'
                : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {isDeleteMode ? 'Delete Groups' : 'Groups Management'}
          </h1>
          <p
            className={`mt-1 transition-colors ${
              isDeleteMode
                ? 'text-red-700 dark:text-red-300'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {isDeleteMode
              ? `${selectedGroupsForDeletion.length} group${selectedGroupsForDeletion.length !== 1 ? 's' : ''} selected for deletion`
              : 'Create, edit, and organize student groups and classes'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {!isDeleteMode ? (
            // Normal mode buttons
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={openExportModal}
              >
                <Upload className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button
                size="sm"
                className="bg-destructive hover:bg-destructive/90"
                onClick={enterDeleteMode}
              >
                <Minus className="h-4 w-4 mr-2" />
                Delete Group
              </Button>
            </>
          ) : (
            // Delete mode buttons
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={exitDeleteMode}
                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950/30"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={confirmDeleteSelectedGroups}
                disabled={selectedGroupsForDeletion.length === 0}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Minus className="h-4 w-4 mr-2" />
                Delete ({selectedGroupsForDeletion.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Groups</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
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
              <p className="text-2xl font-bold text-foreground">
                {stats.active}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.completed}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Canceled</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.canceled}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <GroupsFilters />

      {/* Groups Grid */}
      <GroupsGrid />

      {/* Group Drawer */}
      <GroupDrawer />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={executeDeleteSelectedGroups}
        selectedCount={selectedGroupsForDeletion.length}
        selectedNames={selectedGroupNames}
        itemType="group"
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        data={formatGroupsForExport(
          filteredGroups,
          teachers,
          courses,
          locations
        )}
        defaultFilename="groups_export"
        title="Export Groups Data"
        description="Choose your preferred format to export the current groups data:"
      />
    </div>
  )
}


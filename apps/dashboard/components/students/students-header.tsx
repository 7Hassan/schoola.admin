
"use client"

// ...existing code...
import { StudentsHeaderActions } from './students-header/StudentsHeaderActions'
import { StudentsHeaderProps } from './students-header/types'
import { StudentsHeaderTitle } from './students-header/StudentsHeaderTitle'
import { ImportStudentsModal } from './students-header/ImportStudentsModal'
import React, { useState } from 'react'

export function StudentsHeader(props: StudentsHeaderProps) {
  const {
    isDeleteMode,
    selectedCount,
    openExportModal,
    openAddDrawer,
    enterDeleteMode,
    exitDeleteMode,
    confirmDeleteSelectedStudents,
    canEdit
  } = props

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importedValidStudents, setImportedValidStudents] = useState<any[]>([]);
  const [importedInvalidStudents, setImportedInvalidStudents] = useState<any[]>([]);
  const [showImportedPage, setShowImportedPage] = useState(false);

  const handleOpenImportModal = () => setImportModalOpen(true);
  const handleCloseImportModal = () => setImportModalOpen(false);
  const handleSaveImported = (valid: any[], invalid: any[]) => {
    setImportedValidStudents(valid);
    setImportedInvalidStudents(invalid);
    setShowImportedPage(true);
  };
  const handleBackToHeader = () => setShowImportedPage(false);

  if (showImportedPage) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Imported Students</h2>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Valid Students ({importedValidStudents.length})</h3>
          <div className="overflow-auto max-h-48 border rounded mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  {importedValidStudents[0] && Object.keys(importedValidStudents[0]).map(field => (
                    <th key={field} className="px-2 py-1 border-b">{field === 'childName' ? 'Child Name' : field === 'parentName' ? 'Parent Name' : field}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importedValidStudents.map((row, i) => (
                  <tr key={i}>
                    {Object.keys(row).map(field => <td key={field} className="px-2 py-1">{row[field]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-red-600">Students with Missing Data ({importedInvalidStudents.length})</h3>
          <div className="overflow-auto max-h-48 border rounded mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  {importedInvalidStudents[0] && Object.keys(importedInvalidStudents[0]).map(field => (
                    <th key={field} className="px-2 py-1 border-b">{field}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importedInvalidStudents.map((row, i) => (
                  <tr key={i} className="bg-red-50">
                    {Object.keys(row).map(field => <td key={field} className="px-2 py-1">{row[field]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded" onClick={handleBackToHeader}>Back</button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg transition-colors ${isDeleteMode
        ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
        : ''
        }`}
    >
      <StudentsHeaderTitle isDeleteMode={isDeleteMode} selectedCount={selectedCount} />

      <StudentsHeaderActions
        isDeleteMode={isDeleteMode}
        selectedCount={selectedCount}
        openExportModal={openExportModal}
        openAddDrawer={openAddDrawer}
        enterDeleteMode={enterDeleteMode}
        exitDeleteMode={exitDeleteMode}
        confirmDeleteSelectedStudents={confirmDeleteSelectedStudents}
        canEdit={canEdit}
        openImportModal={handleOpenImportModal}
      />

      <ImportStudentsModal
        open={importModalOpen}
        onClose={handleCloseImportModal}
        onSave={handleSaveImported}
      />
    </div>
  )
}

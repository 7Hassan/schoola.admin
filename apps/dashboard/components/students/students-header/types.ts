export interface StudentsHeaderProps {
  isDeleteMode: boolean
  selectedCount: number
  openExportModal: () => void
  openAddDrawer: () => void
  enterDeleteMode: () => void
  exitDeleteMode: () => void
  confirmDeleteSelectedStudents: () => void
  canEdit: boolean
}

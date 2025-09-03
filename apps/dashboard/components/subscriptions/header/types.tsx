export type SubscriptionsHeaderProps = {
  isDeleteMode?: boolean
  selectedCount?: number
  openAdd?: () => void
  enterDeleteMode?: () => void
  exitDeleteMode?: () => void
  confirmDeleteSelected?: () => void
  canEdit?: boolean
}

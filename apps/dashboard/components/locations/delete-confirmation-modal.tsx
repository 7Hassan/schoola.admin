'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@workspace/ui/components/ui/dialog'
import { Button } from '@workspace/ui/components/ui/button'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  selectedCount: number
  selectedNames: string[]
  itemType?: 'location' | 'student'
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  selectedNames,
  itemType = 'location'
}: DeleteConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const itemTypePlural = itemType === 'location' ? 'locations' : 'students'
  const itemTypeSingular = itemType === 'location' ? 'location' : 'student'
  const ItemTypeTitle = itemType === 'location' ? 'Location' : 'Student'
  const ItemTypeTitlePlural = itemType === 'location' ? 'Locations' : 'Students'

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <DialogTitle className="text-red-900">
              Delete {selectedCount === 1 ? ItemTypeTitle : ItemTypeTitlePlural}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 mt-2">
            {selectedCount === 1 ? (
              <>
                Are you sure you want to delete{' '}
                <span className="font-medium">"{selectedNames[0]}"</span>?
              </>
            ) : (
              <>
                Are you sure you want to delete{' '}
                <span className="font-medium">
                  {selectedCount} {itemTypePlural}
                </span>
                ?
              </>
            )}
            <br />
            <span className="text-red-600 font-medium">
              This action cannot be undone.
            </span>
          </DialogDescription>
        </DialogHeader>

        {selectedCount > 1 && (
          <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-3 text-sm">
            <p className="font-medium text-gray-700 mb-2">
              {ItemTypeTitlePlural} to be deleted:
            </p>
            <ul className="space-y-1">
              {selectedNames.map((name, index) => (
                <li
                  key={index}
                  className="text-gray-600"
                >
                  • {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete{' '}
            {selectedCount === 1
              ? ItemTypeTitle
              : `${selectedCount} ${ItemTypeTitlePlural}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


'use client'

import { useState } from 'react'
import {
  ExportFormat,
  ExportOptions,
  ExportableRecord,
  exportData
} from '@/utils/export-utils'
import { useToast } from '@workspace/ui/hooks/use-toast'

interface UseExportOptions {
  defaultFilename: string
  defaultFormat?: ExportFormat
}

interface UseExportReturn {
  isExportModalOpen: boolean
  isExporting: boolean
  selectedFormat: ExportFormat
  openExportModal: () => void
  closeExportModal: () => void
  setSelectedFormat: (format: ExportFormat) => void
  handleExport: (
    data: ExportableRecord[],
    options?: Partial<ExportOptions>
  ) => Promise<void>
}

/**
 * Reusable hook for export functionality across the application
 */
export function useExport({
  defaultFilename,
  defaultFormat = 'excel'
}: UseExportOptions): UseExportReturn {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedFormat, setSelectedFormat] =
    useState<ExportFormat>(defaultFormat)
  const { toast } = useToast()

  const openExportModal = () => setIsExportModalOpen(true)
  const closeExportModal = () => setIsExportModalOpen(false)

  const handleExport = async (
    data: ExportableRecord[],
    options: Partial<ExportOptions> = {}
  ): Promise<void> => {
    if (data.length === 0) {
      toast({
        title: 'No Data to Export',
        description: 'There is no data available to export.',
        variant: 'destructive'
      })
      return
    }

    setIsExporting(true)

    try {
      const exportOptions: ExportOptions = {
        format: selectedFormat,
        filename: defaultFilename,
        timestamp: true,
        ...options
      }

      exportData(data, exportOptions)

      toast({
        title: 'Export Successful',
        description: `Successfully exported ${data.length} record${data.length !== 1 ? 's' : ''} as ${selectedFormat.toUpperCase()}.`
      })

      closeExportModal()
    } catch (error) {
      toast({
        title: 'Export Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred during export.',
        variant: 'destructive'
      })
    } finally {
      setIsExporting(false)
    }
  }

  return {
    isExportModalOpen,
    isExporting,
    selectedFormat,
    openExportModal,
    closeExportModal,
    setSelectedFormat,
    handleExport
  }
}

/**
 * Example usage for students:
 *
 * const export = useExport({ defaultFilename: 'students_export' })
 * const students = useStudentsStore(state => state.getFilteredStudents())
 *
 * // In your component:
 * <Button onClick={exportHook.openExportModal}>Export</Button>
 *
 * <ExportModal
 *   isOpen={exportHook.isExportModalOpen}
 *   onClose={exportHook.closeExportModal}
 *   data={formatStudentsForExport(students)}
 *   defaultFilename="students_export"
 * />
 */


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
import { Card } from '@workspace/ui/components/ui/card'
import { Download, FileSpreadsheet, FileText, X } from 'lucide-react'
import { useState } from 'react'
import {
  exportData,
  ExportFormat,
  ExportOptions,
  ExportableRecord
} from '@/utils/export-utils'
import { useToast } from '@workspace/ui/hooks/use-toast'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  data: ExportableRecord[]
  defaultFilename: string
  title?: string
  description?: string
}

export function ExportModal({
  isOpen,
  onClose,
  data,
  defaultFilename,
  title = 'Export Data',
  description = 'Choose your preferred export format:'
}: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('excel')
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
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
      const options: ExportOptions = {
        format: selectedFormat,
        filename: defaultFilename,
        timestamp: true
      }

      exportData(data, options)

      toast({
        title: 'Export Successful',
        description: `Successfully exported ${data.length} record${data.length !== 1 ? 's' : ''} as ${selectedFormat.toUpperCase()}.`
      })

      onClose()
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

  const formatOptions = [
    {
      id: 'excel' as ExportFormat,
      name: 'Excel File',
      description: 'Export as .xlsx file for Excel, Sheets, Numbers',
      icon: FileSpreadsheet,
      fileType: '.xlsx',
      recommended: true
    },
    {
      id: 'csv' as ExportFormat,
      name: 'CSV File',
      description: 'Export as .csv file for any spreadsheet application',
      icon: FileText,
      fileType: '.csv',
      recommended: false
    }
  ]

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Download className="w-4 h-4 text-blue-600" />
            </div>
            <DialogTitle className="text-blue-900">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 mt-2">
            {description}
            <br />
            <span className="text-sm text-gray-500">
              {data.length} record{data.length !== 1 ? 's' : ''} will be
              exported.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {formatOptions.map((option) => {
            const Icon = option.icon
            const isSelected = selectedFormat === option.id

            return (
              <Card
                key={option.id}
                className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => setSelectedFormat(option.id)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isSelected ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3
                        className={`font-medium ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}
                      >
                        {option.name}
                      </h3>
                      {option.recommended && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        isSelected ? 'text-blue-700' : 'text-gray-600'
                      }`}
                    >
                      {option.description}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isSelected ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      File type: {option.fileType}
                    </p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-full h-full bg-white rounded-full scale-50"></div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isExporting}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isExporting || data.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting
              ? 'Exporting...'
              : `Export ${selectedFormat.toUpperCase()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


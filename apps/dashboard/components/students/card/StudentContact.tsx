import { MessageCircle, Phone, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'

interface StudentContactProps {
  parentPhone: string
  hasWhatsapp?: boolean
  whatsappPhone?: string | null
}

export function StudentContact({ parentPhone, hasWhatsapp = false, whatsappPhone }: StudentContactProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(parentPhone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const waNumber = (whatsappPhone || parentPhone || '').replace(/[^\d]/g, '')

  return (
    <div className="text-sm text-gray-600 space-y-1">
      {hasWhatsapp && (
        <div className="flex items-center space-x-2 mt-2 mb-2">
          <MessageCircle className="inline h-4 w-4 text-green-600" />
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
            onClick={e => e.stopPropagation()}
            title="Send WhatsApp message"
          >
            WhatsApp
          </a>
        </div>
      )}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <Phone className="inline h-4 w-4 text-blue-600" />
          <a
            href={`tel:${parentPhone}`}
            className="text-blue-600 hover:underline transition-colors"
            onClick={e => e.stopPropagation()}
          >
            {parentPhone}
          </a>

        </div>
        <button
          type="button"
          className="ml-1 p-1 rounded hover:bg-blue-50 transition-colors"
          onClick={handleCopy}
          title="Copy number"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 text-blue-600" />
          )}
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Input } from '@workspace/ui/components/ui/input'
import { Textarea } from '@workspace/ui/components/ui/textarea'
import { Card } from '@workspace/ui/components/ui/card'
import { useFormStore } from '@workspace/ui/lib/store'

export function FormHeader() {
  const { currentForm, setFormTitle, setFormDescription } = useFormStore()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)

  return (
    <Card className="p-6 mb-6 border-l-4 border-l-blue-600">
      <div className="space-y-4">
        <div>
          {isEditingTitle ? (
            <Input
              value={currentForm.title}
              onChange={(e) => setFormTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingTitle(false)
                }
              }}
              className="text-2xl font-bold border-none shadow-none p-0 focus-visible:ring-0"
              autoFocus
            />
          ) : (
            <h1
              className="text-2xl font-bold text-gray-900 cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded"
              onClick={() => setIsEditingTitle(true)}
            >
              {currentForm.title}
            </h1>
          )}
        </div>

        <div>
          {isEditingDescription ? (
            <Textarea
              value={currentForm.description}
              onChange={(e) => setFormDescription(e.target.value)}
              onBlur={() => setIsEditingDescription(false)}
              className="text-gray-600 border-none shadow-none p-0 focus-visible:ring-0 resize-none"
              autoFocus
              rows={2}
            />
          ) : (
            <p
              className="text-gray-600 cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded"
              onClick={() => setIsEditingDescription(true)}
            >
              {currentForm.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}


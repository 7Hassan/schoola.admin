'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'

import { Button } from '@workspace/ui/components/ui/button'
import { Card, CardContent } from '@workspace/ui/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@workspace/ui/components/ui/dropdown-menu'
import { ScrollArea } from '@workspace/ui/components/ui/scroll-area'

import {
  FieldDefinition,
  FieldType,
  createDefaultField,
  fieldTypeLabels
} from '@/types/forms/form-builder-types'
import { FieldEditor } from './field-editor'
import { SortableFieldItem } from './sortable-field-item'

interface SchemaEditorProps {
  fields: FieldDefinition[]
  selectedFieldId: string | null
  onFieldSelect: (fieldId: string | null) => void
  onFieldAdd: (field: FieldDefinition) => void
  onFieldUpdate: (fieldId: string, updates: Partial<FieldDefinition>) => void
  onFieldDelete: (fieldId: string) => void
  onFieldMove: (fieldId: string, direction: 'up' | 'down') => void
  onFieldsReorder: (activeId: string, overId: string) => void
}

export function SchemaEditor({
  fields,
  selectedFieldId,
  onFieldSelect,
  onFieldAdd,
  onFieldUpdate,
  onFieldDelete,
  onFieldMove,
  onFieldsReorder
}: SchemaEditorProps) {
  const [isAddingField, setIsAddingField] = useState(false)

  // Configure sensors for drag and drop - very restrictive to prevent interference with text inputs
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 20 // Require significant movement before starting drag
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 400, // Long delay for touch to prevent accidental drags
      tolerance: 10
    }
  })
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  })
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      onFieldsReorder(active.id as string, over.id as string)
    }
  }

  const handleAddField = (type: FieldType) => {
    const newField = createDefaultField(type)
    onFieldAdd(newField)
    onFieldSelect(newField.id)
    setIsAddingField(false)
  }

  const selectedField = selectedFieldId
    ? fields.find((f) => f.id === selectedFieldId)
    : null

  return (
    <div className="flex h-full">
      {/* Field List */}
      <div className="w-80 border-r bg-muted/20">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Form Fields</h3>
            <DropdownMenu
              open={isAddingField}
              onOpenChange={setIsAddingField}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                  Add Field
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48"
              >
                <DropdownMenuLabel>Field Types</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(fieldTypeLabels).map(([type, label]) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => handleAddField(type as FieldType)}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  No fields added yet
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Field
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="w-48"
                  >
                    <DropdownMenuLabel>Field Types</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(fieldTypeLabels).map(([type, label]) => (
                      <DropdownMenuItem
                        key={type}
                        onClick={() => handleAddField(type as FieldType)}
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={fields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <SortableFieldItem
                        key={field.id}
                        field={field}
                        index={index}
                        isSelected={selectedFieldId === field.id}
                        onSelect={() => onFieldSelect(field.id)}
                        onDelete={() => onFieldDelete(field.id)}
                        onMoveUp={
                          index > 0
                            ? () => onFieldMove(field.id, 'up')
                            : undefined
                        }
                        onMoveDown={
                          index < fields.length - 1
                            ? () => onFieldMove(field.id, 'down')
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Field Editor */}
      <div className="flex-1">
        {selectedField ? (
          <FieldEditor
            field={selectedField}
            isSelected={true}
            onSelect={() => {}}
            onUpdate={(updates) => onFieldUpdate(selectedField.id, updates)}
            onDuplicate={() => {
              const duplicated = { ...selectedField, id: crypto.randomUUID() }
              onFieldAdd(duplicated)
            }}
            onDelete={() => {
              onFieldDelete(selectedField.id)
              onFieldSelect(null)
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-muted-foreground mb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="h-8 w-8" />
                  </div>
                  <h3 className="font-medium mb-2">No field selected</h3>
                  <p className="text-sm">
                    Select a field from the list to edit its properties, or add
                    a new field to get started.
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Field
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="w-48"
                  >
                    <DropdownMenuLabel>Field Types</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(fieldTypeLabels).map(([type, label]) => (
                      <DropdownMenuItem
                        key={type}
                        onClick={() => handleAddField(type as FieldType)}
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}


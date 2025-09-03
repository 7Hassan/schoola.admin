'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  Type,
  Hash,
  Mail,
  FileText,
  CheckSquare,
  Circle,
  List,
  Upload
} from 'lucide-react'

import { Button } from '@workspace/ui/components/ui/button'
import { Card } from '@workspace/ui/components/ui/card'
import { Badge } from '@workspace/ui/components/ui/badge'

import { FieldDefinition } from '@/types/forms/form-builder-types'

const fieldIcons = {
  text: Type,
  number: Hash,
  email: Mail,
  textarea: FileText,
  checkbox: CheckSquare,
  radio: Circle,
  select: List,
  file: Upload
} as const

interface SortableFieldItemProps {
  field: FieldDefinition
  index: number
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

export function SortableFieldItem({
  field,
  index,
  isSelected,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown
}: SortableFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const Icon = fieldIcons[field.type] || Type

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        group transition-colors hover:bg-accent/50
        ${isSelected ? 'ring-2 ring-primary bg-accent/30' : ''}
        ${isDragging ? 'shadow-lg' : ''}
      `}
    >
      <div className="p-3">
        <div className="flex items-center gap-3">
          {/* Drag Handle - Only draggable area */}
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 cursor-grab active:cursor-grabbing hover:bg-accent/70 p-1 rounded transition-colors group/drag"
            title="Drag to reorder"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground group-hover/drag:text-primary" />
          </div>

          {/* Field Icon */}
          <div className="flex-shrink-0">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Field Info - Clickable but not draggable */}
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={onSelect}
            onPointerDown={(e) => {
              // Prevent drag operation when clicking on field info
              e.stopPropagation()
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">
                {field.label || `Field ${index + 1}`}
              </span>
              {field.required && (
                <Badge
                  variant="secondary"
                  className="text-xs"
                >
                  Required
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="text-xs"
              >
                {field.type}
              </Badge>
              {field.placeholder && (
                <span className="text-xs text-muted-foreground truncate">
                  {field.placeholder}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onMoveUp && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onMoveUp()
                }}
                className="h-6 w-6 p-0"
                title="Move up"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
            )}
            {onMoveDown && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onMoveDown()
                }}
                className="h-6 w-6 p-0"
                title="Move down"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              title="Delete field"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}


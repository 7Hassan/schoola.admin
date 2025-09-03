'use client'

import React, { useState, useEffect } from 'react'
import {
  Edit2,
  X,
  Save,
  Calendar,
  Users,
  Tag,
  FileText,
  Link,
  Plus,
  Trash2,
  Clock
} from 'lucide-react'
import { Button } from '@workspace/ui/components/ui/button'
import { Input } from '@workspace/ui/components/ui/input'
import { Textarea } from '@workspace/ui/components/ui/textarea'
import { Label } from '@workspace/ui/components/ui/label'
import { Badge } from '@workspace/ui/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from '@workspace/ui/components/ui/sheet'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@workspace/ui/components/ui/avatar'
import {
  useCoursesStore,
  type Course,
  type CourseLevel,
  type MaterialLink
} from '@/stores/courses-store'

interface CourseEditDrawerProps {
  course: Course
  children?: React.ReactNode
}

export function CourseEditDrawer({ course, children }: CourseEditDrawerProps) {
  const { updateCourse, categories } = useCoursesStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Course>(course)
  const [materialLinks, setMaterialLinks] = useState<MaterialLink[]>(
    course.materialLinks || []
  )
  const [newMaterialLink, setNewMaterialLink] = useState({
    title: '',
    url: '',
    type: 'document' as MaterialLink['type']
  })

  // Reset form when course changes
  useEffect(() => {
    setFormData(course)
    setMaterialLinks(course.materialLinks || [])
  }, [course])

  const handleInputChange = (field: keyof Course, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddMaterialLink = () => {
    if (newMaterialLink.title && newMaterialLink.url) {
      const newLink: MaterialLink = {
        ...newMaterialLink,
        id: `ml-${Date.now()}`,
        isRequired: false,
        uploadedAt: new Date()
      }
      setMaterialLinks((prev) => [...prev, newLink])
      setNewMaterialLink({ title: '', url: '', type: 'document' })
    }
  }

  const handleRemoveMaterialLink = (id: string) => {
    setMaterialLinks((prev) => prev.filter((link) => link.id !== id))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const updatedCourse: Course = {
        ...formData,
        materialLinks,
        lastUpdatedAt: new Date()
      }

      updateCourse(course.id, updatedCourse)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to update course:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(course)
    setMaterialLinks(course.materialLinks || [])
    setIsOpen(false)
  }

  const getCategoryColor = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.color || '#6B7280'
  }

  const levels: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced']
  const materialTypes: MaterialLink['type'][] = [
    'document',
    'video',
    'link',
    'pdf',
    'image'
  ]

  return (
    <Sheet
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SheetTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="sm"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Course
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5" />
            Edit Course
          </SheetTitle>
          <SheetDescription>
            Update course information, materials, and settings.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter course name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value: CourseLevel) =>
                    handleInputChange('level', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem
                        key={level}
                        value={level}
                      >
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder="Enter course description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Age Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Age Range</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minAge">Minimum Age</Label>
                <Input
                  id="minAge"
                  type="number"
                  min="5"
                  max="80"
                  value={formData.validAgeRange.minAge}
                  onChange={(e) =>
                    handleInputChange('validAgeRange', {
                      ...formData.validAgeRange,
                      minAge: parseInt(e.target.value) || 5
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAge">Maximum Age</Label>
                <Input
                  id="maxAge"
                  type="number"
                  min="5"
                  max="80"
                  value={formData.validAgeRange.maxAge}
                  onChange={(e) =>
                    handleInputChange('validAgeRange', {
                      ...formData.validAgeRange,
                      maxAge: parseInt(e.target.value) || 25
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Course Duration & Structure */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Course Structure</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (weeks)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange(
                        'duration',
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalLectures">Total Lectures</Label>
                <Input
                  id="totalLectures"
                  type="number"
                  min="1"
                  value={formData.totalLectures}
                  onChange={(e) =>
                    handleInputChange(
                      'totalLectures',
                      parseInt(e.target.value) || 1
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Related Groups */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Related Groups</h3>
            <div className="space-y-2">
              <Label>Groups taking this course</Label>
              {/* Mock group selection - in real implementation, integrate with groups store */}
              <div className="space-y-2">
                {[
                  { id: 'group-1', name: 'Math Group A' },
                  { id: 'group-2', name: 'Science Group B' },
                  { id: 'group-3', name: 'Programming Group C' },
                  { id: 'group-4', name: 'Advanced Math' },
                  { id: 'group-5', name: 'Data Science Group' }
                ].map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={`group-${group.id}`}
                      checked={formData.relatedGroupIds.includes(group.id)}
                      onChange={(e) => {
                        const newGroupIds = e.target.checked
                          ? [...formData.relatedGroupIds, group.id]
                          : formData.relatedGroupIds.filter(
                              (id) => id !== group.id
                            )
                        handleInputChange('relatedGroupIds', newGroupIds)
                      }}
                      className="rounded border-gray-300"
                    />
                    <label
                      htmlFor={`group-${group.id}`}
                      className="text-sm text-gray-700"
                    >
                      {group.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Material Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Course Materials</h3>

            {/* Existing Materials */}
            {materialLinks.length > 0 && (
              <div className="space-y-2">
                {materialLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <Badge
                      variant="outline"
                      className="shrink-0"
                    >
                      {link.type}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {link.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {link.url}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMaterialLink(link.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Material */}
            <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
              <Label>Add New Material</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Material title"
                  value={newMaterialLink.title}
                  onChange={(e) =>
                    setNewMaterialLink((prev) => ({
                      ...prev,
                      title: e.target.value
                    }))
                  }
                />
                <Select
                  value={newMaterialLink.type}
                  onValueChange={(value: MaterialLink['type']) =>
                    setNewMaterialLink((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {materialTypes.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                      >
                        <span className="capitalize">{type}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="URL or file path"
                  value={newMaterialLink.url}
                  onChange={(e) =>
                    setNewMaterialLink((prev) => ({
                      ...prev,
                      url: e.target.value
                    }))
                  }
                  className="flex-1"
                />
                <Button
                  onClick={handleAddMaterialLink}
                  disabled={!newMaterialLink.title || !newMaterialLink.url}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notes</h3>
            <Textarea
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any additional notes about the course..."
              rows={3}
            />
          </div>
        </div>

        <SheetFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}


import { User, Users, FileText, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface StudentDetailsProps {
  age: number
  group: string
  source: string
  info?: string
  createdAt: Date
  lastUpdatedAt: Date
  childName?: string
  parentName?: string
}

export function StudentDetails({ age, group, source, info, createdAt, lastUpdatedAt, childName, parentName }: StudentDetailsProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 space-y-1">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Age: {age}</span>
        </div>
        {childName && (
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Child: {childName}</span>
          </div>
        )}
        {parentName && (
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Parent: {parentName}</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{group}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <FileText className="h-4 w-4" />
        <span>Source: {source}</span>
      </div>
      {info && (
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
          <p className="line-clamp-2">{info}</p>
        </div>
      )}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex flex-col text-xs text-gray-500 space-y-1">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Created: {format(createdAt, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Updated: {format(lastUpdatedAt, 'MMM dd')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

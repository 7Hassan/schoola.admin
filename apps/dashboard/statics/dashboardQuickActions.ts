import {
  FileText,
  Upload,
  GraduationCap,
  Calendar,
  Users,
  Group,
  BookOpen,
  MapPin,
  Settings,
  BarChart3,
  MapPinPlus,
  MapPinCheckIcon,
  MapPinned,
  MapPinPlusInsideIcon,
  BookPlus,
  BookCheck,
  MapPinCheck
} from 'lucide-react'

type action = {
  type: 'link' | 'button'
  title: string
  description: string
  icon: React.ElementType
  href?: string
  onClick?: () => void
}

type actionCategory = {
  category: string
  actions: action[]
}

const actionCategoryArray: actionCategory[] = [
  {
    category: 'Forms',
    actions: [
      {
        type: 'link',
        title: 'Create New Form',
        description: 'Build a new form with the form builder',
        icon: FileText,
        href: '/forms/create'
      },
      {
        type: 'link',
        title: 'Import Form Template',
        description: 'Import from existing templates',
        icon: Upload,
        href: '/forms/templates'
      }
    ]
  },
  {
    category: 'Students',
    actions: [
      {
        type: 'link',
        title: 'Add New Student',
        description: 'Register a new student in the system',
        icon: GraduationCap,
        href: '/students/enrollment'
      },
      {
        type: 'link',
        title: 'Import Students',
        description: 'Bulk import students from CSV/Excel',
        icon: Upload,
        href: '/students/import'
      },
      {
        type: 'link',
        title: 'Take Attendance',
        description: 'Record student attendance',
        icon: Calendar,
        href: '/students/attendance'
      }
    ]
  },
  {
    category: 'Teachers',
    actions: [
      {
        type: 'link',
        title: 'Add New Teacher',
        description: 'Add a new teacher to the system',
        icon: Users,
        href: '/teachers/add'
      },
      {
        type: 'link',
        title: 'Create Assignment',
        description: 'Create a new assignment for students',
        icon: FileText,
        href: '/teachers/assignments'
      }
    ]
  },
  {
    category: 'Groups',
    actions: [
      {
        type: 'link',
        title: 'Manage Groups',
        description: 'Manage existing student groups or classes',
        icon: Users,
        href: '/groups/management'
      },
      {
        type: 'link',
        title: 'Create New Group',
        description: 'Create a student group or class',
        icon: Group,
        href: '/groups/create'
      }
    ]
  },
  {
    category: 'Courses',
    actions: [
      {
        type: 'link',
        title: 'Manage Courses',
        description: 'Edit or remove existing courses',
        icon: BookCheck,
        href: '/courses/management'
      },
      {
        type: 'link',
        title: 'Add New Course',
        description: 'Create a new course offering',
        icon: BookPlus,
        href: '/courses/create'
      }
    ]
  },
  {
    category: 'Locations',
    actions: [
      {
        type: 'link',
        title: 'Manage Locations',
        description: 'Configure location settings',
        icon: MapPinCheck,
        href: '/locations/management'
      },
      {
        type: 'link',
        title: 'Add Location',
        description: 'Add a new campus or location',
        icon: MapPinPlus,
        href: '/locations/create'
      }
    ]
  },
  {
    category: 'Administration',
    actions: [
      {
        type: 'link',
        title: 'System Settings',
        description: 'Configure system settings',
        icon: Settings,
        href: '/settings/general'
      },
      {
        type: 'link',
        title: 'Generate Reports',
        description: 'Create and download reports',
        icon: BarChart3,
        href: '/reports'
      }
    ]
  }
]

export { actionCategoryArray }


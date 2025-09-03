# Courses Management System

A comprehensive course management system built with Next.js 15, TypeScript, Tailwind CSS v4, and Zustand for state management.

## Overview

This implementation provides a complete courses management interface following the established patterns in the dashboard application. It includes all customer requirements and integrates seamlessly with the existing codebase architecture.

## Features

### Core Functionality

- ✅ **Course Creation & Management** - Full CRUD operations for courses
- ✅ **Advanced Filtering** - Filter by category, level, status, price range, enrollment, and age range
- ✅ **Search Functionality** - Real-time search across course names and descriptions
- ✅ **Pagination** - Efficient pagination with smart page number generation
- ✅ **Responsive Design** - Mobile-first responsive layout using Tailwind CSS

### Customer Requirements ✅

- **Course ID** - Unique identifier for each course
- **Course Name** - Descriptive course titles
- **Valid Age Range** - Minimum and maximum age filtering (5-80 years)
- **Description** - Detailed course descriptions
- **Material Links** - Support for PDF, video, document, link, and image resources
- **Notes** - Additional course notes and information

### Advanced Features

- **Category Management** - Color-coded course categories
- **Level-based Organization** - Beginner, Intermediate, Advanced levels
- **Status Tracking** - Draft, Active, Archived status management
- **Enrollment Tracking** - Current vs maximum enrollment monitoring
- **Price Management** - Multi-currency support (EGP, USD)
- **Instructor Assignment** - Multiple instructor support per course

## Architecture

### State Management

- **Store Location**: `/stores/courses-store.ts`
- **State Technology**: Zustand with TypeScript
- **Persistence**: Local state with future database integration ready

### Component Structure

```
/components/courses/
├── index.ts                 # Export barrel
├── course-card.tsx          # Individual course display
├── courses-grid.tsx         # Grid layout with responsive design
├── courses-pagination.tsx   # Pagination with ellipsis handling
├── courses-filters.tsx      # Advanced filtering interface
├── course-edit-drawer.tsx   # Course editing side panel
└── courses-dashboard.tsx    # Main dashboard component
```

### Page Integration

- **Route**: `/app/courses/page.tsx`
- **Layout**: Integrated with existing dashboard layout
- **Navigation**: Ready for sidebar navigation integration

## Component Details

### CourseCard

- Displays course information including age range, materials count, and instructor avatars
- Shows enrollment status and pricing
- Hover effects and action buttons
- Status indicators and category badges

### CoursesFilters

- Category filtering with color indicators
- Level and status multi-select
- Price, enrollment, and age range sliders
- Active filter badges with individual removal
- Clear all filters functionality

### CourseEditDrawer

- Side panel for editing course details
- Form validation and error handling
- Material links management
- Age range configuration
- Price and duration settings

### CoursesDashboard

- Statistics cards showing totals and metrics
- Search and filter integration
- Grid display with pagination
- Bulk actions and individual course actions
- Empty states and loading states

## Data Models

### Course Interface

```typescript
interface Course {
  id: string
  name: string
  code: string
  level: CourseLevel
  description: string
  category: string
  duration: number
  price: { amount: number; currency: Currency }
  validAgeRange: { minAge: number; maxAge: number }
  materialLinks: MaterialLink[]
  notes: string
  // ... additional fields
}
```

### MaterialLink Interface

```typescript
interface MaterialLink {
  id: string
  title: string
  url: string
  type: 'pdf' | 'video' | 'document' | 'link' | 'image'
  description?: string
  isRequired: boolean
  uploadedAt: Date
}
```

## Usage

### Basic Usage

```tsx
import { CoursesDashboard } from '@/components/courses'

export default function CoursesPage() {
  return (
    <div className="container mx-auto py-6">
      <CoursesDashboard />
    </div>
  )
}
```

### Individual Component Usage

```tsx
import {
  CourseCard,
  CoursesFilters,
  CourseEditDrawer
} from '@/components/courses'

// Use individual components as needed
```

## Implementation Status

### Phase 1: Core Infrastructure ✅

- [x] Zustand store with TypeScript interfaces
- [x] Mock data with customer requirements
- [x] Core component structure

### Phase 2: UI Components ✅

- [x] Course card with all required fields
- [x] Responsive grid layout
- [x] Comprehensive pagination
- [x] Advanced filtering interface
- [x] Course editing drawer

### Phase 3: Dashboard Integration ✅

- [x] Main dashboard component
- [x] Statistics and metrics
- [x] Search and filter integration
- [x] Action handling and modals

### Future Enhancements

- [ ] Backend API integration
- [ ] Real-time updates
- [ ] Export functionality
- [ ] Bulk operations UI
- [ ] Advanced reporting

## Technical Notes

### TypeScript

- Strict type checking enabled
- Comprehensive interfaces for all data models
- Type-safe state management

### Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management

### Performance

- Efficient filtering and pagination
- Optimized re-renders with Zustand
- Responsive image loading
- Lazy loading ready

### Responsive Design

- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Flexible grid systems

## Dependencies

### Required Packages

- `zustand` - State management
- `lucide-react` - Icons
- `@workspace/ui` - Shared UI components
- `tailwindcss` - Styling
- `typescript` - Type safety

### UI Components Used

- Button, Input, Textarea, Label
- Select, DropdownMenu, Sheet
- Card, Badge, Avatar
- AlertDialog, Slider
- Accordion (for future use)

## Development Workflow

1. **Adding New Features**
   - Update TypeScript interfaces in the store
   - Add component logic
   - Update UI components
   - Test responsiveness

2. **Customization**
   - Modify the store for different data sources
   - Customize component styling
   - Add new filter types
   - Extend material link types

3. **Integration**
   - Import components using the barrel export
   - Use the store hooks for state management
   - Follow existing patterns for consistency

This implementation provides a solid foundation for course management that can be extended and customized based on specific requirements while maintaining type safety and following best practices.


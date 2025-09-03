# Export System Documentation

## Overview

The export system provides a reusable, modal-based flow for exporting data in different formats (Excel/CSV) across the entire application. It's designed to be flexible and work with any type of data while maintaining consistency in the user experience.

## Components

### 1. Core Utilities (`/lib/export-utils.ts`)

**Main Functions:**

- `exportData(data, options)` - Main export function
- `formatStudentsForExport(students)` - Format student data for export
- `formatTeachersForExport(teachers)` - Format teacher data for export
- `formatCoursesForExport(courses)` - Format course data for export

**Types:**

- `ExportFormat: 'excel' | 'csv'`
- `ExportableRecord: { [key: string]: any }`
- `ExportOptions: { filename?, timestamp?, format }`

### 2. Export Modal (`/components/shared/export-modal.tsx`)

A reusable modal component that:

- Shows format selection (Excel vs CSV)
- Displays record count
- Handles the actual export process
- Shows success/error messages via toast

### 3. Export Hook (`/hooks/use-export.ts`)

A custom React hook that provides:

- Modal state management
- Export functionality
- Format selection
- Error handling

### 4. Updated Stores

The students store now includes:

- `isExportModalOpen: boolean`
- `openExportModal()` and `closeExportModal()` methods

## Usage Examples

### Basic Usage (Recommended)

```tsx
import { ExportModal } from '@/components/shared/export-modal'
import { Button } from '@workspace/ui/components/ui/button'
import { Download } from 'lucide-react'
import { formatStudentsForExport } from '@/lib/export-utils'

function YourComponent() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const students = useStudentsStore((state) => state.getFilteredStudents())

  return (
    <div>
      <Button onClick={() => setIsExportModalOpen(true)}>
        <Download className="h-4 w-4 mr-2" />
        Export Data
      </Button>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={formatStudentsForExport(students)}
        defaultFilename="students_export"
        title="Export Students Data"
        description="Choose your preferred format:"
      />
    </div>
  )
}
```

### Advanced Usage with Custom Hook

```tsx
import { useExport } from '@/hooks/use-export'
import { ExportModal } from '@/components/shared/export-modal'
import { formatStudentsForExport } from '@/lib/export-utils'

function YourComponent() {
  const exportHook = useExport({
    defaultFilename: 'students_export',
    defaultFormat: 'excel'
  })
  const students = useStudentsStore((state) => state.getFilteredStudents())

  return (
    <div>
      <Button onClick={exportHook.openExportModal}>Export Data</Button>

      <ExportModal
        isOpen={exportHook.isExportModalOpen}
        onClose={exportHook.closeExportModal}
        data={formatStudentsForExport(students)}
        defaultFilename="students_export"
      />
    </div>
  )
}
```

### Store Integration (Students Example)

```tsx
function StudentsDashboard() {
  const {
    getFilteredStudents,
    isExportModalOpen,
    openExportModal,
    closeExportModal
  } = useStudentsStore()

  const students = getFilteredStudents()

  return (
    <div>
      <Button onClick={openExportModal}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        data={formatStudentsForExport(students)}
        defaultFilename="students_export"
        title="Export Students Data"
        description="Choose your preferred format to export the current student data:"
      />
    </div>
  )
}
```

## Adding Export to New Data Types

### 1. Create a Format Function

Add to `/lib/export-utils.ts`:

```tsx
export function formatYourDataForExport(
  data: YourDataType[]
): ExportableRecord[] {
  return data.map((item) => ({
    'Display Name 1': item.field1,
    'Display Name 2': item.field2,
    'Date Field': new Date(item.dateField).toLocaleDateString(),
    'Boolean Field': item.boolField ? 'Yes' : 'No'
    // ... more fields with user-friendly column names
  }))
}
```

### 2. Add Store Integration (Optional)

If using Zustand store:

```tsx
interface YourStore {
  isExportModalOpen: boolean
  openExportModal: () => void
  closeExportModal: () => void
  // ... other properties
}

export const useYourStore = create<YourStore>((set) => ({
  isExportModalOpen: false,
  openExportModal: () => set({ isExportModalOpen: true }),
  closeExportModal: () => set({ isExportModalOpen: false })
  // ... other methods
}))
```

### 3. Use in Component

```tsx
function YourDataComponent() {
  const { data, isExportModalOpen, openExportModal, closeExportModal } =
    useYourStore()

  return (
    <div>
      <Button onClick={openExportModal}>Export</Button>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        data={formatYourDataForExport(data)}
        defaultFilename="your_data_export"
        title="Export Your Data"
        description="Choose format for your data export:"
      />
    </div>
  )
}
```

## Features

### ✅ Implemented

- Modal-based export flow with format selection
- Excel (.xlsx) and CSV (.csv) export formats
- Automatic filename generation with timestamps
- Real-time data export (current filtered data)
- Reusable across all application sections
- Toast notifications for success/error feedback
- TypeScript support with proper types
- Professional UI with format recommendations

### 🔄 User Flow

1. User clicks "Export" button
2. Modal opens showing format options (Excel recommended, CSV alternative)
3. User selects preferred format
4. User clicks "Export [FORMAT]" button
5. File automatically downloads to user's device
6. Success toast notification shows
7. Modal closes automatically

### 🎨 UI/UX Features

- Clean, professional modal design
- Format selection with visual cards
- Radio button style selection
- File type indicators (.xlsx, .csv)
- Record count display
- Recommended format highlighting
- Loading states during export
- Clear cancel option

## File Structure

```
apps/dashboard/
├── components/
│   ├── shared/
│   │   ├── export-modal.tsx         # Reusable export modal
│   │   └── delete-confirmation-modal.tsx  # Updated for more types
│   ├── students/
│   │   └── students-dashboard.tsx   # Example implementation
│   └── examples/
│       └── teachers-export-example.tsx  # Example for other data types
├── hooks/
│   └── use-export.ts               # Reusable export hook
├── lib/
│   ├── export-utils.ts             # Core export utilities
│   └── students-store.ts           # Updated store with export
└── ...
```

## Technical Details

- **Browser Compatibility**: Uses standard Web APIs (Blob, URL.createObjectURL)
- **File Format**: CSV for broad compatibility, Excel metadata for .xlsx extension
- **Memory Efficient**: Streams data directly to download without storing in memory
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **TypeScript**: Fully typed for better developer experience
- **Performance**: Handles large datasets efficiently

## Best Practices

1. **Always format data appropriately** - Use user-friendly column names
2. **Include relevant fields only** - Don't export internal IDs unless necessary
3. **Format dates consistently** - Use locale-appropriate date formatting
4. **Handle boolean values** - Convert to "Yes/No" or similar readable format
5. **Use descriptive filenames** - Include data type and timestamp
6. **Test with edge cases** - Empty data, special characters, etc.


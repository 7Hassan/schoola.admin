# Form Builder System

A comprehensive, type-safe form builder implementation for the Schoola dashboard with advanced features and React DnD Kit integration.

## Features

### ✅ Implemented Features

#### Core Functionality

- **Dynamic Field Management**: Add, edit, delete, and reorder form fields
- **Drag & Drop Interface**: Intuitive field reordering using React DnD Kit
- **Live Preview**: Real-time form preview with validation
- **Type Safety**: Full TypeScript support with Zod validation schemas
- **Export/Import**: JSON-based schema export and import functionality

#### Field Types Supported

- Text Input
- Number Input
- Email Input
- Textarea (Long Text)
- Checkbox
- Radio Buttons (Single Choice)
- Select Dropdown
- File Upload

#### Advanced Field Configuration

- **Validation Rules**: Required fields, min/max length, min/max values, regex patterns
- **Field Options**: Dynamic options for select/radio fields with add/remove/edit
- **Cover Images**: Optional visual representations for fields
- **Custom Descriptions**: Help text and descriptions
- **Default Values**: Pre-filled field values

#### Form Settings

- Custom form title and description
- Form cover images
- Submit button text customization
- Progress bar display options
- Multiple submission controls

## Architecture

### Components

#### Main Components

- **`FormBuilderTab`** - Main container with tabbed interface (Edit/Preview/Settings)
- **`SchemaEditor`** - Left panel field list with drag-and-drop management
- **`FieldEditor`** - Right panel detailed field configuration
- **`FormPreview`** - Live form rendering with real validation
- **`SortableFieldItem`** - Individual draggable field list item

#### Hooks

- **`useFormBuilder`** - Main form schema management with reducer pattern
- **`useFormPreview`** - Form values and validation state management

#### Utilities

- **`form-builder-types.ts`** - Complete TypeScript type definitions
- **`form-serialization.ts`** - Import/export and validation utilities

### State Management

The form builder uses a reducer pattern for complex state management:

```typescript
interface FormBuilderState {
  schema: FormSchema
  selectedFieldId: string | null
  isPreviewMode: boolean
  isDirty: boolean
}
```

### Type System

Comprehensive TypeScript types ensure type safety:

```typescript
interface FieldDefinition {
  id: string
  type: FieldType
  label: string
  required: boolean
  validation?: ValidationRules
  options?: FieldOption[]
  // ... additional properties
}
```

## Usage

### Basic Implementation

```tsx
import { FormBuilderTab } from './form-builder-index'

function MyFormBuilder() {
  const handleSave = async (schema: FormSchema) => {
    // Save to your backend
  }

  const handleSubmit = async (data: FormValues) => {
    // Handle form submissions
    return { success: true, data }
  }

  return (
    <FormBuilderTab
      initialSchema={mySchema}
      onSave={handleSave}
      onSubmit={handleSubmit}
    />
  )
}
```

### Creating Custom Fields

```typescript
import { createDefaultField } from './lib/form-builder-types'

const newField = createDefaultField('text')
// Customize the field as needed
```

### Export/Import Schemas

```typescript
import { exportFormSchema, importFormSchema } from './lib/form-serialization'

// Export
const exportData = exportFormSchema(mySchema)

// Import
const schema = importFormSchema(exportData)
```

## Demo

A complete demo is available at `/form-builder-demo` which showcases:

- Field creation and management
- Drag-and-drop reordering
- Live preview with validation
- Export/import functionality
- Form submission handling

## File Structure

```
apps/dashboard/
├── components/forms/
│   ├── form-builder-tab.tsx      # Main tabbed interface
│   ├── schema-editor.tsx         # Field management panel
│   ├── field-editor.tsx          # Field configuration panel
│   ├── form-preview.tsx          # Live form preview
│   └── sortable-field-item.tsx   # Draggable field item
├── hooks/
│   ├── use-form-builder-new.ts   # Schema management hook
│   └── use-form-preview.ts       # Preview state hook
├── lib/
│   ├── form-builder-types.ts     # TypeScript definitions
│   └── form-serialization.ts     # Import/export utilities
├── app/form-builder-demo/
│   └── page.tsx                  # Demo implementation
└── form-builder-index.ts         # Public API exports
```

## Dependencies

- **React**: ^18.0.0
- **@dnd-kit/core**: Drag and drop functionality
- **@dnd-kit/sortable**: Sortable list implementation
- **zod**: Runtime type validation
- **lucide-react**: Icons
- **@workspace/ui**: UI component library

## Technical Highlights

### Advanced State Management

- Reducer pattern for complex state transitions
- Immutable updates with proper change tracking
- Undo/redo capability foundation

### Type Safety

- Zod schema generation for runtime validation
- Comprehensive TypeScript interfaces
- Generic type helpers for extensibility

### Performance Optimization

- Efficient drag-and-drop with minimal re-renders
- Memoized field components
- Lazy validation triggers

### User Experience

- Intuitive drag-and-drop interface
- Real-time validation feedback
- Progressive disclosure in field settings
- Keyboard navigation support

## Future Enhancements

- **Conditional Logic**: Show/hide fields based on other field values
- **Custom Field Types**: Plugin system for custom field implementations
- **Templates**: Pre-built form templates
- **Advanced Validation**: Cross-field validation rules
- **Themes**: Customizable form styling
- **Analytics**: Form interaction tracking
- **Multi-page Forms**: Step-by-step form flows

## Integration Notes

This form builder is designed to integrate seamlessly with the existing Schoola dashboard infrastructure and follows the established patterns for component architecture and state management.


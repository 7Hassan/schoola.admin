# Sub-plan 1.1: Image Upload Component Implementation Plan

## Overview

Create `ImageUploadDropzone` component in the UI package with drag & drop functionality, file validation, and preview capabilities.

## Current Dependencies Analysis

### ✅ Already Available Libraries

- **React**: `^19.0.0` - Core React for component development
- **React Hook Form**: `^7.53.0` (UI package) - Form state management
- **Zod**: `^3.24.2` (UI package) - Schema validation for file types/sizes
- **Lucide React**: `^0.475.0` - Icons (Upload, X, Image, etc.)
- **shadcn/ui Components**: Complete set available - Button, Card, Progress, Alert, Badge, etc.
- **Class Variance Authority**: `^0.7.1` - Component variants styling
- **Tailwind CSS**: `^4.0.8` - Styling and responsive design
- **TypeScript**: `^5.7.3` - Type safety

### 🎯 shadcn/ui Components to Leverage

- **Button**: File browse trigger, remove buttons, action buttons
- **Card**: Upload area container, preview container
- **Progress**: Upload progress visualization
- **Alert**: Error messages and validation feedback
- **Badge**: File type and size indicators
- **Skeleton**: Loading states during upload
- **Toast**: Success/error notifications (via Sonner)
- **Label**: Form field labels and descriptions

### 📦 Libraries to Add

#### Primary Dependencies

```json
{
  "react-dropzone": "^14.2.3"
}
```

**Why**: Industry-standard drag & drop file upload library with excellent TypeScript support and accessibility features.

#### Optional Dependencies (Phase 2)

```json
{
  "react-image-crop": "^11.0.7",
  "compressorjs": "^1.2.1"
}
```

- **react-image-crop**: For future image editing capabilities
- **compressorjs**: Client-side image compression

## Component Architecture

### 1. Component Structure

```
packages/ui/src/components/ui/
├── image-upload-dropzone.tsx     # Main component (leverages Card, Button, Progress)
└── image-preview.tsx             # Reusable preview component (leverages Card, Badge)
```

### 2. shadcn/ui Component Integration

- **Card**: Main upload area container with consistent styling
- **Button**: Browse files trigger, remove file actions
- **Progress**: Visual upload progress indicator
- **Alert**: Validation errors and user feedback
- **Badge**: File metadata display (size, type)
- **Skeleton**: Loading states during file processing

### 2. Core Features Implementation

#### 2.1 Drag & Drop Zone

- **Library**: `react-dropzone`
- **Features**:
  - Visual drag states (idle, drag-over, drag-reject)
  - Click to browse fallback
  - Multiple file support (configurable)
  - File type restrictions

#### 2.2 File Validation

- **Library**: `zod` (already available)
- **Validations**:
  ```typescript
  const imageUploadSchema = z.object({
    file: z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        'File must be less than 5MB'
      )
      .refine(
        (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        'Only JPEG, PNG, and WebP files are allowed'
      )
  })
  ```

#### 2.3 Preview Functionality

- **Implementation**: HTML5 FileReader API
- **Features**:
  - Thumbnail preview
  - File metadata display (name, size, type)
  - Remove/replace options
  - Loading states

#### 2.4 Progress & Feedback

- **Components**: shadcn Progress, Alert, Toast (Sonner), Badge
- **States**: idle, uploading, success, error
- **Feedback**: Progress bar, success/error alerts, toast notifications

## Component API Design

### Props Interface

```typescript
interface ImageUploadDropzoneProps {
  // Core functionality
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  currentFile?: File | string // File object or URL

  // Configuration
  maxSize?: number // in bytes, default 5MB
  acceptedTypes?: string[] // default: ['image/jpeg', 'image/png', 'image/webp']
  multiple?: boolean // default: false

  // UI customization
  placeholder?: string
  className?: string
  disabled?: boolean

  // Upload state
  isUploading?: boolean
  uploadProgress?: number
  error?: string

  // Styling variants
  variant?: 'default' | 'compact' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
}
```

## Implementation Phases

### Phase A: Basic Upload Component (Week 1)

- [ ] Install `react-dropzone` dependency
- [ ] Create basic dropzone with drag & drop
- [ ] Implement file validation with Zod
- [ ] Add file preview functionality
- [ ] Create component variants and styling

### Phase B: Enhanced Features (Week 1-2)

- [ ] Add upload progress visualization
- [ ] Implement error handling and display
- [ ] Add accessibility features (keyboard navigation, screen reader support)
- [ ] Create comprehensive TypeScript interfaces
- [ ] Add loading states and animations

### Phase C: Integration & Testing (Week 2)

- [ ] Export component from UI package
- [ ] Create Storybook stories for component
- [ ] Write unit tests with Jest/Testing Library
- [ ] Integration testing with form components
- [ ] Performance optimization and lazy loading

## File Structure After Implementation

```
packages/ui/src/components/ui/
├── image-upload-dropzone.tsx
├── image-preview.tsx
└── index.ts (export statements)

packages/ui/src/lib/
├── image-utils.ts (file validation, formatting utilities)
└── constants.ts (file size limits, accepted types)

apps/dashboard/components/locations/
└── location-drawer.tsx (will integrate the component)
```

## Testing Strategy

### Unit Tests

- File validation logic
- Drag & drop interactions
- Preview functionality
- Error state handling

### Integration Tests

- Form integration with react-hook-form
- File upload flow end-to-end
- Accessibility compliance

### Visual Tests

- Component variants rendering
- Responsive design
- Loading states animation

## Accessibility Considerations

- Keyboard navigation support
- Screen reader announcements
- ARIA labels for drag zones
- Focus management
- Color contrast compliance

## Performance Considerations

- Lazy loading of preview images
- File size validation before preview generation
- Debounced drag events
- Memory cleanup for FileReader objects
- Progressive enhancement for drag & drop

## Next Steps After Sub-plan 1.1

1. **Sub-plan 1.2**: Create `LocationImageDisplay` component
2. **Phase 2**: Update location data models to support image fields
3. **Integration**: Add component to location drawer
4. **Testing**: End-to-end testing with actual file uploads

## Dependencies Installation Command

```bash
# In packages/ui directory
pnpm add react-dropzone

# Optional for future phases
pnpm add react-image-crop compressorjs
```

## Success Criteria

- [ ] Component renders correctly in all variants
- [ ] Drag & drop functionality works across browsers
- [ ] File validation prevents invalid uploads
- [ ] Preview displays correctly for all supported formats
- [ ] Error states are handled gracefully
- [ ] Component is fully accessible
- [ ] TypeScript interfaces are complete and accurate
- [ ] Integration with react-hook-form works seamlessly


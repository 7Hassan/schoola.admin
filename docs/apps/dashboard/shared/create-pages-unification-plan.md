# Create Pages Unification Plan

## Overview

This plan outlines the strategy to unify the style and behavior of create pages across locations, courses, forms, and groups modules. The goal is to establish a consistent user experience with full-screen layouts, proper navigation, and standardized form handling.

## Current State Analysis

### Issues Identified:

1. **Inconsistent Layouts**: Different create pages use varying container widths and heights
2. **Navigation Inconsistency**: Different back button implementations and positioning
3. **Form Reset Variations**: Some pages lack reset functionality, others implement it differently
4. **Responsive Design**: Inconsistent responsive behavior across pages
5. **Action Button Placement**: Varying footer/action layouts
6. **Content Structure**: Different section organization and styling approaches

### Current Implementations:

#### 1. **Locations Create Page**

- **Layout**: Fixed `max-w-4xl` container with `p-6` padding
- **Navigation**: Simple "Cancel" text link
- **Reset**: No reset functionality
- **Responsive**: Limited responsive grid layouts
- **Actions**: Bottom footer with Cancel, Save Draft, Create buttons

#### 2. **Courses Create Page**

- **Layout**: Full width `w-full` with `p-6` padding
- **Navigation**: Simple "Cancel" text link
- **Reset**: No reset functionality
- **Responsive**: Grid layouts with responsive columns
- **Actions**: Bottom footer with Cancel, Save Draft, Create buttons

#### 3. **Forms Create Page**

- **Layout**: Full height `h-full` flex layout with header
- **Navigation**: No dedicated back navigation
- **Reset**: No visible reset functionality
- **Responsive**: Fixed header with flexible content area
- **Actions**: Header-based actions (Preview, Save, Share)

#### 4. **Groups Create Page**

- **Layout**: Full screen `h-screen` with overflow handling
- **Navigation**: Proper "Back to Management" button with icon
- **Reset**: Dedicated "Reset Form" button in header
- **Responsive**: Full responsive design with proper overflow
- **Actions**: Bottom card with form validation and submit

## Unified Design Requirements

### 1. **Full-Screen Layout**

- Use `h-screen` for complete viewport height
- Implement `overflow-y-auto` for proper scrolling
- Remove fixed width constraints (`max-w-*`)
- Ensure responsive padding and margins

### 2. **Standard Navigation**

- Consistent "Back to [Module] Management" button
- Position in top-left of header
- Use ArrowLeft icon with text
- Proper router navigation to management page

### 3. **Reset Functionality**

- Dedicated "Reset Form" button
- Position in top-right of header area
- Clear all form data to initial state
- Confirmation dialog for unsaved changes

### 4. **Responsive Design**

- Mobile-first approach
- Proper breakpoints for all screen sizes
- Consistent spacing and typography
- Touch-friendly interactive elements

### 5. **Action Button Layout**

- Standardized footer/action area
- Consistent button hierarchy and spacing
- Proper form validation feedback
- Loading states for submissions

## Implementation Strategy

### Phase 1: Create Unified Layout Component

**File**: `/components/shared/create-page-layout.tsx`

**Features**:

- Full-screen container with proper overflow
- Header with back navigation and reset button
- Scrollable content area
- Standardized footer for actions
- Responsive design system
- Loading and error states

**Props**:

```typescript
interface CreatePageLayoutProps {
  title: string
  description: string
  backRoute: string
  onReset: () => void
  isSubmitting?: boolean
  hasUnsavedChanges?: boolean
  children: React.ReactNode
  actions?: React.ReactNode
}
```

### Phase 2: Update Individual Create Pages

#### 2.1 **Locations Create Page**

- **Remove**: Fixed width container (`max-w-4xl`)
- **Add**: Full-screen layout with proper navigation
- **Implement**: Form reset functionality
- **Enhance**: Responsive design improvements
- **Standardize**: Action button layout

#### 2.2 **Courses Create Page**

- **Update**: Use unified layout component
- **Add**: Proper back navigation with router
- **Implement**: Form reset functionality
- **Maintain**: Current responsive grid layouts
- **Standardize**: Action button positioning

#### 2.3 **Forms Create Page**

- **Restructure**: Header to match unified layout
- **Add**: Back navigation to forms management
- **Implement**: Visible reset functionality
- **Maintain**: Full-screen editing experience
- **Update**: Action buttons to footer

#### 2.4 **Groups Create Page**

- **Refactor**: To use unified layout component
- **Maintain**: Current responsive design excellence
- **Keep**: Existing reset and navigation functionality
- **Standardize**: Layout structure only

### Phase 3: Shared Components

#### 3.1 **Create Form Header**

```typescript
interface CreateFormHeaderProps {
  title: string
  description: string
  backRoute: string
  onReset: () => void
  hasUnsavedChanges?: boolean
}
```

#### 3.2 **Create Form Footer**

```typescript
interface CreateFormFooterProps {
  onCancel: () => void
  onSubmit: () => void
  isSubmitting: boolean
  isValid: boolean
  submitText?: string
  cancelText?: string
  showSaveAsDraft?: boolean
}
```

#### 3.3 **Create Form Section**

```typescript
interface CreateFormSectionProps {
  title: string
  icon?: React.ComponentType
  children: React.ReactNode
  collapsible?: boolean
  required?: boolean
}
```

### Phase 4: Responsive Design System

#### 4.1 **Breakpoint Standards**

- **Mobile**: `< 768px` - Single column, stack sections
- **Tablet**: `768px - 1024px` - Two-column grids where appropriate
- **Desktop**: `> 1024px` - Full multi-column layouts
- **Large**: `> 1400px` - Maximum content width constraints

#### 4.2 **Spacing System**

- **Container Padding**: `p-4 md:p-6 lg:p-8`
- **Section Spacing**: `space-y-6`
- **Grid Gaps**: `gap-4 md:gap-6`
- **Card Padding**: `p-4 md:p-6`

#### 4.3 **Typography Scale**

- **Page Title**: `text-2xl md:text-3xl font-bold`
- **Section Titles**: `text-lg md:text-xl font-semibold`
- **Form Labels**: `text-sm font-medium`
- **Helper Text**: `text-xs md:text-sm text-muted-foreground`

### Phase 5: Form State Management

#### 5.1 **Unified Form Hooks**

- **useCreateForm**: Common form state and validation
- **useUnsavedChanges**: Track form modifications
- **useFormReset**: Standardized reset functionality
- **useCreateNavigation**: Handle navigation with confirmations

#### 5.2 **Validation Standards**

- Consistent error message display
- Real-time validation feedback
- Form submission state management
- Success/error result handling

## Technical Implementation Details

### Required UI Components

- **Layout**: Full-screen create page wrapper
- **Header**: Navigation and actions header
- **Footer**: Form submission actions
- **Section**: Collapsible form sections
- **Field Groups**: Responsive field layouts

### Dependencies

- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Next.js Router**: Navigation handling
- **Lucide Icons**: Consistent iconography
- **Tailwind CSS**: Responsive styling

### File Structure

```
/components/shared/
  ├── create-page-layout.tsx
  ├── create-form-header.tsx
  ├── create-form-footer.tsx
  ├── create-form-section.tsx
  └── index.ts

/hooks/
  ├── use-create-form.ts
  ├── use-unsaved-changes.ts
  └── use-form-reset.ts

/lib/
  └── create-form-utils.ts
```

## Success Criteria

### User Experience

- [ ] Consistent full-screen layout across all create pages
- [ ] Intuitive back navigation to management pages
- [ ] Accessible reset functionality with confirmation
- [ ] Responsive design on all screen sizes (mobile to desktop)
- [ ] Smooth scrolling and proper content overflow handling

### Technical Standards

- [ ] TypeScript compliance with strict typing
- [ ] Zero breaking changes to existing functionality
- [ ] Proper error handling and loading states
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Performance metrics maintained or improved

### Development Workflow

- [ ] Reusable components for future create pages
- [ ] Consistent API patterns for form handling
- [ ] Simplified maintenance and updates
- [ ] Clear documentation and examples

## Implementation Timeline

### Week 1: Foundation

- Create unified layout components
- Implement form state management hooks
- Set up responsive design system

### Week 2: Page Updates

- Refactor locations and courses create pages
- Update forms create page structure
- Enhance groups create page standardization

### Week 3: Testing & Polish

- Cross-browser testing on all screen sizes
- Accessibility audit and improvements
- Performance optimization
- Documentation and code review

### Week 4: Deployment & Monitoring

- Production deployment
- User acceptance testing
- Monitor for any regression issues
- Gather feedback for future improvements

---

This plan ensures a consistent, professional, and user-friendly create page experience across all modules while maintaining the existing functionality and improving the overall development workflow.


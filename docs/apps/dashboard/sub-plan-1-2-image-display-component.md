# Sub-plan 1.2: Image Display Component Implementation Plan

## Overview

Create `LocationImageDisplay` component in the UI package for consistent image rendering across location cards with fallback handling, responsive design, and loading states.

## Current Dependencies Analysis

### ✅ Already Available Libraries

- **React**: `^19.0.0` - Core React for component development
- **Next.js Image**: `^15.2.3` - Optimized image loading (via Next.js)
- **Lucide React**: `^0.475.0` - Icons for loading/error states
- **shadcn/ui Components**: Complete set available - Card, Skeleton, Alert, Badge, etc.
- **Class Variance Authority**: `^0.7.1` - Component variants styling
- **Tailwind CSS**: `^4.0.8` - Responsive design and styling
- **TypeScript**: `^5.7.3` - Type safety

### 🎯 shadcn/ui Components to Leverage

- **Card**: Image container with consistent styling and variants
- **Skeleton**: Loading states during image load
- **Alert**: Error messages for failed image loads
- **Badge**: Location type indicators and metadata
- **Aspect Ratio**: Maintain consistent image proportions
- **Button**: Interactive image actions (zoom, edit, etc.)

### 📦 Libraries to Add

#### Primary Dependencies

```json
{
  "next/image": "^15.2.3"
}
```

**Why**: Already available via Next.js - provides optimized image loading, lazy loading, and responsive images.

#### Optional Dependencies (Future Enhancement)

```json
{
  "react-intersection-observer": "^9.13.1",
  "blurhash": "^2.0.5"
}
```

- **react-intersection-observer**: Enhanced lazy loading control
- **blurhash**: Progressive image loading with blur placeholders

## Component Architecture

### 1. Component Structure

```
packages/ui/src/components/ui/
├── location-image-display.tsx    # Main display component (leverages Card, AspectRatio)
├── image-placeholder.tsx         # Fallback placeholder component (leverages Card, Badge)
└── image-skeleton.tsx           # Loading skeleton component (leverages Skeleton, Card)
```

### 2. shadcn/ui Component Integration

- **Card**: Consistent container styling with variants
- **AspectRatio**: Proper image proportions across devices
- **Skeleton**: Smooth loading animations
- **Badge**: Location type and status indicators
- **Alert**: Error state communication
- **Button**: Interactive elements (retry, zoom, edit)

### 2. Core Features Implementation

#### 2.1 Responsive Image Display

- **Implementation**: CSS Grid/Flexbox with Tailwind
- **Features**:
  - Aspect ratio preservation (16:9, 4:3, 1:1)
  - Responsive sizing for different screen breakpoints
  - Object-fit options (cover, contain, fill)

#### 2.2 Fallback Logic

- **Priority Order**:
  1. User uploaded image
  2. Google Maps snapshot (onsite locations)
  3. Default placeholder (themed by location type)
- **Implementation**: Conditional rendering with error boundaries

#### 2.3 Loading States

- **Skeleton**: Animated placeholder during load
- **Progressive**: Blur-to-sharp transition
- **Error**: Graceful fallback with retry option

#### 2.4 Performance Optimization

- **Lazy Loading**: Intersection Observer API
- **Image Optimization**: WebP format preference
- **Caching**: Browser cache headers and CDN integration

## Component API Design

### Props Interface

```typescript
interface LocationImageDisplayProps {
  // Image sources (priority order)
  uploadedImageUrl?: string
  mapSnapshotUrl?: string
  fallbackImageUrl?: string

  // Location context
  locationType: 'onsite' | 'online'
  locationName: string

  // Display configuration
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto'
  objectFit?: 'cover' | 'contain' | 'fill'
  sizes?: string // responsive sizes attribute

  // Styling
  className?: string
  variant?: 'card' | 'hero' | 'thumbnail' | 'gallery'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'

  // Interaction
  onClick?: () => void
  onLoad?: () => void
  onError?: (error: string) => void

  // Loading states
  loading?: 'lazy' | 'eager'
  placeholder?: 'blur' | 'skeleton' | 'none'
  blurDataURL?: string

  // Accessibility
  alt?: string
  title?: string
}
```

## Implementation Phases

### Phase A: Core Display Component (Week 1)

- [ ] Create basic image display with fallback logic
- [ ] Implement responsive aspect ratios
- [ ] Add loading and error states
- [ ] Create component variants (card, thumbnail, etc.)

### Phase B: Performance & Optimization (Week 1-2)

- [ ] Implement lazy loading with Intersection Observer
- [ ] Add progressive loading with blur placeholders
- [ ] Optimize image formats and sizes
- [ ] Add caching strategies

### Phase C: Enhanced Features (Week 2)

- [ ] Create themed placeholders for different location types
- [ ] Add hover effects and interactions
- [ ] Implement image zoom/lightbox functionality
- [ ] Add accessibility features (keyboard navigation, alt text)

## Default Placeholders Design

### Onsite Location Placeholder

```typescript
const OnsitePlaceholder = () => (
  <Card className="flex items-center justify-center bg-blue-50 text-blue-600 p-4">
    <MapPin className="w-8 h-8" />
    <span className="ml-2 text-sm font-medium">Onsite Location</span>
  </Card>
)
```

### Online Location Placeholder

```typescript
const OnlinePlaceholder = () => (
  <Card className="flex items-center justify-center bg-green-50 text-green-600 p-4">
    <Globe className="w-8 h-8" />
    <span className="ml-2 text-sm font-medium">Online Session</span>
  </Card>
)
```

## Component Variants

### Card Variant (Location Cards)

- Aspect ratio: 16:9
- Rounded corners: md
- Object fit: cover
- Loading: lazy

### Thumbnail Variant (Drawer Preview)

- Aspect ratio: 4:3
- Size: small (64x48px)
- Object fit: cover
- Loading: eager

### Hero Variant (Detail View)

- Aspect ratio: auto
- Full width responsive
- Object fit: contain
- Loading: eager

## File Structure After Implementation

```
packages/ui/src/components/ui/
├── location-image-display.tsx
├── image-placeholder.tsx
├── image-skeleton.tsx
└── index.ts (export statements)

packages/ui/src/lib/
├── image-utils.ts (URL validation, format detection)
└── image-constants.ts (aspect ratios, sizes, fallback URLs)

packages/ui/src/assets/
├── placeholders/
│   ├── onsite-placeholder.svg
│   └── online-placeholder.svg
```

## Styling Implementation

### Tailwind Classes for Variants

````typescript
## Styling Implementation

### shadcn/ui Component Composition
```typescript
const LocationImageDisplay = ({ variant, aspectRatio, ...props }) => {
  return (
    <Card className={cn(imageVariants({ variant, aspectRatio }))}>
      <AspectRatio ratio={getAspectRatioValue(aspectRatio)}>
        {/* Image or placeholder content */}
      </AspectRatio>
    </Card>
  )
}
````

### Component Variants with CVA

```typescript
const imageVariants = cva(
  'relative overflow-hidden', // base styles
  {
    variants: {
      variant: {
        card: 'shadow-sm hover:shadow-md transition-shadow',
        thumbnail: 'border border-border',
        hero: 'shadow-lg rounded-xl',
        gallery: 'rounded-sm border-0'
      },
      size: {
        sm: 'w-16 h-12',
        md: 'w-32 h-24',
        lg: 'w-48 h-36',
        full: 'w-full'
      }
    },
    defaultVariants: {
      variant: 'card',
      size: 'full'
    }
  }
)
```

````

## Integration Points

### Location Card Integration

```typescript
// In location-card.tsx
### Location Card Integration
```typescript
// In location-card.tsx
<LocationImageDisplay
  uploadedImageUrl={location.uploadedImageUrl}
  mapSnapshotUrl={location.mapSnapshotUrl}
  locationType={location.type}
  locationName={location.name}
  variant="card"
  aspectRatio="16:9"
  onClick={() => openLocationDrawer(location)}
  className="mb-4"
>
  <Badge variant="secondary" className="absolute top-2 right-2">
    {location.type === 'onsite' ? 'Onsite' : 'Online'}
  </Badge>
</LocationImageDisplay>
````

### Drawer Preview Integration

```typescript
// In location-drawer.tsx
<div className="space-y-4">
  <Label>Location Image</Label>
  <LocationImageDisplay
    uploadedImageUrl={watchedImageUrl}
    locationType={watchedType}
    locationName={watchedName}
    variant="thumbnail"
    aspectRatio="4:3"
    className="border-2 border-dashed border-muted-foreground/25"
  />
  {!watchedImageUrl && (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        No image uploaded. Add an image to enhance your location's visibility.
      </AlertDescription>
    </Alert>
  )}
</div>
```

````

### Drawer Preview Integration

```typescript
// In location-drawer.tsx
<LocationImageDisplay
  uploadedImageUrl={watchedImageUrl}
  locationType={watchedType}
  locationName={watchedName}
  variant="thumbnail"
  aspectRatio="4:3"
  className="mb-4"
/>
````

## Error Handling Strategy

### Image Load Failures

1. **First Attempt**: User uploaded image
2. **Second Attempt**: Map snapshot (if onsite)
3. **Final Fallback**: Themed placeholder
4. **Error Logging**: Track failed image URLs for debugging

### Network Issues

- Show skeleton during network delays
- Retry mechanism for failed loads
- Graceful degradation to placeholders

## Accessibility Implementation

### ARIA Labels

```typescript
const getAriaLabel = (locationType: string, locationName: string) =>
  `Image of ${locationName}, ${locationType} location`
```

### Keyboard Navigation

- Focus indicators for interactive images
- Enter/Space key support for onClick actions
- Screen reader announcements for loading states

## Testing Strategy

### Visual Regression Tests

- Component renders correctly in all variants
- Responsive behavior across breakpoints
- Fallback logic works as expected

### Performance Tests

- Lazy loading triggers at correct viewport intersection
- Image optimization reduces load times
- Memory usage doesn't leak with rapid navigation

### Accessibility Tests

- Screen reader compatibility
- Keyboard navigation support
- Color contrast compliance

## Next Integration Steps

1. **Phase 2**: Update location data models to include image URLs
2. **Phase 3**: Integrate with Google Maps service for snapshots
3. **Phase 4**: Add to location drawer for upload preview
4. **Phase 5**: Replace current card images with new component

## Success Criteria

- [ ] Component displays images with correct aspect ratios
- [ ] Fallback logic works seamlessly
- [ ] Loading states provide good user experience
- [ ] Performance meets Core Web Vitals standards
- [ ] Accessibility requirements are met
- [ ] Component works across all target browsers
- [ ] Integration with location cards is smooth
- [ ] Error handling is robust and user-friendly


# Location Image Implementation Plan

## Overview

Transform location cards to support user-uploaded images and Google Maps snapshots for both onsite and online locations, with specific options for onsite locations to choose between uploaded images and map snapshots.

## Big Plan: `location_image`

### Phase 1: Foundation Components (`phase_1_foundation`) ✅ COMPLETE

**Objective**: Create reusable UI components for image functionality

#### Sub-plan 1.1: Image Upload Component (`image_upload_component`) ✅ COMPLETE

- **Files**:
  - `packages/ui/src/components/ui/image-upload-dropzone.tsx` ✅
  - `packages/ui/src/components/ui/image-preview.tsx` ✅
  - `packages/ui/src/lib/image-utils.ts` ✅
  - `packages/ui/src/lib/image-constants.ts` ✅

#### Sub-plan 1.2: Image Display Component (`image_display_component`) ✅ COMPLETE

- **Files**:
  - `packages/ui/src/components/ui/location-image-display.tsx` ✅
  - `packages/ui/src/components/ui/image-placeholder.tsx` ✅
  - `packages/ui/src/components/ui/image-skeleton.tsx` ✅
  - `packages/ui/src/index.ts` ✅ (updated with exports)

**Features Completed**:

- ✅ Drag & drop image upload with validation
- ✅ File type and size validation
- ✅ Image preview with metadata display
- ✅ Compression and thumbnail generation
- ✅ Progress indicators and error handling
- ✅ Responsive image display with fallback logic
- ✅ Loading states and skeleton components
- ✅ Type-based placeholders (onsite/online)
- ✅ Priority-based image loading (uploaded > map > placeholder)
- ✅ Accessibility features and responsive variants

---

### Phase 2: Data Layer Enhancement (`phase_2_data`) ✅ COMPLETE

**Objective**: Update location data structures and store to support image functionality

#### Sub-plan 2.1: Location Model Updates (`location_model_updates`) ✅ COMPLETE

- **File**: `apps/dashboard/lib/locations-store.ts` ✅
- **Changes**:
  - ✅ Add `uploadedImageUrl?: string` to Location interface
  - ✅ Add `useMapSnapshot?: boolean` to Location interface (onsite only)
  - ✅ Add `imageUploadStatus?: 'idle' | 'uploading' | 'success' | 'error'`
  - ✅ Update LocationFormData interface (in location-drawer.tsx)
  - ✅ Add image upload/delete actions

#### Sub-plan 2.2: Image Upload Service (`image_upload_service`) ✅ COMPLETE

- **File**: `apps/dashboard/lib/image-service.ts` ✅ (new)
- **Features**:
  - ✅ Upload image to storage (simulated, ready for real implementation)
  - ✅ Delete image from storage
  - ✅ Generate optimized URLs
  - ✅ Handle upload progress
  - ✅ Error handling and retry logic

**Features Completed**:

- ✅ Enhanced Location interface with image fields
- ✅ Image upload status tracking
- ✅ Store actions for image management
- ✅ Comprehensive image upload service with validation
- ✅ Progress tracking and error handling
- ✅ Image compression and optimization
- ✅ File validation and metadata extraction

---

### Phase 3: Google Maps Integration (`phase_3_maps`) ✅ COMPLETE

**Objective**: Implement Google Maps Static API for location snapshots

#### Sub-plan 3.1: Maps Service (`maps_service`) ✅ COMPLETE

- **File**: `apps/dashboard/lib/maps-service.ts` ✅ (new)
- **Features**:
  - ✅ Generate Google Maps Static API URLs
  - ✅ Handle API key management
  - ✅ Customize map parameters (zoom, size, markers)
  - ✅ Error handling for API failures
  - ✅ Caching mechanism for generated URLs

#### Sub-plan 3.2: Address Validation (`address_validation`) ✅ COMPLETE

- **Integration**: Enhance existing address handling ✅
- **Features**:
  - ✅ Validate addresses for map compatibility
  - ✅ Geocoding support (address to coordinates)
  - ✅ Address formatting for API calls
  - ✅ Error handling for invalid addresses

**Features Completed**:

- ✅ Google Maps Static API integration
- ✅ Multiple map styles and zoom levels
- ✅ Address validation and geocoding
- ✅ Map URL caching for performance
- ✅ Fallback handling when API unavailable
- ✅ Batch processing for multiple locations

---

### Phase 4: Drawer Integration (`phase_4_drawer`)

**Objective**: Add image upload functionality to location add/edit drawer

#### Sub-plan 4.1: Drawer UI Updates (`drawer_ui_updates`)

- **File**: `apps/dashboard/components/locations/location-drawer.tsx`
- **Changes**:
  - Add image upload section after basic info
  - Add toggle for onsite locations (uploaded vs map snapshot)
  - Add image preview in drawer
  - Add remove image functionality
  - Update form validation

#### Sub-plan 4.2: Form Handling (`form_handling`)

- **Updates**:
  - Extend form schema for image fields
  - Handle image upload during form submission
  - Add loading states during image operations
  - Handle form errors related to images
  - Clean up temporary uploads on cancel

---

### Phase 5: Card Display Updates (`phase_5_cards`)

**Objective**: Update location cards to display uploaded images or map snapshots

#### Sub-plan 5.1: Location Card Redesign (`card_redesign`)

- **File**: `apps/dashboard/components/locations/location-card.tsx`
- **Changes**:
  - Replace stock images with uploaded images
  - Implement map snapshot display for onsite locations
  - Add fallback logic (uploaded > map > default)
  - Update online location display (remove SVG, use uploaded or default)
  - Maintain responsive design

#### Sub-plan 5.2: Image Loading Optimization (`image_optimization`)

- **Features**:
  - Lazy loading for card images
  - Image compression and optimization
  - Progressive loading (blur to sharp)
  - Error boundary for broken images
  - Performance monitoring

---

### Phase 6: Settings & Management (`phase_6_management`)

**Objective**: Add image management features and settings

#### Sub-plan 6.1: Image Management Panel (`image_management`)

- **Optional Feature**: Dedicated image management section
- **Features**:
  - View all uploaded images
  - Bulk delete unused images
  - Image usage tracking
  - Storage usage statistics

#### Sub-plan 6.2: Admin Settings (`admin_settings`)

- **Features**:
  - Configure image upload limits
  - Set Google Maps API preferences
  - Image quality settings
  - Storage cleanup automation

---

## Implementation Sequence

### Sprint 1: Core Components

1. Phase 1: Foundation Components
2. Phase 2: Data Layer Enhancement

### Sprint 2: Maps & Upload

1. Phase 3: Google Maps Integration
2. Phase 4: Drawer Integration

### Sprint 3: Display & Polish

1. Phase 5: Card Display Updates
2. Phase 6: Settings & Management (optional)

---

## Technical Considerations

### Dependencies to Add

- Image upload library (e.g., `react-dropzone`)
- Image optimization library
- Google Maps Static API integration
- File storage service integration

### Environment Variables Needed

- `GOOGLE_MAPS_API_KEY`
- Image storage service credentials
- Upload size limits configuration

### Performance Considerations

- Image compression before upload
- CDN integration for fast delivery
- Lazy loading implementation
- Cache management for map snapshots

### Error Handling

- Network failures during upload
- Invalid image formats
- Google Maps API failures
- Storage quota exceeded

---

## Success Criteria

- [ ] Users can upload custom images for any location type
- [ ] Onsite locations can choose between uploaded image and map snapshot
- [ ] Online locations display uploaded images or appropriate defaults
- [ ] Upload process is intuitive and provides clear feedback
- [ ] Images load efficiently without impacting performance
- [ ] Error states are handled gracefully
- [ ] Admin can manage image settings and usage

---

## Future Enhancements (Post-MVP)

- Image editing capabilities (crop, resize, filters)
- Multiple images per location (gallery)
- AI-generated location images based on description
- Integration with location verification services
- Advanced map customization options


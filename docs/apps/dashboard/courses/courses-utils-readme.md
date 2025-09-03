# Course Component Utilities

This directory contains utility functions and helpers dedicated to the course components. It's organized by concern to maintain clean separation of logic.

## Structure

```
utils/
├── index.ts              # Main export barrel
├── filters/              # Filter-related utilities
│   ├── index.ts          # Filter exports barrel
│   ├── filter-handlers.ts # Filter state management handlers
│   ├── filter-helpers.ts  # Filter calculation and helper functions
│   └── filter-constants.ts # Filter configuration and constants
└── README.md             # This file
```

## Usage

### Basic Import

```typescript
import {
  createFilterHandlers,
  calculateActiveFiltersCount
} from './utils/filters'
```

### All Filter Utilities

```typescript
import {
  createFilterHandlers,
  calculateActiveFiltersCount,
  getCategoryDisplayName,
  isAgeRangeFilterActive,
  resetAgeRange,
  COURSE_LEVELS,
  COURSE_STATUSES,
  MOCK_GROUPS,
  FILTER_CONSTANTS
} from './utils/filters'
```

## Utilities

### Filter Handlers (`filter-handlers.ts`)

Provides state management functions for different filter types:

- `createFilterHandlers()` - Creates all filter handler functions
- Individual handlers for categories, levels, status, age range, groups
- Clear all filters functionality

### Filter Helpers (`filter-helpers.ts`)

Calculation and utility functions:

- `calculateActiveFiltersCount()` - Counts active filters
- `isAgeRangeFilterActive()` - Checks if age range is modified
- `getCategoryDisplayName()` - Gets category display name by ID
- `resetAgeRange()` - Returns default age range values

### Filter Constants (`filter-constants.ts`)

Configuration constants:

- `FILTER_CONSTANTS` - Age range and UI configuration
- `COURSE_LEVELS` - Available course difficulty levels
- `COURSE_STATUSES` - Available course statuses
- `MOCK_GROUPS` - Mock group data (TODO: integrate with groups store)

## Benefits

### Separation of Concerns

- **UI Logic**: Components focus on rendering
- **Business Logic**: Utilities handle state management
- **Configuration**: Constants centralize configuration

### Reusability

- Filter handlers can be reused across components
- Helper functions can be used in other course components
- Constants ensure consistency across the application

### Maintainability

- Single source of truth for filter logic
- Easier to test utility functions in isolation
- Clear organization makes code easier to understand

### Type Safety

- Full TypeScript support with proper interfaces
- Type-safe function signatures
- Compile-time error checking

## Future Extensions

This structure allows for easy extension:

- **Add new filter types**: Extend handlers and constants
- **Add validation**: Create validation utilities
- **Add formatting**: Create display formatting helpers
- **Add persistence**: Create filter persistence utilities

## Integration Notes

### Groups Store Integration

The `MOCK_GROUPS` constant should be replaced with actual groups store integration:

```typescript
// TODO: Replace MOCK_GROUPS with real groups store
import { useGroupsStore } from '@/stores/groups-store'
const { groups } = useGroupsStore()
```

### Store Dependencies

Filter handlers depend on the courses store interface. Any changes to `CourseFilters` interface should be reflected in the utility types.


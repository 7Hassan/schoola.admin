# 📜 TypeScript Code Quality Guidelines (2025 Edition)

## 1. **General Rules**

- Always use **TypeScript**, never plain JavaScript.
- Ensure **strict type safety** — no use of `any` unless explicitly required and documented.
- Keep the code **modular** and **readable**.
- Enable all strict compiler options in `tsconfig.json`.
- Use **readonly** modifiers for immutable data structures.
- Prefer **const assertions** and **satisfies** operator for better type inference.

---

## 2. **Type Definitions**

### **When to Use Interfaces vs Types**

- Use **interfaces** for object shapes that might be extended or implemented.
- Use **type aliases** for unions, intersections, and computed types.
- Use **const assertions** for better type inference.
- Use **readonly** for immutable data structures.

```ts
// ✅ Interfaces for extensible object shapes
interface User {
  readonly id: string
  readonly name: string
  readonly email: string
}

interface AdminUser extends User {
  readonly permissions: readonly string[]
}

// ✅ Types for unions and computed types
type Status = 'pending' | 'approved' | 'rejected'
type UserWithStatus = User & { readonly status: Status }

// ✅ Const assertions for literal types
const STATUSES = ['pending', 'approved', 'rejected'] as const
type StatusType = (typeof STATUSES)[number]

// ✅ Readonly arrays and tuples
const DEFAULT_RANGE = [5, 18] as const
type AgeRange = typeof DEFAULT_RANGE

// ✅ Generic constraints with readonly
interface ApiResponse<T> {
  readonly data: T
  readonly status: number
  readonly message: string
}

// ✅ Satisfies operator for type safety without widening
const CONFIG = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
} as const satisfies Record<string, string | number>
```

### **Advanced Type Patterns**

- Use **branded types** for domain-specific values.
- Use **template literal types** for dynamic string patterns.
- Use **readonly modifiers** extensively for immutable data.

```ts
// ✅ Branded types
type UserId = string & { readonly brand: unique symbol }
type Email = string & { readonly brand: unique symbol }

// ✅ Template literal types
type EventName<T extends string> = `on${Capitalize<T>}`

// ✅ Readonly configurations
const FILTER_CONFIG = {
  MIN_AGE: 5,
  MAX_AGE: 18,
  DEFAULT_RANGE: [5, 18] as const
} as const satisfies Record<string, number | readonly number[]>

// ✅ Readonly function parameters
function processItems(items: ReadonlyArray<Item>): readonly Item[] {
  return items.filter((item) => item.isValid)
}
```

---

## 3. **Imports & Exports**

- Prefer **named exports** for components and utilities.
- Use **default exports** sparingly (only for main module exports).
- Group imports logically with spacing:
  1. External packages
  2. Internal modules
  3. Types and interfaces
  4. Relative imports

```ts
// External packages
import { useState, useEffect } from 'react'
import { z } from 'zod'

// Internal modules
import { apiClient } from '@/lib/api'
import { logger } from '@/utils/logger'

// Types
import type { User, ApiResponse } from '@/types'

// Relative imports
import { UserCard } from './UserCard'
```

- Configure **path mapping** in `tsconfig.json` for cleaner imports.
- Remove unused imports immediately.

---

## 4. **React Component Rules**

### **Component Definition**

- **Avoid** `React.FC<Props>` — it's no longer recommended.
- Use **function declarations** or **const assertions** with proper typing.
- Always define **props with an interface**.

```ts
// ✅ Preferred: Function declaration
interface ButtonProps {
  label: string
  variant?: 'primary' | 'secondary'
  onClick: () => void
  disabled?: boolean
}

export function Button({ label, variant = 'primary', onClick, disabled }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

// ✅ Alternative: Arrow function with explicit typing
export const Button = ({ label, variant = 'primary', onClick, disabled }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>
}
```

### **Props Patterns**

```ts
// ✅ Optional props with defaults
interface CardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

// ✅ Discriminated unions for variant props
interface BaseButtonProps {
  label: string
  disabled?: boolean
}

interface PrimaryButtonProps extends BaseButtonProps {
  variant: 'primary'
  onClick: () => void
}

interface LinkButtonProps extends BaseButtonProps {
  variant: 'link'
  href: string
}

type ButtonProps = PrimaryButtonProps | LinkButtonProps
```

---

## 5. **Error Handling**

### **Null Safety**

- Always handle possible `null` or `undefined` values.
- Use **optional chaining** (`?.`) and **nullish coalescing** (`??`).
- Use **type guards** for runtime validation.

```ts
// ✅ Safe property access
const userName = user?.profile?.name ?? 'Anonymous'

// ✅ Type guards
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  )
}
```

### **Result Types**

- Use **Result types** for better error handling instead of throwing exceptions.

```ts
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

// Custom error types
class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

class NetworkError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'NetworkError'
  }
}
```

---

## 6. **Data Fetching**

- All API calls must have **typed request parameters** and **typed responses**.
- Use **schema validation** with libraries like Zod or Yup.
- Implement proper **loading states** and **error boundaries**.

```ts
// ✅ Schema validation with Zod
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime()
})

type User = z.infer<typeof UserSchema>

// ✅ Typed API functions
interface FetchUsersParams {
  page?: number
  limit?: number
  search?: string
}

async function fetchUsers(
  params: FetchUsersParams = {}
): Promise<Result<User[], NetworkError>> {
  try {
    const searchParams = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 10),
      ...(params.search && { search: params.search })
    })

    const response = await fetch(`/api/users?${searchParams}`)

    if (!response.ok) {
      return {
        success: false,
        error: new NetworkError(
          response.status,
          `Failed to fetch users: ${response.statusText}`
        )
      }
    }

    const rawData = await response.json()
    const users = z.array(UserSchema).parse(rawData)

    return { success: true, data: users }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? new NetworkError(500, error.message)
          : new NetworkError(500, 'Unknown error')
    }
  }
}
```

---

## 7. **State Management**

### **Local State**

```ts
// ✅ Proper state typing
const [user, setUser] = useState<User | null>(null)
const [loading, setLoading] = useState(false)
const [errors, setErrors] = useState<Record<string, string>>({})

// ✅ State reducers
interface UserState {
  data: User | null
  loading: boolean
  error: string | null
}

type UserAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: User }
  | { type: 'FETCH_ERROR'; payload: string }

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { data: action.payload, loading: false, error: null }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}
```

### **Global State (Redux Toolkit)**

```ts
// ✅ Typed Zustand store
interface UsersState {
  entities: Record<string, User>
  ids: string[]
  loading: boolean
}

interface UsersActions {
  addUser: (user: User) => void
  removeUser: (userId: string) => void
  setUsers: (users: User[]) => void
  setLoading: (loading: boolean) => void
  fetchUsers: () => Promise<void>
  reset: () => void
}

type UsersStore = UsersState & UsersActions

// ✅ Create store with proper typing
const useUsersStore = create<UsersStore>((set, get) => ({
  // Initial state
  entities: {},
  ids: [],
  loading: false,

  // Actions
  addUser: (user) =>
    set((state) => ({
      entities: { ...state.entities, [user.id]: user },
      ids: state.ids.includes(user.id) ? state.ids : [...state.ids, user.id],
    })),

  removeUser: (userId) =>
    set((state) => ({
      entities: Object.fromEntries(
        Object.entries(state.entities).filter(([id]) => id !== userId)
      ),
      ids: state.ids.filter((id) => id !== userId),
    })),

  setUsers: (users) =>
    set({
      entities: Object.fromEntries(users.map((user) => [user.id, user])),
      ids: users.map((user) => user.id),
    }),

  setLoading: (loading) => set({ loading }),

  fetchUsers: async () => {
    set({ loading: true })
    try {
      const result = await fetchUsers()
      if (result.success) {
        get().setUsers(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      set({ loading: false })
    }
  },

  reset: () =>
    set({
      entities: {},
      ids: [],
      loading: false,
    }),
}))

// ✅ Typed selectors for better performance
export const useUsers = () => useUsersStore((state) =>
  state.ids.map((id) => state.entities[id])
)

export const useUser = (userId: string) => useUsersStore((state) =>
  state.entities[userId]
)

export const useUsersLoading = () => useUsersStore((state) => state.loading)

// ✅ Action selectors
export const useUsersActions = () => useUsersStore((state) => ({
  addUser: state.addUser,
  removeUser: state.removeUser,
  setUsers: state.setUsers,
  fetchUsers: state.fetchUsers,
  reset: state.reset,
}))

// ✅ Usage in components
function UsersList() {
  const users = useUsers()
  const loading = useUsersLoading()
  const { fetchUsers } = useUsersActions()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

// ✅ Alternative: Store with immer for complex updates
import { immer } from 'zustand/middleware/immer'

const useUsersStoreWithImmer = create<UsersStore>()(
  immer((set, get) => ({
    entities: {},
    ids: [],
    loading: false,

    addUser: (user) =>
      set((state) => {
        state.entities[user.id] = user
        if (!state.ids.includes(user.id)) {
          state.ids.push(user.id)
        }
      }),

    removeUser: (userId) =>
      set((state) => {
        delete state.entities[userId]
        const index = state.ids.indexOf(userId)
        if (index > -1) {
          state.ids.splice(index, 1)
        }
      }),

    // ... other actions
  }))
)

// ✅ Persist store with proper typing
import { persist, createJSONStorage } from 'zustand/middleware'

interface PersistedUsersState {
  entities: Record<string, User>
  ids: string[]
}

const usePersistedUsersStore = create<UsersStore>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'users-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedUsersState => ({
        entities: state.entities,
        ids: state.ids,
      }),
    }
  )
)

// ✅ DevTools integration
import { devtools } from 'zustand/middleware'

const useUsersStoreWithDevtools = create<UsersStore>()(
  devtools(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'users-store',
    }
  )
)
```

---

## 8. **Utility Functions**

- Place reusable logic in `/utils` with clear naming.
- Always type utility function parameters and return types.
- Use **function overloads** for complex utility functions.

```ts
// ✅ Simple utility
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

// ✅ Function overloads
export function parseDate(date: string): Date
export function parseDate(date: Date): Date
export function parseDate(date: number): Date
export function parseDate(date: string | Date | number): Date {
  return new Date(date)
}

// ✅ Generic utilities
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}
```

---

## 9. **Performance**

### **React Optimization**

- Use `React.memo` for component memoization, not `useMemo` for components.
- Only use `useMemo` and `useCallback` when you have **proven performance issues**.
- Consider **React 18+ features** like `useTransition` for heavy computations.

```ts
// ✅ Component memoization
interface UserCardProps {
  user: User
  onEdit: (id: string) => void
}

export const UserCard = React.memo<UserCardProps>(({ user, onEdit }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  )
})

// ✅ Expensive computation memoization
function ExpensiveComponent({ data }: { data: ComplexData[] }) {
  const processedData = useMemo(() => {
    return data.map(item => expensiveProcessing(item))
  }, [data])

  return <div>{/* render processed data */}</div>
}

// ✅ Using useTransition for non-urgent updates
function SearchComponent() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
    startTransition(() => {
      // Non-urgent update
      setResults(performSearch(newQuery))
    })
  }

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <div>Searching...</div>}
      <SearchResults results={results} />
    </div>
  )
}
```

### **Bundle Optimization**

```ts
// ✅ Lazy loading components
const LazyUserProfile = lazy(() => import('./UserProfile'))

// ✅ Dynamic imports for large utilities
const loadChartLibrary = () => import('heavy-chart-library')
```

---

## 10. **Code Style & Linting**

### **Naming Conventions**

- **Components** → `PascalCase`
- **Variables & functions** → `camelCase`
- **Constants** → `SCREAMING_SNAKE_CASE`
- **Types & interfaces** → `PascalCase`
- **Enum values** → `PascalCase`

```ts
// ✅ Good naming
const API_BASE_URL = 'https://api.example.com'
const userName = 'john_doe'

interface UserPreferences {
  theme: Theme
  language: string
}

enum UserRole {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer'
}
```

## 11. **Testing**

### **Type-Safe Testing**

```ts
// ✅ Type your test data
const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date().toISOString()
}

// ✅ Type your mocks
const mockApiClient = {
  getUser: vi.fn<[string], Promise<User>>(),
  updateUser: vi.fn<[string, Partial<User>], Promise<User>>()
} satisfies Partial<ApiClient>

// ✅ Assertion functions for runtime checks
function assertIsUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new Error('Expected User object')
  }
}

// ✅ Testing async functions with proper types
test('should fetch user successfully', async () => {
  const result = await fetchUser('user-1')

  if (!result.success) {
    throw new Error('Expected successful result')
  }

  expect(result.data).toMatchObject({
    id: 'user-1',
    name: expect.any(String),
    email: expect.any(String)
  })
})
```

---

## 12. **File Structure**

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI primitives
│   └── features/        # Feature-specific components
├── app/               # Next.js pages or route components
├── hooks/               # Custom React hooks
├── utils/               # Pure utility functions
├── lib/                 # Third-party library configurations
├── types/               # Shared type definitions
│   ├── api.ts          # API-related types
│   ├── user.ts         # User-related types
│   └── index.ts        # Type re-exports
├── statics/           # Application constants
```

---

## 14. **Documentation**

### **TSDoc Comments**

````ts
/**
 * Calculates the total price including tax and discounts.
 *
 * @param basePrice - The original price before any modifications
 * @param taxRate - Tax percentage as a decimal (e.g., 0.08 for 8%)
 * @param discountCode - Optional discount code to apply
 * @returns The final calculated price
 *
 * @example
 * ```ts
 * const total = calculatePrice(100, 0.08, 'SAVE10')
 * console.log(total) // 97.2
 * ```
 */
export function calculatePrice(
  basePrice: number,
  taxRate: number,
  discountCode?: string
): number {
  // Implementation...
}
````

---

## 15. **Constants and Static Data Organization**

### **Directory Structure for Constants**

- Place all constants in `/statics` directory with clear hierarchical structure
- Use feature-based organization with subdirectories
- Separate configuration constants from mock/test data

```
statics/
├── index.ts                    # Main exports barrel
├── courses/                    # Course-related constants
│   ├── index.ts               # Course exports barrel
│   └── filters/               # Filter-specific constants
│       ├── index.ts          # Filter exports barrel
│       ├── constants.ts      # Configuration constants
│       └── mock-data.ts      # Mock/test data
└── dashboard/                 # Dashboard-related constants
    ├── actions.ts            # Quick actions configuration
    └── navigation.ts         # Navigation constants
```

### **Constants File Structure**

```ts
// ✅ Well-structured constants with types
export const AGE_RANGE_CONFIG = {
  /** Minimum age for course eligibility */
  MIN_AGE: 5,
  /** Maximum age for course eligibility */
  MAX_AGE: 18,
  /** Default age range when no filter is applied */
  DEFAULT_RANGE: [5, 18] as const,
  /** Step increment for age range slider */
  STEP: 1
} as const satisfies Record<string, number | readonly number[]>

// ✅ Readonly arrays for enums
export const COURSE_LEVELS: readonly CourseLevel[] = [
  'Beginner',
  'Intermediate',
  'Advanced'
] as const

// ✅ Configuration objects with proper typing
export const COURSE_LEVEL_CONFIG = {
  Beginner: {
    label: 'Beginner',
    description: 'Suitable for students with no prior experience',
    color: '#10B981',
    order: 1
  }
  // ... other levels
} as const satisfies Record<
  CourseLevel,
  {
    label: string
    description: string
    color: string
    order: number
  }
>

// ✅ Derived types from constants
export type AgeLimitType =
  | typeof AGE_RANGE_CONFIG.MIN_AGE
  | typeof AGE_RANGE_CONFIG.MAX_AGE
export type DefaultAgeRange = typeof AGE_RANGE_CONFIG.DEFAULT_RANGE
```

### **Mock Data Organization**

```ts
// ✅ Separate mock data with clear TODOs
/**
 * Mock group data for course filtering
 * In production, this should come from the groups store
 *
 * @TODO Integrate with actual groups store: `import { useGroupsStore } from '@/stores/groups-store'`
 */
export const MOCK_GROUPS = [
  {
    id: 'group-1',
    name: 'Math Group A',
    description: 'Elementary mathematics group',
    level: 'beginner' as const
  }
  // ... other groups
] as const

// ✅ Helper functions for mock data
export const getMockGroupById = (id: string): MockGroup | undefined => {
  return MOCK_GROUPS.find((group) => group.id === id)
}
```

### **Re-exports for Backward Compatibility**

```ts
// ✅ Maintain backward compatibility when moving constants
/**
 * Re-export of course filter constants from statics
 * @deprecated Consider importing directly from '@/statics/courses/filters' in new code
 */
export { AGE_RANGE_CONFIG as FILTER_CONSTANTS } from '@/statics/courses/filters/constants'
```

---

## 16. **Utility Functions Best Practices**

### **Pure Functions with Proper Documentation**

````ts
/**
 * Calculates the number of active filters based on current filter state
 *
 * @param filters - Current filter state from the store
 * @returns Number of active filters (non-default values)
 *
 * @example
 * ```ts
 * const activeCount = calculateActiveFiltersCount({
 *   categories: ['1', '2'],
 *   levels: ['Beginner'],
 *   status: [],
 *   relatedGroups: [],
 *   dateRange: [null, null],
 *   ageRange: [5, 18]
 * })
 * console.log(activeCount) // 2
 * ```
 */
export function calculateActiveFiltersCount(filters: CourseFilters): number {
  const activeFilters = [
    filters.categories.length > 0,
    filters.levels.length > 0,
    filters.status.length > 0,
    filters.relatedGroups.length > 0,
    filters.dateRange[0] !== null || filters.dateRange[1] !== null,
    isAgeRangeFilterActive(filters)
  ].filter(Boolean)

  return activeFilters.length
}
````

### **Factory Pattern for Handler Functions**

```ts
/**
 * Configuration interface for handler dependencies
 */
export interface FilterHandlerDependencies {
  readonly filters: CourseFilters
  readonly updateFilters: (filters: Partial<CourseFilters>) => void
}

/**
 * Interface defining all available handler functions
 */
export interface FilterHandlers {
  readonly handleCategoryChange: (categoryId: string, checked: boolean) => void
  readonly handleLevelChange: (level: CourseLevel, checked: boolean) => void
  // ... other handlers
}

/**
 * Creates filter handler functions with provided dependencies
 */
export function createFilterHandlers({
  filters,
  updateFilters
}: FilterHandlerDependencies): FilterHandlers {
  const handleCategoryChange = (categoryId: string, checked: boolean): void => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId)
    updateFilters({ categories: newCategories })
  }

  // ... other handlers

  return {
    handleCategoryChange
    // ... other handlers
  } as const
}
```

---

## 17. **Import/Export Best Practices**

### **Structured Imports with Proper Grouping**

```ts
// ✅ External packages
import React from 'react'
import { Button } from '@workspace/ui/components/ui/button'

// ✅ Internal stores and hooks
import { useCoursesStore } from '@/stores/courses-store'

// ✅ Internal utilities
import {
  createFilterHandlers,
  calculateActiveFiltersCount
} from './utils/filters'

// ✅ Static data and constants
import {
  COURSE_LEVELS,
  COURSE_STATUSES,
  AGE_RANGE_CONFIG
} from '@/statics/courses/filters'
```

### **Barrel Exports with Clear Organization**

```ts
// ✅ Feature barrel export (utils/filters/index.ts)
/**
 * Course filter utilities
 * Centralizes all filter-related logic for course components
 */
export * from './filter-handlers'
export * from './filter-helpers'
export * from './filter-constants'

// ✅ Static data barrel export (statics/courses/index.ts)
/**
 * Course-related static data and constants
 */
export * from './filters'
```

---

## 18. **Migration & Legacy Code**

### **Gradual TypeScript Adoption**

```ts
// ✅ Use unknown instead of any when migrating
function legacyFunction(data: unknown) {
  // Validate before use
  if (isValidData(data)) {
    // Now data is properly typed
    return processData(data)
  }
}

// ✅ Create adapter types for gradual migration
interface LegacyUser {
  id: string
  name: string
  // ... other legacy fields
}

type ModernUser = Omit<LegacyUser, 'name'> & {
  firstName: string
  lastName: string
}

function adaptLegacyUser(legacy: LegacyUser): ModernUser {
  const [firstName, lastName] = legacy.name.split(' ')
  return {
    ...legacy,
    firstName,
    lastName
  }
}
```

---

## ✅ **Key Principles**

1. **Type Safety First**: Leverage TypeScript's type system to catch errors at compile time.
2. **Immutability**: Use `readonly` modifiers and `const assertions` for immutable data.
3. **Clear Organization**: Structure constants in `/statics` with feature-based hierarchy.
4. **Proper Documentation**: Use TSDoc comments with examples for all public functions.
5. **Backward Compatibility**: Maintain compatibility when reorganizing code structure.
6. **Performance Awareness**: Don't over-optimize, but understand when and how to optimize.
7. **Maintainability**: Write code that's easy to understand and modify.
8. **Consistency**: Follow established patterns throughout the codebase.
9. **Progressive Enhancement**: Start with basic types and add complexity as needed.

**Remember**: The goal is to maintain a **uniform, clean, and type-safe codebase** where every new feature follows the same architecture and standards without introducing inconsistencies. These guidelines should evolve with your team's needs and TypeScript ecosystem updates.

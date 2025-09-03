# apps/dashboard – Next.js 15 Dashboard

# File Tree: schoola

Root path: `/home/zinger/App/schoola`

```
schoola
│
├── 📁 apps/
│   ├── 📁 dashboard/
│   │   ├── 📁 .next/ 🚫 (auto-hidden)
│   │   ├── 📁 app/
│   │   │   ├── 📁 (dashboard)/
│   │   │   │   ├── 📁 courses/
│   │   │   │   │   ├── 📁 create/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 management/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 dashboard/
│   │   │   │   │   ├── 📁 activity/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 analytics/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 home/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 forms/
│   │   │   │   │   ├── 📁 create/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 management/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 responses/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 templates/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 groups/
│   │   │   │   │   ├── 📁 create/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 management/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 locations/
│   │   │   │   │   ├── 📁 create/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 management/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 settings/
│   │   │   │   │   ├── 📁 preferences/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 profile/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 users/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 students/
│   │   │   │   │   ├── 📁 attendance/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 enrollment/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 management/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 profile/
│   │   │   │   │   │   └── 📁 [id]/
│   │   │   │   │   │       └── 📄 page.tsx
│   │   │   │   │   ├── 📁 progress/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 records/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 teachers/
│   │   │   │   │   ├── 📁 assignments/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 create/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📁 management/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 layout.tsx
│   │   │   ├── 🖼️ favicon.ico
│   │   │   ├── 📄 layout.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 components/
│   │   │   ├── 📁 forms/
│   │   │   │   ├── 📄 field-editor.tsx
│   │   │   │   ├── 📄 form-builder-tab.tsx
│   │   │   │   ├── 📄 form-builder.tsx
│   │   │   │   ├── 📄 form-header.tsx
│   │   │   │   ├── 📄 form-preview.tsx
│   │   │   │   ├── 📄 question-editor.tsx
│   │   │   │   ├── 📄 question-types-panel.tsx
│   │   │   │   ├── 📄 schema-editor.tsx
│   │   │   │   ├── 📄 sidebar.tsx
│   │   │   │   └── 📄 sortable-field-item.tsx
│   │   │   ├── 📁 groups/
│   │   │   │   ├── 📄 group-card.tsx
│   │   │   │   ├── 📄 group-drawer-simple.tsx
│   │   │   │   ├── 📄 group-drawer.tsx
│   │   │   │   ├── 📄 groups-dashboard.tsx
│   │   │   │   ├── 📄 groups-export-modal.tsx
│   │   │   │   ├── 📄 groups-filters.tsx
│   │   │   │   ├── 📄 groups-grid.tsx
│   │   │   │   ├── 📄 groups-pagination.tsx
│   │   │   │   ├── 📄 session-manager.tsx
│   │   │   │   ├── 📄 subscription-management-modal.tsx
│   │   │   │   ├── 📄 teacher-assignment-manager.tsx
│   │   │   │   └── 📄 teacher-management-modal.tsx
│   │   │   ├── 📁 locations/
│   │   │   │   ├── 📄 delete-confirmation-modal.tsx
│   │   │   │   ├── 📄 location-card.tsx
│   │   │   │   ├── 📄 location-drawer.tsx
│   │   │   │   ├── 📄 location-filters.tsx
│   │   │   │   ├── 📄 location-grid.tsx
│   │   │   │   ├── 📄 locations-dashboard.tsx
│   │   │   │   └── 📄 map-preview-modal.tsx
│   │   │   ├── 📁 shared/
│   │   │   │   ├── 📄 delete-confirmation-modal.tsx
│   │   │   │   └── 📄 export-modal.tsx
│   │   │   ├── 📁 sidebar/
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 sidebar-main-item.tsx
│   │   │   │   ├── 📄 sidebar-sub-items.tsx
│   │   │   │   └── 📄 sidebar.tsx
│   │   │   ├── 📁 students/
│   │   │   │   ├── 📄 student-card.tsx
│   │   │   │   ├── 📄 student-drawer.tsx
│   │   │   │   ├── 📄 students-dashboard.tsx
│   │   │   │   ├── 📄 students-filters.tsx
│   │   │   │   └── 📄 students-grid.tsx
│   │   │   ├── 📁 ui/
│   │   │   │   ├── 📄 color-label.tsx
│   │   │   │   └── 📄 phone-input.tsx
│   │   │   ├── 📄 providers.tsx
│   │   │   ├── 📄 sidebar-wrapper.tsx
│   │   │   └── 📄 theme-toggle.tsx
│   │   ├── 📁 config/
│   │   │   └── 📄 navigation.ts
│   │   ├── 📁 hooks/
│   │   │   ├── 📄 use-export.ts
│   │   │   ├── 📄 use-form-builder-new.ts
│   │   │   ├── 📄 use-form-builder.ts
│   │   │   ├── 📄 use-form-preview.ts
│   │   │   ├── 📄 use-sidebar-store.ts
│   │   │   └── 📄 use-toast.ts
│   │   ├── 📁 lib/
│   │   │   ├── date-utils.ts
│   │   │   ├── export-utils.ts
│   │   │   ├── form-builder-types.ts
│   │   │   ├── form-serialization.ts
│   │   │   ├── groups-export-utils.ts
│   │   │   ├── groups-store.ts
│   │   │   ├── image-service.ts
│   │   │   ├── locations-store.ts
│   │   │   ├── maps-service.ts
│   │   │   ├── phone-utils.ts
│   │   │   ├── store.ts
│   │   │   ├── students-store.ts
│   │   │   └── utils.ts
│   │   ├── 📁 node_modules/ 🚫 (ignored)
│   │   ├── 📁 statics/
│   │   │   └── 📄 dashboardQuickActions.ts
│   │   ├── 📁 tests/
│   │   │   └── 📄 export-system.test.ts
│   │   ├── 📁 types/
│   │   │   └── 📄 sidebar-navigation.ts
│   │   ├── 📄 components.json
│   │   ├── 📄 eslint.config.js
│   │   ├── 📄 form-builder-index.ts
│   │   ├── 📄 next-env.d.ts
│   │   ├── 📄 next.config.mjs
│   │   ├── 📄 package.json
│   │   ├── 📄 postcss.config.mjs
│   │   └── 📄 tsconfig.json

```

---

## Core Structure

- `app/` → Route-based folder (App Router).
  - `(dashboard)/` → Grouped routes for dashboard features.
- `components/` → Reusable UI for dashboard.
- `hooks/` → Custom React hooks.
- `config/navigation.ts` → Sidebar menu config.
- `statics/` → Hardcoded quick actions data.
- `tests/` → Jest/Playwright tests.
- `types/` → Shared TS types.

## Development Tips

- Use the App Router `app/` folder for all new pages.
- Keep `components/` UI pure, move logic into hooks `hooks/`.
- Route grouping via `(dashboard)` keeps paths clean but still organized.
- Try to keep everything in modules, and groups to keep the code organized, clean, and scalable.


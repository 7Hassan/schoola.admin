# 📜 UI Development Guidelines for Copilot

**Project Stack:** Next.js 15 + Tailwind CSS v4  
**Purpose:** Maintain a **uniform, consistent UI** across all pages and components.  
**IMPORTANT:** Never change UI style or behavior unless explicitly instructed.

---

## 1️⃣ General Rules

- Always use **prebuilt UI components** from the project's component library.
- **DO NOT** create new UI elements or utility classes unless confirmed they do not already exist.
- Follow the **global CSS variables, theme colors, typography, and spacing** defined in the global styles.
- Maintain **consistent structure** across all pages (layout, headers, footers, spacing).
- Avoid inline styles unless absolutely necessary.
- Always use **modular, reusable components** for repeating UI patterns.

---

## 2️⃣ Layout & Navigation

- All pages must use the **main layout** with the existing header, sidebar, and footer (unless stated otherwise).
- Subpages (e.g., `/students/management`) must inherit the **same structure** and spacing as other overview pages.
- Keep **section headers, padding, and grid layouts** consistent.

---

## 3️⃣ Responsiveness

- Follow **mobile-first** design principles.
- Respect existing **breakpoint utilities** (`sm`, `md`, `lg`, `xl`) from Tailwind v4.
- Avoid hard-coded widths or heights unless required for the design.
- Test components visually at **all breakpoints**.

---

## 4️⃣ Data Fetching & Loading States

- All async content must have:
  - **Loading State:** Use the project’s skeleton loader or spinner component.
  - **Error State:** Use the project’s predefined error display component.
  - **Empty State:** Use existing placeholder or empty-state UI.
- Avoid introducing new loading or error styles without approval.

---

## 5️⃣ Accessibility (a11y)

- Always use **semantic HTML** (e.g., `<button>` instead of clickable `<div>`).
- Include **ARIA labels** where applicable.
- Ensure all interactive elements are **keyboard accessible**.
- Use **accessible contrast** levels from the existing color palette.

---

## 6️⃣ Component & Utility Usage

- Search for existing components/utilities **before creating new ones**.
- Place new components inside the appropriate folder:
  - `components/ui/` for shared UI elements.
  - `components/forms/` for form elements.
- Name components clearly and consistently.
- Avoid duplicating logic; use **shared hooks and utils** where possible.

---

## 7️⃣ Style & Behavior Consistency

- **DO NOT**:
  - Introduce new colors, shadows, or typography styles.
  - Change spacing, padding, or margins unless stated.
  - Modify interaction patterns (hover, focus, active states) without approval.
- **DO**:
  - Match the **visual language** of existing pages.
  - Keep animations and transitions consistent with the rest of the app.

---

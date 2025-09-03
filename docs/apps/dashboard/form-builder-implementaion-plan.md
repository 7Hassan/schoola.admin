## 1. **Context**

This is a dashboard application built with **Next.js 15** and **TailwindCSS 4**.
There is an **existing UI component package** (importable) with form-related primitives (inputs, selects, modals, buttons, etc.).

A **basic Form Builder UI** exists visually, but it has **no state management, validation, persistence, or business logic**.

**Goal:** Turn the current UI into a fully working Form Builder tab where users can:

- Add / remove / reorder fields.
- Configure field properties (label, type, required, validation rules).
- Preview the form.
- Save/load form definitions as JSON schema.
- Fill out the preview and validate input.

---

## 2. **Goals & Requirements**

**Goals**

1. Introduce **state management** for form schema and form instance.
2. Allow **dynamic field configuration** (type, label, required, options).
3. Support **live preview** of the built form.
4. **Validate** form input based on configuration.
5. **Persist & load** form definitions as JSON.
6. Keep **UI styling** with TailwindCSS and existing UI components.

**Constraints**

- Use the existing **UI package** (do not recreate basic form controls).
- Use idiomatic React for **Next.js 15** (server/client boundaries respected).
- Form schema should be **serializable to JSON**.
- Validation should be **declarative** (recommend **Zod** or similar).
- Use a **lightweight state management** solution (e.g., `useReducer` or Zustand).

---

## 3. **Architecture / Plan**

1. **Data structures** – define the form schema type, field types, and validation rules.
2. **State management** – implement form schema editor state & form instance state.
3. **Field editing UI** – add/remove/reorder/configure fields.
4. **Live preview** – render form from schema.
5. **Validation logic** – based on field configuration.
6. **Save/load** – export/import schema as JSON.
7. **Example usage** – provide a sample schema & filled form.
8. **Reusable hooks/utilities** – `useFormBuilder`, `useFormPreview`, validation helpers, persistence helpers.

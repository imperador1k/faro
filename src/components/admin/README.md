# Faro — Admin Components (`src/components/admin/`)

> 9 form components for the admin panel CRUD operations.

| Component                  | Used By                       | Purpose                       |
| -------------------------- | ----------------------------- | ----------------------------- |
| `course-form.tsx`          | `/admin/courses/new`, `/[id]` | Create/edit course            |
| `lesson-form.tsx`          | `/admin/lessons/new`, `/[id]` | Create/edit lesson            |
| `unit-form.tsx`            | `/admin/units/new`, `/[id]`   | Create/edit unit              |
| `delete-course-button.tsx` | `/admin/courses`              | Delete with confirmation      |
| `delete-lesson-button.tsx` | `/admin/lessons`              | Delete with confirmation      |
| `delete-unit-button.tsx`   | `/admin/units`                | Delete with confirmation      |
| `delete-user-button.tsx`   | `/admin/users`                | Delete user with confirmation |
| `ai-generator-form.tsx`    | `/admin/`                     | Batch AI content generation   |
| `admin-sidebar.tsx`        | `/admin/*`                    | Admin navigation sidebar      |

## Patterns

- Every form uses **Zod validation** via `admin-validators.ts`
- Forms call **Server Actions** directly (no client-side API calls)
- Delete actions require explicit checkbox confirmation
- All mutations revalidate the admin page cache via `revalidatePath()`

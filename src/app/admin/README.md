# Faro — Admin Panel (`src/app/admin/`)

> Internal admin interface for content management and user moderation.

## Route Structure

```
admin/
├── page.tsx              # Admin dashboard (stats overview)
├── layout.tsx            # Admin layout (sidebar, auth guard)
│
├── courses/              # Course management
│   ├── page.tsx          # List all courses
│   ├── new/page.tsx      # Create course form
│   └── [courseId]/       # Edit/view course
│
├── units/                # Unit management
│   ├── page.tsx          # List all units
│   ├── new/page.tsx      # Create unit form
│   └── [unitId]/         # Edit/view unit
│
├── lessons/              # Lesson management
│   ├── page.tsx          # List all lessons
│   ├── new/page.tsx      # Create lesson form
│   └── [lessonId]/       # Edit/view lesson
│
├── users/page.tsx        # User management
├── feed/page.tsx         # Feed post moderation
├── inbox/page.tsx        # Support ticket inbox
└── survival/page.tsx     # Survival mode configuration
```

## Security

- All admin routes are protected by `admin-guard.ts` (Clerk role + DB check)
- Forms use Zod validation via `admin-validators.ts`
- Mutations require a valid HMAC-signed vault token (`vault-token.ts`)
- Rate-limited via `ratelimit.ts` (5 requests/min per admin)

## Components

Admin forms are in `src/components/admin/` (9 components): course-form, lesson-form, unit-form, delete buttons, AI generator form, admin sidebar.

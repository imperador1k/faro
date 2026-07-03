# Faro — Database Queries (`src/db/queries/`)

> Domain-specific query modules. Each file encapsulates all database access for a single domain.

## Files

| File            | Key Functions                                           |
| --------------- | ------------------------------------------------------- |
| `challenges.ts` | `getChallengesByLessonId`, `getChallengeById`           |
| `courses.ts`    | `getCourses`, `getCourseById`, `getUserEnrolledCourses` |
| `lessons.ts`    | `getLessonsByUnitId`, `getLessonById`, `getNextLesson`  |
| `shop.ts`       | `getShopItems`, `purchaseItem`, `getPurchaseHistory`    |
| `social.ts`     | `getFriends`, `getFriendRequests`, `searchUsers`        |
| `users.ts`      | `getUserProfile`, `updatePreferences`, `getUserStats`   |
| `vocabulary.ts` | `getUserVocabulary`, `addWord`, `getDueForReview`       |

## Pattern

Each query function:

1. Is **async** and returns typed results
2. Uses **Drizzle ORM** (no raw SQL)
3. Handles **pagination** where applicable
4. Is **imported by Server Actions** (not called directly from components)

```typescript
// Example pattern
export async function getCourses(userId: string) {
  return db.query.courses.findMany({
    where: eq(courses.isPublished, true),
    with: { units: { with: { lessons: true } } },
    orderBy: [asc(courses.order)],
  });
}
```

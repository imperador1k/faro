# Faro — TypeScript Types (`src/types/`)

> Central type definitions — a single source of truth shared across Server Actions, components, and database queries.

## `index.ts`

One file, ~40+ exported types. Key categories:

**User & Profile**

- `UserProfile`, `UserPreferences`, `UserStats`, `UserAchievement`

**Learning**

- `Course`, `Unit`, `Lesson`, `Challenge`, `ChallengeType`
- `UserProgress`, `LessonResult`, `ReviewItem`

**Social**

- `Friend`, `FriendRequest`, `Message`, `Conversation`
- `FeedPost`, `FeedInteraction` (like, save, share)

**Gamification**

- `Streak`, `Heart`, `League`, `LeagueTier`, `Quest`, `DailyQuest`
- `ShopItem`, `Purchase`, `SubscriptionTier`

**Admin**

- `AdminAction`, `AdminLog`, `SupportTicket`

**AI**

- `AIGenerationRequest`, `AIGenerationResponse`, `AITutorMessage`

**System**

- `ActionResponse<T>` — every Server Action returns this
- `PaginatedResponse<T>` — paginated list results
- `ServerAction`, `WithId`, `Timestamps`

## Convention

- Types are **not** prefixed with `I` (no `IUser` — just `User`)
- Read-only arrays (`readonly T[]`) for immutable data
- `interface` for object shapes, `type` for unions/intersections
- All database entities mirror Drizzle schema types

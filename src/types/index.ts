/**
 * Shared type definitions for the MyDuolingo application.
 * These replace `any` usages across the codebase with proper TypeScript types.
 */

import { InferSelectModel } from "drizzle-orm";
import {
  userProgress,
  userSubscriptions,
  userDailyStats,
  userVocabulary,
  courses,
  units,
  lessons,
  challenges,
  challengeOptions,
  challengeProgress,
  feedActivities,
  follows,
  notifications,
  conversations,
  conversationParticipants,
  messages,
  messageReactions,
  supportTickets,
  userReviews,
  adminAuditLogs,
  adminAuthAttempts,
  placementTestHistory,
  practiceSessions,
  challengeMistakes,
  highFives,
} from "@/db/schema";

// ── Database Types (Drizzle Inferred) ────────────────────────────────────────

export type DBUserProgress = InferSelectModel<typeof userProgress>;
export type DBUserSubscription = InferSelectModel<typeof userSubscriptions>;
export type DBUserDailyStats = InferSelectModel<typeof userDailyStats>;
export type DBUserVocabulary = InferSelectModel<typeof userVocabulary>;
export type DBCourse = InferSelectModel<typeof courses>;
export type DBUnit = InferSelectModel<typeof units>;
export type DBLesson = InferSelectModel<typeof lessons>;
export type DBChallenge = InferSelectModel<typeof challenges>;
export type DBChallengeOption = InferSelectModel<typeof challengeOptions>;
export type DBChallengeProgress = InferSelectModel<typeof challengeProgress>;
export type DBFeedActivity = InferSelectModel<typeof feedActivities>;
export type DBFollow = InferSelectModel<typeof follows>;
export type DBNotification = InferSelectModel<typeof notifications>;
export type DBConversation = InferSelectModel<typeof conversations>;
export type DBConversationParticipant = InferSelectModel<
  typeof conversationParticipants
>;
export type DBMessage = InferSelectModel<typeof messages>;
export type DBMessageReaction = InferSelectModel<typeof messageReactions>;
export type DBSupportTicket = InferSelectModel<typeof supportTickets>;
export type DBUserReview = InferSelectModel<typeof userReviews>;
export type DBAdminAuditLog = InferSelectModel<typeof adminAuditLogs>;
export type DBAdminAuthAttempt = InferSelectModel<typeof adminAuthAttempts>;
export type DBPlacementTestHistory = InferSelectModel<
  typeof placementTestHistory
>;
export type DBPracticeSession = InferSelectModel<typeof practiceSessions>;
export type DBChallengeMistake = InferSelectModel<typeof challengeMistakes>;
export type DBHighFive = InferSelectModel<typeof highFives>;

// ── Subscription ─────────────────────────────────────────────────────────────

export type SubscriptionStatus = {
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  stripePriceId: string | null;
  stripeCurrentPeriodEnd: Date | null;
};

// ── Challenge Types ──────────────────────────────────────────────────────────

export type ChallengeType =
  | "SELECT"
  | "ASSIST"
  | "INSERT"
  | "MATCH"
  | "DICTATION";

export type ChallengeWithOptions = DBChallenge & {
  challengeOptions: DBChallengeOption[];
};

export type LessonWithChallenges = DBLesson & {
  challenges: ChallengeWithOptions[];
};

export type UnitWithLessons = DBUnit & {
  lessons: LessonWithChallenges[];
};

export type CourseWithUnits = DBCourse & {
  units: UnitWithLessons[];
};

// ── Social ───────────────────────────────────────────────────────────────────

export type FeedActivityWithRelations = DBFeedActivity & {
  user: {
    userImageSrc: string | null;
  } | null;
  highFives: DBHighFive[];
};

export type FollowWithUser = DBFollow & {
  following?: {
    userId: string;
    userImageSrc: string | null;
  } | null;
};

// ── Chat/Messages ────────────────────────────────────────────────────────────

export type ConversationWithDetails = {
  id: string | number;
  name: string | null;
  isGroup: boolean;
  partner: {
    userId: string;
    userName: string | null;
    userImageSrc: string | null;
    isPro?: boolean;
  } | null;
  participants: {
    userId: string;
    userName: string | null;
    userImageSrc: string | null;
    isPro?: boolean;
  }[];
  lastMessage: {
    id: number;
    content: string;
    createdAt: Date;
    senderId: string;
    read: boolean;
  } | null;
  unreadCount: number;
  updatedAt: Date;
};

export type MessageWithUser = DBMessage & {
  sender: {
    userId: string;
    userImageSrc: string | null;
  } | null;
};

export type FormattedMessage = {
  id: number | string;
  conversationId: number | string;
  senderId: string;
  content: string;
  messageType: string;
  gifUrl: string | null;
  replyToId: number | null;
  createdAt: Date;
  reactions: {
    emoji: string;
    userId: string;
  }[];
  sender?: {
    userId: string;
    userImageSrc: string | null;
  } | null;
  repliedMessage?: {
    content: string;
    senderId: string;
  } | null;
  name?: string | null;
  isGroup?: boolean;
  partner?: {
    userId: string;
    userName: string | null;
    userImageSrc: string | null;
    isPro?: boolean;
  } | null;
  participants?: {
    userId: string;
    userName: string | null;
    userImageSrc: string | null;
    isPro?: boolean;
  }[];
  lastMessage?: {
    id: number;
    content: string;
    createdAt: Date;
    senderId: string;
    read: boolean;
  } | null;
  unreadCount?: number;
  updatedAt: Date;
};

// ── User Progress Helpers ────────────────────────────────────────────────────

export type LeagueType = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";

export type LeagueResult = {
  league: LeagueType;
  oldLeague: LeagueType;
  rank: number;
  status: "PROMOTED" | "STAYED" | "DEMOTED";
};

export type UserProgressWithRelations = DBUserProgress & {
  course: DBCourse | null;
};

// ── Admin ────────────────────────────────────────────────────────────────────

export type AdminAuditAction =
  | "CREATE_COURSE"
  | "UPDATE_COURSE"
  | "CREATE_UNIT"
  | "UPDATE_UNIT"
  | "CREATE_LESSON"
  | "UPDATE_LESSON"
  | "DELETE_USER"
  | "GENERATE_CONTENT";

// ── Tauri/Native ─────────────────────────────────────────────────────────────

export type TauriInternals = {
  invoke: (command: string, args?: Record<string, unknown>) => Promise<unknown>;
  transformCallback: (callback: (response: unknown) => void) => number;
};

declare global {
  interface Window {
    __TAURI_INTERNALS__?: TauriInternals;
    __TAURI__?: Record<string, unknown>;
    plugins?: {
      OneSignal?: Record<string, unknown>;
    };
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

// ── Giphy ────────────────────────────────────────────────────────────────────

export type GiphyGif = {
  id: string;
  images: {
    fixed_height: { url: string; width: string; height: string };
    fixed_width: { url: string; width: string; height: string };
    original: { url: string; width: string; height: string };
  };
  title: string;
};

// ── Achievements ─────────────────────────────────────────────────────────────

export type AchievementCondition = (progress: DBUserProgress) => boolean;

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
};

// ── Clerk Metadata ───────────────────────────────────────────────────────────

export type ClerkPublicMetadata = {
  role?: string;
};

// ── Error Response ───────────────────────────────────────────────────────────

export type ActionResponse<T> =
  | { success: true; data?: T }
  | { success: false; code: string; message: string };

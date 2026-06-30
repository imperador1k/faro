"use client";

import { useTranslations } from "next-intl";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import Link from "next/link";
import QRCode from "react-qr-code";
import {
  Copy,
  Share2,
  Flame,
  Trophy,
  Star,
  Sparkles,
  Send,
  Loader2,
  Camera,
  BadgeCheck,
  X,
} from "lucide-react";
import { UserSearch } from "@/components/shared/user-search";
import { FollowButton } from "@/components/shared/follow-button";
import { cn } from "@/lib/utils";
import { useCustomToast } from "@/components/ui/custom-toast";
import { onFollow, onUnfollow } from "@/actions/user-actions";
import { toggleHighFive } from "@/actions/social";
import { QrScannerModal } from "@/components/shared/qr-scanner-modal";
import confetti from "canvas-confetti";
import { EmptyState } from "@/components/ui/empty-state";

type FeedActivity = {
  id: number;
  userId: string;
  type: string;
  metadata: string;
  createdAt: string;
  user: {
    userName: string;
    userImageSrc: string | null;
    isPro?: boolean;
  };
  highFiveCount: number;
  hasHighFived: boolean;
};

type UserData = {
  userId: string;
  userName: string;
  userImageSrc: string | null;
};

type FollowRelation = {
  follower?: UserData;
  following?: UserData;
};

type Props = {
  currentUserId: string;
  currentUserName: string;
  query?: string;
  searchResults: UserData[];
  suggestions: UserData[];
  followers: FollowRelation[];
  following: FollowRelation[];
  feedActivities: FeedActivity[];
};

export const FriendsClient = ({
  currentUserId,
  currentUserName,
  query,
  searchResults,
  suggestions,
  followers,
  following,
  feedActivities,
}: Props) => {
  const t = useTranslations("friends");
  const [activeTab, setActiveTab] = useState<"feed" | "friends" | "search">(
    query ? "search" : "feed",
  );
  const [friendCode, setFriendCode] = useState("");
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [openScannerId, setOpenScannerId] = useState<number | null>(null); // To manage high-five loading state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [localActivities, setLocalActivities] =
    useState<FeedActivity[]>(feedActivities);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { toast } = useCustomToast();

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const profileLink = `${baseUrl}/profile/${currentUserId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileLink);
    toast(t("copy_success"));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("share_title"),
          text: t("share_text"),
          url: profileLink,
        });
      } catch (err) {
        console.log(t("share_error"), err);
      }
    } else {
      handleCopy();
    }
  };

  const followingSet = new Set(
    following
      .filter((f) => f.following !== null && f.following !== undefined)
      .map((f) => f.following!.userId),
  );
  const followerSet = new Set(
    followers
      .filter((f) => f.follower !== null && f.follower !== undefined)
      .map((f) => f.follower!.userId),
  );

  const isMutual = (id: string) => followingSet.has(id) && followerSet.has(id);
  const amIFollowing = (id: string) => followingSet.has(id);

  const uniqueFriendsMap = new Map<string, UserData>();
  following.forEach((f) => {
    if (f.following) uniqueFriendsMap.set(f.following.userId, f.following);
  });
  followers.forEach((f) => {
    if (f.follower) uniqueFriendsMap.set(f.follower.userId, f.follower);
  });
  const allFriends = Array.from(uniqueFriendsMap.values());

  const handleFollowByCode = () => {
    if (!friendCode || friendCode.length < 4) {
      toast(t("invalid_code"));
      return;
    }

    setIsSubmittingCode(true);

    // Simulated API call / follow logic
    setTimeout(() => {
      setIsSubmittingCode(false);
      toast(t("user_not_found"));
      setFriendCode("");
    }, 1200);
  };

  const handleHighFive = async (activityId: number) => {
    try {
      setOpenScannerId(activityId);
      const result = await toggleHighFive(activityId);

      if (result && "error" in result) {
        toast.error(result.error as string);
        return;
      }

      // Update local state optimistically
      setLocalActivities((prev) =>
        prev.map((act) => {
          if (act.id === activityId) {
            if (result.action === "added") {
              return {
                ...act,
                hasHighFived: true,
                highFiveCount: act.highFiveCount + 1,
              };
            } else if (result.action === "removed") {
              return {
                ...act,
                hasHighFived: false,
                highFiveCount: Math.max(0, act.highFiveCount - 1),
              };
            }
          }
          return act;
        }),
      );

      if (result.action === "added") {
        // Fire some fun confetti since this is a positive gaming interaction!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#1CB0F6", "#FF9600", "#58CC02"],
        });
      }
    } finally {
      setOpenScannerId(null);
    }
  };

  const getFeedIconAndColor = (type: string) => {
    switch (type) {
      case "STREAK":
        return {
          icon: <Flame className="w-6 h-6 text-orange-500" />,
          color: "bg-orange-100",
        };
      case "LEAGUE":
        return {
          icon: <Trophy className="w-6 h-6 text-purple-500" />,
          color: "bg-purple-100",
        };
      case "PERFECT_LESSON":
      default:
        return {
          icon: <Star className="w-6 h-6 text-yellow-500" />,
          color: "bg-yellow-100",
        };
    }
  };

  const getFeedText = (type: string, metadata: string) => {
    switch (type) {
      case "STREAK":
        return `atingiu uma ofensiva de ${metadata} dias!`;
      case "LEAGUE":
        return `subiu para a Liga ${metadata}!`;
      case "PERFECT_LESSON":
        return `completou ${metadata} lições perfeitas seguidas.`;
      case "NEW_FOLLOWER":
        return `começou a seguir-te!`;
      default:
        return `completou uma atividade épica!`;
    }
  };

  // Calculate time ago
  const timeAgo = (dateStr: string) => {
    const diff = Math.floor(
      (new Date().getTime() - new Date(dateStr).getTime()) / 60000,
    ); // mins
    if (diff < 60) return diff <= 0 ? "Agora mesmo" : `Há ${diff} min`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `Há ${hours}h`;
    return `Há ${Math.floor(hours / 24)} dias`;
  };

  const renderUser = (
    user: UserData,
    amFollowingVal: boolean,
    isFollowerVal: boolean,
  ) => (
    <div
      key={user.userId}
      className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-6 rounded-2xl p-3 sm:p-4 flex items-center justify-between mb-4 hover:-translate-y-1 transition-transform"
    >
      <Link
        href={`/profile/${user.userId}`}
        className="flex-1 flex items-center gap-3 sm:gap-4 min-w-0 hover:opacity-80 transition pr-2 sm:pr-4"
      >
        <div className="relative h-12 w-12 sm:h-16 sm:w-16 rounded-full border-4 border-amber-400 shrink-0 bg-stone-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-sm">
          {user.userImageSrc ? (
            <Image
              src={user.userImageSrc}
              alt={user.userName}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-2xl sm:text-3xl font-black text-stone-300">
              {user.userName[0]?.toUpperCase() || "👤"}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-stone-700 dark:text-slate-200 text-[1rem] sm:text-[1.1rem] line-clamp-2 leading-tight">
            {user.userName}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
            <p className="font-bold text-stone-400 dark:text-slate-500 dark:text-slate-400 text-xs sm:text-sm truncate">
              @{user.userName.toLowerCase().replace(/\s/g, "")}
            </p>
            {amFollowingVal && isFollowerVal ? (
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full w-fit">
                {t("status_friends")}
              </span>
            ) : isFollowerVal ? (
              <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full w-fit">
                {t("status_follows_you")}
              </span>
            ) : amFollowingVal ? (
              <span className="text-[10px] font-black bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400 px-2 py-0.5 rounded-full w-fit">
                {t("status_following")}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
      <div className="shrink-0 flex items-center justify-end">
        <FollowButton userId={user.userId} isFollowing={amFollowingVal} />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-8 pb-24">
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={(scannedId) => {
          setFriendCode(scannedId);
          toast(
            "Código detetado com sucesso! Clique em '{t('add_button')} Amigo' se os dados estiverem corretos.",
          );
        }}
      />

      {/* ── QR Code Enlarged Modal (Portaled) ── */}
      {isQrModalOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-supreme flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
            onClick={() => setIsQrModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center relative animate-in zoom-in-95 fade-in duration-300 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-700 dark:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-black text-stone-800 dark:text-slate-100 mb-6 mt-2 text-center">
                {t("secret_id")}
              </h2>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border-4 border-stone-100 w-full aspect-square flex items-center justify-center">
                <QRCode
                  value={profileLink}
                  size={280}
                  className="h-auto max-w-full"
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              <p className="text-stone-500 dark:text-slate-400 font-bold text-center mt-6 leading-relaxed">
                {t("show_code_desc")}
              </p>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="mt-6 w-full py-4 bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 font-black rounded-xl border-b-4 border-stone-200 dark:border-slate-800 active:translate-y-1 active:border-b-0 transition-all uppercase tracking-wide"
              >
                {t("close")}
              </button>
            </div>
          </div>,
          document.body,
        )}

      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-extrabold text-stone-800 dark:text-slate-100">
          {t("title")}
        </h1>
      </div>

      {/* ── Tactile Tab Switcher (Segmented Control) ── */}
      <div className="bg-stone-200 dark:bg-slate-700 p-1.5 rounded-2xl flex items-center max-w-3xl w-full mx-auto mb-10 overflow-x-auto no-scrollbar shadow-inner">
        {[
          { id: "feed", label: t("tabs.feed") },
          { id: "friends", label: t("tabs.friends") },
          { id: "search", label: t("tabs.add") },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(tab.id as "feed" | "friends" | "search")
            }
            className={cn(
              "flex-1 text-center py-2 px-4 whitespace-nowrap transition-all rounded-xl",
              activeTab === tab.id
                ? "bg-white dark:bg-slate-900 shadow-[0_2px_10px_rgba(0,0,0,0.1)] font-black text-[#1CB0F6]"
                : "font-bold text-stone-500 dark:text-slate-400 hover:text-stone-700 dark:text-slate-200 cursor-pointer",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Feed Tab (Activity) ── */}
      {activeTab === "feed" && (
        <div className="space-y-4 max-w-3xl mx-auto">
          {localActivities.length === 0 ? (
            <EmptyState
              title={t("empty_feed.title")}
              description={t("empty_feed.desc")}
              actionText={t("empty_feed.action")}
              onAction={() => setActiveTab("search")}
            />
          ) : (
            localActivities.map((activity) => {
              const visual = getFeedIconAndColor(activity.type);
              const text = getFeedText(activity.type, activity.metadata);
              const isPending = openScannerId === activity.id;

              return (
                <div
                  key={activity.id}
                  className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden transition-all hover:border-stone-300 dark:border-slate-700 shadow-sm group"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-sm ring-1 ring-stone-100",
                        visual.color,
                      )}
                    >
                      {visual.icon}
                    </div>
                    <div>
                      <p className="text-lg text-stone-700 dark:text-slate-200 font-bold leading-tight flex items-center gap-1.5 flex-wrap">
                        <strong className="font-black text-stone-900">
                          {activity.user.userName}
                        </strong>
                        {activity.user.isPro && (
                          <BadgeCheck className="w-5 h-5 text-amber-500 fill-amber-300" />
                        )}
                        {text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-stone-400 dark:text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">
                          {timeAgo(activity.createdAt)}
                        </p>
                        {activity.highFiveCount > 0 && (
                          <span className="bg-amber-100 text-amber-600 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            ✋ {activity.highFiveCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleHighFive(activity.id)}
                    disabled={isPending}
                    className={cn(
                      "shrink-0 w-full sm:w-auto border-2 border-b-4 rounded-xl px-5 py-3 font-extrabold transition-all flex gap-2 items-center justify-center cursor-pointer",
                      activity.hasHighFived
                        ? "bg-green-100 text-green-500 border-green-200 border-b-2 translate-y-0.5"
                        : "bg-stone-100 dark:bg-slate-800 text-stone-400 dark:text-slate-500 dark:text-slate-400 border-stone-200 dark:border-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 dark:bg-slate-700 hover:text-stone-500 dark:text-slate-400 active:translate-y-1 active:border-b-2",
                    )}
                  >
                    {isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="text-xl">✋</span>
                    )}
                    {activity.hasHighFived
                      ? t("already_highfived")
                      : t("give_highfive")}
                  </button>
                </div>
              );
            })
          )}

          <div className="text-center pt-8 pb-4">
            <p className="text-stone-400 dark:text-slate-500 dark:text-slate-400 font-bold text-sm">
              {t("recent_activities")}
            </p>
          </div>
        </div>
      )}

      {/* ── Friends Tab (Combined) ── */}
      {activeTab === "friends" && (
        <div className="max-w-2xl mx-auto">
          {allFriends.length === 0 ? (
            <EmptyState
              title={t("empty_friends.title")}
              description={t("empty_friends.desc")}
              actionText={t("empty_friends.action")}
              onAction={() => setActiveTab("search")}
            />
          ) : (
            allFriends.map((user) =>
              renderUser(
                user,
                amIFollowing(user.userId),
                followerSet.has(user.userId),
              ),
            )
          )}
        </div>
      )}

      {/* ── Search Tab (Bento Boxes) ── */}
      {activeTab === "search" && (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Box 1: Input Friend Code & My Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-sky-950 border-2 border-blue-200 dark:border-sky-900 border-b-8 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-blue-500 dark:text-sky-500/20" />
              </div>
              <h2 className="text-2xl font-black text-blue-950 dark:text-sky-100 mb-2 relative z-10">
                {t.rich("have_code_title", { br: () => <br /> })}
              </h2>
              <p className="text-blue-800/80 dark:text-sky-300/80 font-bold text-sm mb-6 relative z-10">
                {t("have_code_desc")}
              </p>

              <div className="w-full relative z-10">
                <input
                  type="text"
                  placeholder="ABCD-1234"
                  value={friendCode}
                  onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                  className="w-full bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-sky-900 border-b-6 rounded-2xl p-4 text-center font-black text-2xl tracking-[0.2em] uppercase placeholder:text-blue-200 dark:placeholder:text-sky-800 text-blue-900 dark:text-sky-100 focus:outline-none focus:border-[#1CB0F6] focus:border-b-[#1899D6] transition-all mb-4"
                  maxLength={9}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleFollowByCode}
                    disabled={isSubmittingCode}
                    className="flex-1 bg-[#1CB0F6] text-white font-black text-lg px-4 sm:px-8 py-4 rounded-xl border-b-4 border-[#1899D6] active:translate-y-1 active:border-b-0 uppercase transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    {isSubmittingCode && (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                    {t("add_button")}
                  </button>

                  {/* Action button to open Scanner */}
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="bg-white dark:bg-slate-900 text-[#1CB0F6] shrink-0 font-black px-4 sm:px-6 py-4 rounded-xl border-2 border-blue-200 dark:border-sky-900 border-b-4 active:translate-y-1 active:border-b-2 hover:bg-blue-50 dark:hover:bg-sky-900 transition-all shadow-sm flex items-center justify-center"
                    aria-label="Abrir câmara"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <h2 className="text-xl font-black text-stone-800 dark:text-slate-100 mb-2">
                {t("secret_id")}
              </h2>
              <p className="text-stone-500 dark:text-slate-400 font-bold text-sm mb-6">
                {t("give_code_desc")}
              </p>

              <div
                onClick={() => setIsQrModalOpen(true)}
                className="bg-stone-50 dark:bg-slate-950 p-4 flex items-center justify-center rounded-2xl border-2 border-stone-100 mb-6 w-full max-w-[200px] hover:scale-105 transition-transform cursor-pointer relative group"
              >
                <QRCode
                  value={profileLink}
                  size={150}
                  className="h-auto max-w-full"
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400 font-extrabold uppercase rounded-xl border-2 border-stone-200 dark:border-slate-800 border-b-4 py-3 active:translate-y-1 active:border-b-2 hover:bg-stone-200 dark:hover:bg-slate-700 dark:bg-slate-700 hover:text-stone-600 dark:text-slate-300 transition-all text-sm"
                >
                  <Copy className="w-4 h-4" /> {t("copy")}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#58CC02] text-white font-extrabold uppercase rounded-xl border-2 border-[#58AA02] border-b-4 py-3 active:translate-y-1 active:border-b-2 hover:bg-[#46A302] transition-all text-sm"
                >
                  <Share2 className="w-4 h-4" /> {t("share")}
                </button>
              </div>
            </div>
          </div>

          {/* Box 2: Global Search & Suggestions */}
          <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-stone-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-stone-500 dark:text-slate-400">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-stone-800 dark:text-slate-100">
                  {t("search_community_title")}
                </h2>
                <p className="text-stone-500 dark:text-slate-400 font-bold text-sm">
                  {t("search_community_desc")}
                </p>
              </div>
            </div>

            <UserSearch />

            <div className="mt-8 border-t-2 border-stone-100 pt-8">
              {query ? (
                <div>
                  <h2 className="text-lg font-black text-stone-600 dark:text-slate-300 mb-4 uppercase tracking-widest">
                    {t("search_results")}
                  </h2>
                  {searchResults.length === 0 ? (
                    <p className="text-stone-400 dark:text-slate-500 dark:text-slate-400 font-bold text-center py-6">
                      {t("no_results")}
                    </p>
                  ) : (
                    searchResults.map((user) =>
                      renderUser(
                        user,
                        amIFollowing(user.userId),
                        followerSet.has(user.userId),
                      ),
                    )
                  )}
                </div>
              ) : (
                suggestions.length > 0 && (
                  <div>
                    <h2 className="text-lg font-black text-stone-400 dark:text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-5 h-5" /> {t("suggestions_title")}
                    </h2>
                    {suggestions
                      .filter((s) => s.userId !== currentUserId)
                      .map((user) =>
                        renderUser(
                          user,
                          amIFollowing(user.userId),
                          followerSet.has(user.userId),
                        ),
                      )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

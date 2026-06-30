import { Suspense, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getWeeklyLeaderboard } from "@/db/queries/users";
import { calculateIsPro } from "@/lib/subscription";
import { getUserProgress } from "@/db/queries/users";
import {
  Trophy,
  Star,
  Crown,
  Zap,
  BadgeCheck,
  Shield,
  Info,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TedyLottie } from "@/components/ui/lottie-animation";
import { LottieBlock } from "@/components/ui/lottie-block";
import { LeagueJourney } from "@/components/leaderboard/league-journey";
import { LeagueCountdown } from "@/components/leaderboard/league-countdown";
import { LeagueInfoModal } from "@/components/leaderboard/league-info-modal";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

const getLeagueConfig = (
  t: any,
): Record<
  string,
  {
    label: string;
    color: string;
    border: string;
    accent: string;
    icon: React.ReactNode;
  }
> => ({
  BRONZE: {
    label: t("league_bronze"),
    color: "from-orange-400 via-amber-300 to-yellow-400",
    border: "border-orange-300",
    accent: "text-orange-600",
    icon: <Shield className="h-10 w-10 text-orange-500 fill-orange-200" />,
  },
  SILVER: {
    label: t("league_silver"),
    color: "from-slate-400 via-slate-300 to-slate-200",
    border: "border-slate-300",
    accent: "text-slate-600",
    icon: (
      <Shield className="h-10 w-10 text-slate-500 dark:text-slate-400 fill-slate-200" />
    ),
  },
  GOLD: {
    label: t("league_gold"),
    color: "from-amber-500 via-yellow-400 to-amber-300",
    border: "border-amber-300",
    accent: "text-amber-600",
    icon: <Trophy className="h-10 w-10 text-amber-500 fill-amber-200" />,
  },
  PLATINUM: {
    label: t("league_platinum"),
    color: "from-teal-400 via-cyan-300 to-teal-200",
    border: "border-teal-300",
    accent: "text-teal-600",
    icon: <Trophy className="h-10 w-10 text-teal-500 fill-teal-200" />,
  },
  DIAMOND: {
    label: t("league_diamond"),
    color: "from-sky-500 via-blue-400 to-indigo-500",
    border: "border-sky-300",
    accent: "text-sky-600",
    icon: <Crown className="h-10 w-10 text-sky-400 fill-sky-100" />,
  },
});

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 pb-24 max-w-[1000px] mx-auto w-full font-sans">
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardData />
      </Suspense>
    </div>
  );
}

async function LeaderboardData() {
  const t = await getTranslations("leaderboard");
  const LEAGUE_CONFIG = getLeagueConfig(t);
  const { userId } = await auth();
  if (!userId) redirect("/");

  const [topUsersRaw, currentUserProgress] = await Promise.all([
    getWeeklyLeaderboard(),
    getUserProgress(),
  ]);

  if (!currentUserProgress) redirect("/courses");

  const league = currentUserProgress.league ?? "BRONZE";
  const leagueCfg = LEAGUE_CONFIG[league] ?? LEAGUE_CONFIG.BRONZE;

  const topUsers = topUsersRaw;

  const currentUserRank = topUsers.findIndex((u) => u.userId === userId) + 1;

  return (
    <>
      <header
        className={cn(
          "relative rounded-[3rem] border-2 border-b-[10px] p-8 md:p-10 overflow-hidden shadow-sm",
          leagueCfg.border,
          `bg-gradient-to-tr ${leagueCfg.color}`,
        )}
      >
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] animate-[shimmer_6s_infinite_ease-in-out] skew-x-12 pointer-events-none" />

        <div className="absolute top-5 right-5 z-20">
          <LeagueInfoModal />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] bg-white/30 backdrop-blur-sm border-2 border-white/40 border-b-4 border-b-black/10 shadow-sm">
            {leagueCfg.icon}
          </div>

          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p className="text-white/70 font-black text-xs uppercase tracking-[0.2em">
              {t("your_league")}
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm">
              {t("league_label", { label: leagueCfg.label })}
            </h1>
            <p className="text-white/80 font-bold text-base md:text-lg mt-1">
              {t("earn_xp_to_climb")}
            </p>
          </div>

          <div className="sm:ml-auto flex flex-col items-center gap-3">
            {currentUserRank > 0 && (
              <div className="flex flex-col items-center justify-center bg-white/25 backdrop-blur-sm border-2 border-white/40 border-b-4 border-b-black/10 rounded-[2rem] px-6 py-4 min-w-[120px] shrink-0">
                <span className="text-white/70 font-black text-[10px] uppercase tracking-widest whitespace-nowrap">
                  {t("your_position")}
                </span>
                <span className="text-white font-black text-4xl tracking-tighter leading-none">
                  {currentUserRank}º
                </span>
              </div>
            )}
            <LeagueCountdown variant="minimal" />
          </div>
        </div>
      </header>

      <LeagueJourney currentLeague={league} />

      {topUsers.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          <PodiumCard
            user={topUsers[1]}
            rank={2}
            isCurrentUser={topUsers[1].userId === userId}
            color="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            icon={<Star className="h-6 w-6 text-slate-400 fill-slate-200" />}
          />
          <PodiumCard
            user={topUsers[0]}
            rank={1}
            isCurrentUser={topUsers[0].userId === userId}
            color="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800"
            featured
            icon={<Crown className="h-10 w-10 text-amber-500 fill-amber-200" />}
          />
          <PodiumCard
            user={topUsers[2]}
            rank={3}
            isCurrentUser={topUsers[2].userId === userId}
            color="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800"
            icon={<Star className="h-6 w-6 text-orange-400 fill-orange-200" />}
          />
        </div>
      )}

      {(() => {
        const PROMOTION_CUTOFF = 5;
        const showDemotionZone = topUsers.length > 10;
        const DEMOTION_CUTOFF = topUsers.length - 5;

        const currentUserIndex = topUsers.findIndex((u) => u.userId === userId);
        const isJustMissedPromotion = currentUserIndex === PROMOTION_CUTOFF;
        const isInDemotionZone =
          showDemotionZone && currentUserIndex >= DEMOTION_CUTOFF;

        return (
          <div className="flex flex-col gap-4 mt-2">
            {topUsers.map((user, index) => {
              const isCurrentUser = user.userId === userId;

              if (topUsers.length >= 3 && index < 3) return null;

              const showAlmostUp = isCurrentUser && isJustMissedPromotion;
              const showAtRisk = isCurrentUser && isInDemotionZone;

              return (
                <div key={user.userId}>
                  {index === PROMOTION_CUTOFF && (
                    <div className="flex items-center gap-3 w-full py-3 my-1">
                      <div className="flex-1 h-0.5 rounded-full bg-emerald-200" />
                      <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-900/50 border-b-4 shadow-sm">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">
                          {t("promotion_zone")}
                        </span>
                      </div>
                      <div className="flex-1 h-0.5 rounded-full bg-emerald-200" />
                    </div>
                  )}

                  {showDemotionZone && index === DEMOTION_CUTOFF && (
                    <div className="flex items-center gap-3 w-full py-3 my-1">
                      <div className="flex-1 h-0.5 rounded-full bg-rose-200" />
                      <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-200 dark:border-rose-900/50 border-b-4 shadow-sm">
                        <TrendingDown className="h-4 w-4 text-rose-500" />
                        <span className="text-rose-600 font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">
                          {t("demotion_zone")}
                        </span>
                      </div>
                      <div className="flex-1 h-0.5 rounded-full bg-rose-200" />
                    </div>
                  )}

                  <Link
                    href={`/profile/${user.userId}`}
                    className={cn(
                      "group bg-white dark:bg-slate-900 rounded-[2.5rem] p-5 flex items-center gap-4 border-2 border-stone-200 dark:border-slate-800 border-b-8 hover:bg-stone-50 dark:bg-slate-950 transition-all active:translate-y-1 active:border-b-0 active:mb-[8px]",
                      isCurrentUser &&
                        "bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-900/50 shadow-sky-100 dark:shadow-none",
                      showAtRisk &&
                        "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900/50 border-b-rose-400 dark:border-b-rose-800",
                    )}
                  >
                    <div className="flex items-center justify-center min-w-[50px]">
                      <span
                        className={cn(
                          "font-black text-2xl tracking-tighter w-10 h-10 flex items-center justify-center rounded-xl",
                          isCurrentUser
                            ? "text-sky-500 bg-sky-100 dark:bg-sky-900/30 border-2 border-sky-200 dark:border-sky-800"
                            : "text-stone-300 dark:text-slate-600",
                          showAtRisk &&
                            "text-rose-500 bg-rose-100 dark:bg-rose-900/30 border-2 border-rose-200 dark:border-rose-800",
                        )}
                      >
                        {index + 1}
                      </span>
                    </div>

                    <div className="relative h-16 w-16 rounded-[1.25rem] border-2 border-stone-200 dark:border-slate-800 overflow-hidden bg-stone-100 dark:bg-slate-800 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      {user.userImageSrc ? (
                        <Image
                          src={user.userImageSrc}
                          alt={user.userName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex justify-center items-center h-full w-full font-black text-stone-400 dark:text-slate-500 dark:text-slate-400 text-xl">
                          {user.userName[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col px-2 min-w-0">
                      <span
                        className={cn(
                          "font-black text-stone-700 dark:text-slate-200 text-lg sm:text-xl tracking-tight leading-none truncate",
                          isCurrentUser && "text-sky-700",
                          showAtRisk && "text-rose-700",
                        )}
                      >
                        {user.userName}
                      </span>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {isCurrentUser && !showAtRisk && (
                          <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest animate-pulse whitespace-nowrap">
                            {t("you_label")}
                          </span>
                        )}
                        {showAlmostUp && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-500 font-black text-[10px] uppercase tracking-widest animate-pulse">
                            {t("almost_up")}
                          </span>
                        )}
                        {showAtRisk && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-900/30 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-500 font-black text-[10px] uppercase tracking-widest animate-pulse">
                            {t("at_risk")}
                          </span>
                        )}
                        <div className="flex sm:hidden items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
                          {user.xpBoostLessons > 0 ? (
                            <div
                              title={t("xp_boost_active")}
                              className="relative"
                            >
                              <div className="absolute inset-0 bg-amber-400 opacity-30 blur-md rounded-full animate-pulse" />
                              <Zap className="h-4 w-4 text-amber-500 fill-amber-300 animate-pulse relative z-10" />
                            </div>
                          ) : (
                            <Zap className="h-3 w-3 text-amber-500 fill-amber-300" />
                          )}
                          <span className="font-extrabold text-stone-700 dark:text-slate-200 text-xs tracking-tighter">
                            {t("xp_count", { xp: user.weeklyXp })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex bg-amber-100 dark:bg-amber-900/30 rounded-2xl px-5 py-2.5 border-2 border-amber-200 dark:border-amber-800 border-b-4 items-center gap-2 group-hover:scale-110 transition-transform">
                      {user.xpBoostLessons > 0 ? (
                        <div
                          title={t("xp_boost_active")}
                          className="relative flex items-center justify-center"
                        >
                          <div className="absolute inset-0 bg-amber-400 opacity-40 blur-xl rounded-full animate-pulse scale-150" />
                          <Zap className="h-6 w-6 text-amber-500 fill-amber-300 animate-pulse relative z-10 drop-shadow-md" />
                        </div>
                      ) : (
                        <Zap className="h-5 w-5 text-amber-500 fill-amber-300" />
                      )}
                      <span className="font-black text-stone-700 dark:text-slate-200 text-2xl tracking-tighter leading-none">
                        {user.weeklyXp}
                      </span>
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest -mb-1">
                        XP
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}

            {topUsers.length === 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-stone-200 dark:border-slate-800 border-b-8 p-20 text-center flex flex-col items-center justify-center gap-6 shadow-sm overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:24px_24px]" />
                <LottieBlock className="h-48 w-48 relative z-10" />
                <div className="relative z-10">
                  <h2 className="text-3xl font-black text-stone-700 dark:text-slate-200 tracking-tight uppercase">
                    {t("empty_state_title")}
                  </h2>
                  <p className="text-stone-400 dark:text-slate-500 dark:text-slate-400 font-bold text-lg mt-2 max-w-xs mx-auto">
                    {t("empty_state_description")}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      <LeagueCountdown />
    </>
  );
}

const LeaderboardSkeleton = () => (
  <div className="flex flex-col w-full gap-6 animate-in fade-in duration-500">
    <div className="h-[160px] rounded-[3rem] border-2 border-b-[10px] border-stone-200 dark:border-slate-800 bg-stone-100 dark:bg-slate-800 animate-pulse" />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-48 rounded-[3rem] border-2 border-b-8 border-stone-200 dark:border-slate-800 bg-stone-100 dark:bg-slate-800 animate-pulse mt-4" />
      <div className="h-56 rounded-[3rem] border-2 border-b-8 border-stone-200 dark:border-slate-800 bg-stone-100 dark:bg-slate-800 animate-pulse" />
      <div className="h-48 rounded-[3rem] border-2 border-b-8 border-stone-200 dark:border-slate-800 bg-stone-100 dark:bg-slate-800 animate-pulse mt-4" />
    </div>

    <div className="flex flex-col gap-4">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-5 flex items-center gap-4 border-2 border-stone-200 dark:border-slate-800 border-b-8"
        >
          <div className="flex items-center justify-center min-w-[50px]">
            <div className="w-10 h-10 bg-stone-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          </div>
          <div className="w-16 h-16 bg-stone-200 dark:bg-slate-700 rounded-[1.25rem] flex-shrink-0 animate-pulse" />
          <div className="flex-1 flex flex-col px-2 gap-2">
            <div className="h-6 w-32 bg-stone-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            <div className="h-4 w-16 bg-stone-200 dark:bg-slate-700 rounded-md animate-pulse sm:hidden" />
          </div>
          <div className="hidden sm:flex h-12 w-28 bg-stone-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

const PodiumCard = memo(
  ({
    user,
    rank,
    isCurrentUser,
    color,
    featured,
    icon,
  }: {
    user: any;
    rank: number;
    isCurrentUser: boolean;
    color: string;
    featured?: boolean;
    icon: React.ReactNode;
  }) => {
    const t = useTranslations("leaderboard");
    return (
      <Link
        href={`/profile/${user.userId}`}
        className={cn(
          "flex flex-col items-center p-6 rounded-[3rem] border-2 border-b-8 transition-all group relative",
          color,
          featured ? "md:scale-110 md:z-10 shadow-xl py-10" : "shadow-md mt-4",
          isCurrentUser &&
            "ring-4 ring-sky-500 ring-offset-4 ring-offset-stone-50 dark:ring-offset-slate-950",
        )}
      >
        <div
          className={cn(
            "absolute -top-6 flex items-center justify-center border-2 border-b-4 rounded-2xl px-4 py-1.5 font-black text-lg shadow-lg group-hover:-translate-y-2 transition-transform",
            rank === 1
              ? "bg-amber-400 border-amber-600 text-white"
              : rank === 2
                ? "bg-slate-300 border-slate-500 text-white"
                : "bg-orange-400 border-orange-600 text-white",
          )}
        >
          {t("rank_placeholder", { rank })}
        </div>

        <div
          className={cn("relative mb-4", featured ? "h-28 w-28" : "h-20 w-20")}
        >
          <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-stone-100 dark:border-slate-800 shadow-inner -z-10" />
          <div
            className={cn(
              "relative h-full w-full rounded-[1.75rem] border-2 border-stone-200 dark:border-slate-800 overflow-hidden bg-stone-100 dark:bg-slate-800 shadow-sm group-hover:scale-110 transition-transform",
              isCurrentUser && "border-sky-300",
            )}
          >
            {user.userImageSrc ? (
              <Image
                src={user.userImageSrc}
                alt={user.userName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex justify-center items-center h-full w-full font-black text-stone-400 dark:text-slate-500 dark:text-slate-400 text-3xl uppercase">
                {user.userName[0]}
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 rounded-xl p-1.5 border-2 border-stone-100 dark:border-slate-800 shadow-md group-hover:rotate-12 transition-transform">
            {icon}
          </div>
        </div>

        <h3
          className={cn(
            "text-2xl font-black text-stone-700 dark:text-slate-200 tracking-tight text-center leading-tight truncate w-full",
            featured && "text-3xl",
            isCurrentUser && "text-sky-700",
          )}
        >
          {user.userName}
        </h3>

        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <Zap
              className={cn(
                "h-5 w-5 fill-amber-300",
                rank === 1 ? "text-amber-500" : "text-amber-400",
              )}
            />
            <span className="text-3xl font-black text-stone-700 dark:text-slate-200 tracking-tighter">
              {user.weeklyXp}
            </span>
          </div>
          <span className="text-[10px] font-black text-stone-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] -mt-1">
            {t("xp_this_week")}
          </span>
        </div>

        {isCurrentUser && (
          <div className="mt-4 bg-sky-500 text-white px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest animate-pulse">
            {t("you_are_here")}
          </div>
        )}
      </Link>
    );
  },
);
PodiumCard.displayName = "PodiumCard";

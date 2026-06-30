import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { userProgress, userDailyStats } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getDailyQuests, getQuestProgress } from "@/lib/quests";
import { getAchievements } from "@/constants/achievements";
import { getTranslations } from "next-intl/server";

import {
  BookOpen,
  Check,
  Crown,
  Flame,
  Shield,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChestClient } from "./chest-client";
import { QuestsHeader } from "@/components/quests/quests-header";

const IconMap: Record<string, React.ElementType> = {
  zap: Zap,
  target: Target,
  flame: Flame,
  shield: Shield,
  star: Star,
  crown: Crown,
  book: BookOpen,
};

export const dynamic = "force-dynamic";

export default function QuestsPage() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-16 pb-32">
      <QuestsHeader />

      <Suspense fallback={<QuestsSkeleton />}>
        <QuestsData />
      </Suspense>
    </div>
  );
}

async function QuestsData() {
  const t = await getTranslations("quests");
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const progress = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
  });

  if (!progress) {
    redirect("/");
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const todayStats = await db.query.userDailyStats.findFirst({
    where: and(
      eq(userDailyStats.userId, userId),
      eq(userDailyStats.date, todayStr),
    ),
  });

  const dailyQuests = getDailyQuests(userId, todayStr, t).map((quest) => {
    const current = getQuestProgress(
      quest.type,
      (todayStats as any) ?? undefined,
    );
    return {
      ...quest,
      current,
    };
  });

  const completedQuestsCount = dailyQuests.filter(
    (q) => q.current >= q.target,
  ).length;

  const evaluatedAchievements = getAchievements(t).map((achievement) => {
    return {
      ...achievement,
      unlocked: achievement.condition(progress),
    };
  });

  const sortedAchievements = [...evaluatedAchievements].sort((a, b) => {
    if (a.unlocked === b.unlocked) return 0;
    return a.unlocked ? -1 : 1;
  });

  return (
    <>
      <section className="space-y-6">
        <div className="bg-gradient-to-b from-stone-50 to-white dark:from-slate-900 dark:to-slate-950 border-4 border-stone-200 dark:border-slate-800 border-b-[12px] rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden shadow-sm">
          <ChestClient
            completedQuestsCount={completedQuestsCount}
            chestClaimed={todayStats?.chestClaimed ?? false}
          />

          <div className="flex flex-col">
            {dailyQuests.map((quest, idx) => {
              const isCompleted = quest.current >= quest.target;
              const percent = Math.min(
                (quest.current / quest.target) * 100,
                100,
              );
              const IconComponent = IconMap[quest.iconType] || Star;

              return (
                <div
                  key={quest.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b-4 border-stone-100 dark:border-slate-800 last:border-0 group hover:bg-stone-50/50 dark:hover:bg-slate-800/50 rounded-2xl px-2 transition-colors -mx-2"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "h-14 w-14 shrink-0 rounded-2xl border-2 border-b-4 flex items-center justify-center transition-transform group-hover:scale-105",
                        isCompleted
                          ? "bg-emerald-100 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50"
                          : cn(quest.bgColor, quest.borderColor),
                      )}
                    >
                      {isCompleted ? (
                        <Check
                          className="h-6 w-6 text-emerald-500"
                          strokeWidth={4}
                        />
                      ) : (
                        <IconComponent
                          className={cn(
                            "h-6 w-6",
                            quest.borderColor
                              .replace("border-", "text-")
                              .replace("-200", "-500")
                              .replace("-300", "-600"),
                            quest.borderColor.includes("amber") &&
                              "dark:text-amber-400",
                            quest.borderColor.includes("orange") &&
                              "dark:text-orange-400",
                            quest.borderColor.includes("purple") &&
                              "dark:text-purple-400",
                            quest.borderColor.includes("yellow") &&
                              "dark:text-yellow-400",
                            quest.borderColor.includes("sky") &&
                              "dark:text-sky-400",
                            quest.borderColor.includes("blue") &&
                              "dark:text-blue-400",
                            quest.borderColor.includes("emerald") &&
                              "dark:text-emerald-400",
                            quest.borderColor.includes("rose") &&
                              "dark:text-rose-400",
                            quest.borderColor.includes("indigo") &&
                              "dark:text-indigo-400",
                          )}
                        />
                      )}
                    </div>
                    <h3
                      className={cn(
                        "font-black text-lg",
                        isCompleted
                          ? "text-emerald-500"
                          : "text-stone-700 dark:text-slate-200",
                      )}
                    >
                      {quest.title}
                    </h3>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-1 w-full sm:w-auto mt-2 sm:mt-0">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="flex-1 sm:w-40 h-6 bg-stone-200 dark:bg-slate-700 rounded-full overflow-hidden border-2 border-stone-300 dark:border-slate-700 relative shadow-inner">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            isCompleted
                              ? "bg-[#58CC02] border-r-2 border-[#46a302]"
                              : "bg-[#FFC800] border-r-2 border-amber-500",
                          )}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          "font-black text-sm min-w-[45px] text-right",
                          isCompleted
                            ? "text-[#58CC02]"
                            : "text-stone-400 dark:text-slate-500 dark:text-slate-400",
                        )}
                      >
                        {quest.current}/{quest.target}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-6 pt-4">
        <div className="flex items-center gap-3 px-2 mb-8 mt-12">
          <Crown className="h-10 w-10 text-amber-500 fill-amber-200" />
          <h2 className="text-3xl font-black text-stone-700 dark:text-slate-200 uppercase tracking-tight">
            {t("trophy_room_title")}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedAchievements.map((trophy, index) => {
            if (trophy.unlocked) {
              return (
                <div
                  key={index}
                  className="bg-gradient-to-b from-yellow-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/40 border-4 border-amber-200 dark:border-amber-800 border-b-[12px] rounded-[2.5rem] p-6 flex flex-col items-center text-center transition-all hover:-translate-y-2 hover:shadow-xl cursor-pointer group shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none"></div>

                  <div className="text-6xl mb-4 drop-shadow-[0_4px_10px_rgba(251,191,36,0.6)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 relative z-10">
                    {trophy.icon}
                    <div className="absolute inset-0 bg-[url('/sparkles.svg')] opacity-0 group-hover:opacity-100 animate-pulse bg-cover pointer-events-none mix-blend-screen" />
                  </div>
                  <h3 className="font-black text-xl md:text-2xl text-amber-800 dark:text-amber-500 tracking-tight leading-tight mb-2 relative z-10">
                    {trophy.title}
                  </h3>
                  <p className="text-xs font-bold text-amber-600/90 dark:text-amber-200/80 leading-relaxed relative z-10">
                    {trophy.description}
                  </p>
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  className="bg-stone-50 dark:bg-slate-950 border-4 border-stone-200 dark:border-slate-800 border-b-[8px] rounded-[2.5rem] p-6 flex flex-col items-center text-center grayscale opacity-70 hover:opacity-100 transition-opacity cursor-not-allowed group"
                >
                  <div className="text-5xl md:text-6xl mb-4 opacity-50 group-hover:opacity-80 transition-opacity drop-shadow-sm">
                    {trophy.icon}
                  </div>
                  <h3 className="font-black text-lg md:text-xl text-stone-400 dark:text-slate-500 dark:text-slate-400 tracking-tight leading-tight mb-2">
                    {trophy.title}
                  </h3>
                  <div className="mt-auto px-4 py-2 bg-stone-200 dark:bg-slate-700 rounded-[1rem] border-b-4 border-stone-300 dark:border-slate-700">
                    <p className="text-[10px] uppercase tracking-widest font-black text-stone-500 dark:text-slate-400 leading-tight">
                      {t("locked_status")}
                    </p>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </section>
    </>
  );
}

const QuestsSkeleton = () => {
  return (
    <div className="animate-in fade-in duration-500 w-full space-y-6">
      <section className="space-y-6">
        <div className="bg-stone-50 dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm">
          <div className="flex flex-col items-center justify-center mb-8 border-b-2 border-stone-100 pb-8">
            <div className="w-24 h-24 bg-stone-200 dark:bg-slate-700 rounded-3xl mb-4 animate-pulse" />
            <div className="h-6 w-48 bg-stone-200 dark:bg-slate-700 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-32 bg-stone-200 dark:bg-slate-700 rounded-md animate-pulse" />
          </div>

          <div className="flex flex-col">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b-2 border-stone-100 dark:border-slate-800 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-stone-200 dark:bg-slate-700 border-2 border-stone-300 dark:border-slate-700 border-b-4 animate-pulse" />
                  <div className="h-6 w-32 bg-stone-200 dark:bg-slate-700 rounded-md animate-pulse" />
                </div>
                <div className="flex flex-col items-start sm:items-end gap-1 w-full sm:w-auto mt-2 sm:mt-0">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex-1 sm:w-40 h-6 bg-stone-200 dark:bg-slate-700 rounded-full border-2 border-stone-300 dark:border-slate-700 animate-pulse" />
                    <div className="h-5 w-10 bg-stone-200 dark:bg-slate-700 rounded-md animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6 pt-4">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="h-8 w-8 rounded-full bg-stone-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-8 w-48 bg-stone-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-stone-50 dark:bg-slate-950 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-3xl p-6 flex flex-col items-center text-center h-[220px]"
            >
              <div className="w-16 h-16 bg-stone-200 dark:bg-slate-700 rounded-full mb-4 animate-pulse" />
              <div className="h-6 w-24 bg-stone-200 dark:bg-slate-700 rounded-md mb-2 animate-pulse" />
              <div className="h-4 w-32 bg-stone-200 dark:bg-slate-700 rounded-md mb-1 animate-pulse" />
              <div className="h-4 w-20 bg-stone-200 dark:bg-slate-700 rounded-md animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

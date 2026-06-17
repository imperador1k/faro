import { Suspense } from "react";
import { LottieBlock } from "@/components/ui/lottie-block";
import { redirect } from "next/navigation";
import { getUserProgress } from "@/db/queries";
import {
  Heart,
  Zap,
  Shield,
  Snowflake,
  ShoppingBag,
  Infinity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ShopItems } from "./shop-items";
import { PracticeButton } from "./practice-button";
import { SupportCard } from "./support-card";
import { checkSubscription } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-[1056px] w-full pb-12 px-4 sm:px-6">
      <Suspense fallback={<ShopSkeleton />}>
        <ShopData />
      </Suspense>
    </div>
  );
}

// --- ASYNC SERVER COMPONENT FOR DATA FETCHING ---
async function ShopData() {
  const userProgressData = getUserProgress();
  const isProData = checkSubscription();

  const [userProgress, isPro] = await Promise.all([
    userProgressData,
    isProData,
  ]);

  if (!userProgress) {
    redirect("/courses");
  }

  return (
    <>
      {/* Clean Shop Header */}
      <header className="relative w-full rounded-[2rem] border-2 border-stone-200 border-b-8 bg-white p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="flex items-center gap-6 z-10 w-full md:w-auto">
          {/* Mascot Lottie */}
          <div className="hidden sm:flex shrink-0 w-24 h-24 md:w-32 md:h-32">
            <LottieBlock className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col gap-1 text-center sm:text-left w-full sm:w-auto">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-stone-800">
              Loja
            </h1>
            <p className="text-stone-500 font-bold text-sm md:text-base">
              Gasta o teu XP em reforços úteis.
            </p>
          </div>
        </div>

        {/* Top Status Bar (User's Current Balances) */}
        <div className="relative z-10 flex flex-wrap justify-center sm:justify-end gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-stone-50 px-4 py-3 rounded-xl border-2 border-stone-200">
            <Zap className="h-5 w-5 text-sky-500 fill-sky-400" />
            <span className="font-bold text-sky-600 uppercase text-sm">
              {userProgress.points} XP
            </span>
          </div>
          <div className="flex items-center gap-2 bg-stone-50 px-4 py-3 rounded-xl border-2 border-stone-200">
            {isPro ? (
              <Infinity className="h-5 w-5 text-rose-500 stroke-[3]" />
            ) : (
              <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            )}
            <span className="font-bold text-rose-600 uppercase text-sm">
              {isPro ? "ILIM" : `${userProgress.hearts}/5`}
            </span>
          </div>
          {(userProgress.heartShields || 0) > 0 && (
            <div className="flex items-center gap-2 bg-stone-50 px-4 py-3 rounded-xl border-2 border-stone-200">
              <Shield className="h-5 w-5 text-sky-500 fill-sky-500" />
              <span className="font-bold text-sky-600 uppercase text-sm">
                {userProgress.heartShields}
              </span>
            </div>
          )}
          {(userProgress.streakFreezes || 0) > 0 && (
            <div className="flex items-center gap-2 bg-stone-50 px-4 py-3 rounded-xl border-2 border-stone-200">
              <Snowflake className="h-5 w-5 text-cyan-500 fill-cyan-500" />
              <span className="font-bold text-cyan-600 uppercase text-sm">
                {userProgress.streakFreezes}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Heart Clinic — Practice to earn hearts (Only shows if < 5 and not PRO) */}
      {!isPro && (userProgress.hearts || 0) < 5 && (
        <div className="mb-8">
          <PracticeButton />
        </div>
      )}

      {/* Shop Items Storefront (Reforços) */}
      <div className="mb-14">
        <h2 className="text-xl md:text-2xl font-black text-stone-800 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center border-2 border-amber-200">
            <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          Reforços
        </h2>
        <div className="bg-white border-2 border-stone-200 border-b-[8px] rounded-[2rem] p-4 md:p-6 shadow-sm">
          <ShopItems
            hearts={userProgress.hearts || 0}
            points={userProgress.points || 0}
            xpBoostLessons={userProgress.xpBoostLessons || 0}
            heartShields={userProgress.heartShields || 0}
            streakFreezes={userProgress.streakFreezes || 0}
            isPro={isPro}
          />
        </div>
      </div>

      {/* Support the Developer */}
      <div className="w-full max-w-[1056px] mx-auto">
        <SupportCard />
      </div>
    </>
  );
}

// --- SKELETON FALLBACK ---
const ShopSkeleton = () => {
  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* VIP Header Skeleton */}
      <header className="w-full h-[180px] md:h-[220px] rounded-[2.5rem] border-2 border-stone-200 border-b-8 bg-stone-100 mb-12 animate-pulse" />

      {/* Inventory Skeleton */}
      <div className="mb-14 space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-stone-100 border-2 border-stone-200 border-b-4 animate-pulse" />
          <div className="h-10 w-48 bg-stone-200 rounded-xl animate-pulse" />
        </div>

        {/* Hearts Dashboard Skeleton */}
        <div className="h-[160px] md:h-[140px] w-full rounded-[2.5rem] border-2 border-stone-200 border-b-[10px] bg-stone-50 animate-pulse" />

        {/* Inventory Cards Skeleton (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[220px] rounded-[2.5rem] border-2 border-stone-200 border-b-[10px] bg-stone-50 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Shop Items Skeleton */}
      <div className="mb-14">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-stone-100 border-2 border-stone-200 border-b-4 animate-pulse" />
          <div className="h-10 w-56 bg-stone-200 rounded-xl animate-pulse" />
        </div>

        <div className="flex flex-col gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[140px] w-full rounded-[2.5rem] border-2 border-stone-200 border-b-[10px] bg-stone-50 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

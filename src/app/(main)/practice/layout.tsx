import { checkSubscription } from "@/lib/subscription";
import { Lock, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isPro = await checkSubscription();
  const t = await getTranslations("practice");

  if (!isPro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 max-w-[1056px] mx-auto w-full">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-stone-200 dark:border-slate-800 border-b-8 p-8 md:p-12 flex flex-col items-center text-center space-y-6 md:max-w-xl transition-all">
          <div className="w-24 h-24 bg-stone-100 dark:bg-slate-800 rounded-full flex items-center justify-center border-b-4 border-stone-200 dark:border-slate-800 shadow-inner relative">
            <Image
              src="/duo_crying.png"
              alt="Mascot"
              width={60}
              height={60}
              className="opacity-50 grayscale"
            />
            <div className="absolute -bottom-2 -right-2 bg-stone-400 rounded-full p-2 border-2 border-white">
              <Lock className="h-6 w-6 text-white" strokeWidth={3} />
            </div>
          </div>

          <div className="space-y-4 w-full">
            <h2 className="text-3xl md:text-4xl font-black text-stone-700 dark:text-slate-200 tracking-tight">
              {t("title")}
            </h2>
            <p className="text-lg font-medium text-stone-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              {t.rich("description", {
                strong: (chunks) => (
                  <span className="font-bold text-amber-500">{chunks}</span>
                ),
              })}
            </p>
          </div>

          <div className="flex flex-col gap-4 text-left bg-stone-50 dark:bg-slate-950 p-6 rounded-2xl border-2 border-stone-200 dark:border-slate-800 w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <span className="text-xl">❤️</span>
              </div>
              <span className="font-bold text-stone-600 dark:text-slate-300 text-sm md:text-base">
                {t("unlimited_lives")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <span className="text-xl">🤖</span>
              </div>
              <span className="font-bold text-stone-600 dark:text-slate-300 text-sm md:text-base">
                {t("unlimited_ai")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <span className="text-xl">✨</span>
              </div>
              <span className="font-bold text-stone-600 dark:text-slate-300 text-sm md:text-base">
                {t("ad_free")}
              </span>
            </div>
          </div>

          <div className="w-full pt-4">
            <Link href="/shop" className="w-full">
              <Button className="w-full h-14 bg-amber-400 hover:bg-amber-300 border-b-4 border-amber-500 active:border-b-0 active:translate-y-1 text-white font-black uppercase tracking-widest text-lg flex items-center justify-center gap-2 rounded-2xl transition-all">
                <Crown className="w-6 h-6 fill-white" />
                {t("unlock_pro")}
              </Button>
            </Link>
            <Link href="/learn" className="w-full block mt-4">
              <Button
                variant="ghost"
                className="w-full h-12 text-stone-400 dark:text-slate-500 dark:text-slate-400 hover:text-stone-500 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 dark:bg-slate-800 font-bold uppercase tracking-widest rounded-2xl transition-colors"
              >
                {t("go_back")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

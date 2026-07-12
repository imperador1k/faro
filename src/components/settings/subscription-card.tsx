"use client";

import { useTranslations } from "next-intl";

import { useTransition } from "react";
import { createStripeUrl } from "@/actions/user-subscription";
import { toast } from "sonner";
import {
  Crown,
  Settings,
  Loader2,
  Infinity,
  Zap,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  isPro: boolean;
};

export const SubscriptionCard = ({ isPro }: Props) => {
  const t = useTranslations("settings");
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      createStripeUrl()
        .then((response) => {
          if ("data" in response && response.data) {
            window.location.href = response.data;
          } else if (
            "success" in response &&
            !response.success &&
            "message" in response
          ) {
            toast.error(response.message);
          }
        })
        .catch(() => toast.error(t("error_processing")));
    });
  };

  return (
    <div>
      <h3 className="text-xl font-black text-stone-800 dark:text-slate-100 mb-4">
        {t("title")}
      </h3>

      {isPro ? (
        // PRO CARD
        <div className="bg-white dark:bg-slate-900 border-2 border-amber-300 border-b-8 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden transition-all">
          {/* Shimmer background hint */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-yellow-50/50 -z-10" />

          <div className="flex flex-col">
            <h4 className="text-xl font-black text-amber-600 flex items-center gap-2">
              {t("pro_title")}
              <Crown className="h-5 w-5 fill-amber-400 text-amber-500" />
            </h4>
            <p className="mt-2 text-sm font-bold text-stone-500 dark:text-slate-400 max-w-md leading-relaxed">
              {t("pro_description")}
            </p>
            <ul className="mt-3 space-y-2 text-sm font-bold text-stone-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Infinity className="h-4 w-4 text-rose-500" />{" "}
                {t("unlimited_hearts")}
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" /> {t("ad_free")}
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-500" /> {t("ai_practice")}
              </li>
            </ul>
          </div>

          <Button
            onClick={onClick}
            disabled={isPending}
            variant="super"
            className={cn(
              "group shrink-0 rounded-2xl px-6 py-4 font-black uppercase tracking-widest",
            )}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Settings className="h-5 w-5 transition-transform group-hover:rotate-45" />
            )}
            {isPending ? t("loading") : t("manage_subscription")}
          </Button>
        </div>
      ) : (
        // FREE CARD
        <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-stone-300 dark:border-slate-700">
          <div className="flex flex-col">
            <h4 className="text-xl font-black text-stone-700 dark:text-slate-200">
              {t("free_title")}
            </h4>
            <p className="mt-2 text-sm font-bold text-stone-500 dark:text-slate-400 max-w-md leading-relaxed">
              {t("free_description")}
            </p>
            <ul className="mt-3 space-y-2 text-sm font-bold text-stone-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Infinity className="h-4 w-4 text-rose-500" /> Corações
                Ilimitados
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" /> Aprendizagem sem
                Anúncios
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-500" /> Prática de IA
                Exclusiva
              </li>
            </ul>
          </div>

          <Button
            onClick={onClick}
            disabled={isPending}
            variant="super"
            className="group shrink-0 rounded-2xl px-6 py-4 font-black uppercase tracking-widest"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Crown className="h-5 w-5 transition-transform group-hover:scale-110" />
            )}
            {isPending ? t("loading") : t("upgrade")}
          </Button>
        </div>
      )}
    </div>
  );
};

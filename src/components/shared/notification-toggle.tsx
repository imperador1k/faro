"use client";

import { useTranslations } from "next-intl";

import { useTransition, useState } from "react";
import { updateNotificationPreference } from "@/actions/user-progress";
import { useCustomToast } from "@/components/ui/custom-toast";
import { cn } from "@/lib/utils";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  initialEnabled: boolean;
};

export const NotificationToggle = ({ initialEnabled }: Props) => {
  const t = useTranslations("shared");
  const { toast: customToast } = useCustomToast();
  const [isPending, startTransition] = useTransition();
  const [enabled, setEnabled] = useState(initialEnabled);

  const toggle = () => {
    if (isPending) return;

    const newValue = !enabled;
    setEnabled(newValue); // Optimistic UI

    startTransition(() => {
      updateNotificationPreference(newValue)
        .then(() => {
          customToast(newValue ? t("success_enabled") : t("success_disabled"));
        })
        .catch(() => {
          customToast.error(t("error_update"));
          setEnabled(!newValue); // Revert on error
        });
    });
  };

  return (
    <div className="flex justify-between items-center p-2 group">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all shadow-sm group-hover:scale-105 shrink-0",
            enabled
              ? "bg-stone-50 dark:bg-slate-950 text-[#58cc02] border-stone-200 dark:border-slate-800 border-b-4"
              : "bg-stone-50 dark:bg-slate-950 text-stone-400 dark:text-slate-500 dark:text-slate-400 border-stone-200 dark:border-slate-800 border-b-4",
          )}
        >
          {enabled ? (
            <Bell className="h-7 w-7" />
          ) : (
            <BellOff className="h-7 w-7" />
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="font-black text-stone-700 dark:text-slate-200 text-lg uppercase tracking-tight leading-tight">
            {t("title")}
          </h3>
          <p className="text-sm text-stone-400 dark:text-slate-500 dark:text-slate-400 font-bold mt-1">
            {t("description")}
          </p>
        </div>
      </div>

      {/* Dojo Custom Switch Pill */}
      <Button
        variant="ghost"
        onClick={toggle}
        disabled={isPending}
        className={cn(
          "relative inline-flex h-9 w-16 shrink-0 items-center rounded-full focus:outline-none disabled:opacity-50",
          enabled
            ? "bg-[#58cc02] border-2 border-[#46a302] border-b-4"
            : "bg-stone-200 dark:bg-slate-700 border-2 border-stone-300 dark:border-slate-700 border-b-4",
        )}
        role="switch"
        aria-checked={enabled}
      >
        <span className="sr-only">{t("switch_label")}</span>
        <span
          className={cn(
            "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white dark:bg-slate-900 shadow-sm ring-0 transition duration-300 ease-in-out border-b-2 border-stone-100",
            enabled ? "translate-x-7" : "translate-x-1",
          )}
        />
      </Button>
    </div>
  );
};

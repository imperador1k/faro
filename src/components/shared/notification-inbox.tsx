"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { NotificationList } from "@/components/shared/notification-list";
import {
  markNotificationsAsRead,
  deleteAllNotifications,
} from "@/actions/user-actions";
import { NotificationSettingsModal } from "@/components/modals/notification-settings-modal";
import { Button } from "@/components/ui/button";
import {
  CheckCheck,
  Trash,
  Settings,
  Trophy,
  UserPlus,
  Loader2,
  Bell,
  MessageCircle,
  Users,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TedyLottie } from "@/components/ui/lottie-animation";

type Notification = {
  id: number;
  userId: string;
  type: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: Date | null;
};

type Props = {
  initialNotifications: Notification[];
  initialEnabled: boolean;
};

type TabStatus = "all" | "messages" | "social";

export const NotificationInbox = ({
  initialNotifications,
  initialEnabled,
}: Props) => {
  const t = useTranslations("shared");
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [isPending, startTransition] = useTransition();

  const filteredNotifications = initialNotifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "messages") return n.type === "message";
    if (activeTab === "social")
      return n.type === "follow" || n.type === "streak";
    return true;
  });

  const hasUnread = filteredNotifications.some((n) => !n.read);
  const hasAny = filteredNotifications.length > 0;

  const handleMarkAllRead = () => {
    if (!hasUnread) return;
    startTransition(() => {
      markNotificationsAsRead(activeTab === "all" ? undefined : activeTab)
        .then(() => toast.success(t("notifications_marked_read")))
        .catch(() => toast.error(t("error_updating_database")));
    });
  };

  const handleClearAll = () => {
    if (!hasAny) return;
    startTransition(() => {
      deleteAllNotifications(activeTab === "all" ? undefined : activeTab)
        .then(() => toast.success(t("notifications_deleted")))
        .catch(() => toast.error(t("error_clearing")));
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <header className="relative w-full rounded-[2.5rem] border-2 border-green-200 border-b-[10px] bg-gradient-to-tr from-emerald-400/90 via-emerald-300/80 to-teal-400/90 p-6 md:p-10 overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-20 -translate-y-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl translate-x-24 translate-y-24 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-[150%] animate-[shimmer_6s_infinite_ease-in-out] skew-x-12 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex flex-col gap-1 text-center lg:text-left">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
              {t("notifications_title")}
            </h1>
            <p className="text-white/80 font-bold text-sm md:text-lg">
              {initialNotifications.length > 0
                ? t("unread_count", {
                    count: initialNotifications.filter((n) => !n.read).length,
                  })
                : t("nothing_new")}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 sm:gap-3 shrink-0">
            <button
              disabled={!hasUnread || isPending}
              onClick={handleMarkAllRead}
              title={t("mark_read")}
              className={cn(
                "flex items-center gap-2 px-3 py-2 md:px-5 md:py-3 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/30 border-b-4 border-b-black/5 text-white font-black text-[10px] md:text-xs uppercase tracking-widest transition-all hover:bg-white/30 active:translate-y-0.5",
                (!hasUnread || isPending) &&
                  "opacity-40 cursor-not-allowed grayscale-[60%]",
              )}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4 md:h-5 md:w-5" />
              )}
              <span>{t("read_label")}</span>
            </button>

            <button
              disabled={!hasAny || isPending}
              onClick={handleClearAll}
              title={t("clear_tab")}
              className={cn(
                "flex items-center gap-2 px-3 py-2 md:px-5 md:py-3 rounded-xl bg-rose-400/40 backdrop-blur-md border-2 border-rose-300/30 border-b-4 border-b-rose-900/10 text-white font-black text-[10px] md:text-xs uppercase tracking-widest transition-all hover:bg-rose-400/60 active:translate-y-0.5",
                (!hasAny || isPending) &&
                  "opacity-40 cursor-not-allowed grayscale-[60%]",
              )}
            >
              <Trash className="h-4 w-4 md:h-5 md:w-5" />
              <span>{t("clear_label")}</span>
            </button>

            <NotificationSettingsModal initialEnabled={initialEnabled}>
              <button
                title={t("settings")}
                className="flex items-center justify-center w-9 h-9 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/30 border-b-4 border-b-black/5 text-white transition-all hover:bg-white/30 active:translate-y-0.5"
              >
                <Settings className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </NotificationSettingsModal>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 lg:flex lg:items-center gap-2 md:gap-3">
          <BentoTab
            label={t("all_tab")}
            icon={<Bell className="h-4 w-4" />}
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            count={initialNotifications.length}
          />
          <BentoTab
            label={t("messages_tab")}
            icon={<MessageCircle className="h-4 w-4" />}
            active={activeTab === "messages"}
            onClick={() => setActiveTab("messages")}
            count={
              initialNotifications.filter((n) => n.type === "message").length
            }
          />
          <BentoTab
            label={t("social_tab")}
            icon={<Users className="h-4 w-4" />}
            active={activeTab === "social"}
            onClick={() => setActiveTab("social")}
            count={
              initialNotifications.filter(
                (n) => n.type === "follow" || n.type === "streak",
              ).length
            }
          />
        </div>
      </header>

      <section
        className={cn(
          "bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-stone-200 dark:border-slate-800 border-b-[10px] shadow-sm p-6 md:p-8 transition-opacity duration-200 min-h-[200px]",
          isPending && "opacity-50 pointer-events-none",
        )}
      >
        {hasAny ? (
          <NotificationList notifications={filteredNotifications} />
        ) : (
          <EmptyState activeTab={activeTab} />
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-[2.5rem] border-2 border-amber-200 border-b-[10px] bg-amber-50 p-8 md:p-10 flex items-center gap-6 shadow-sm group hover:scale-[1.02] hover:-translate-y-1 transition-all cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-40 translate-x-8 -translate-y-8 pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] border-2 border-b-4 border-amber-200 bg-white dark:bg-slate-900 shadow-sm group-hover:rotate-12 transition-transform z-10">
            <Info className="h-8 w-8 text-amber-500" />
          </div>
          <div className="z-10">
            <h3 className="text-xl md:text-2xl font-black text-stone-700 dark:text-slate-200 tracking-tight">
              {t("stay_updated_title")}
            </h3>
            <p className="text-stone-500 dark:text-slate-400 font-bold text-sm md:text-base mt-1 leading-snug">
              {t("stay_updated_desc")}
            </p>
          </div>
        </div>

        <div className="rounded-[2.5rem] border-2 border-sky-200 border-b-[10px] bg-sky-50 p-8 md:p-10 flex items-center gap-6 shadow-sm group hover:scale-[1.02] hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200 rounded-full blur-3xl opacity-40 translate-x-8 -translate-y-8 pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] border-2 border-b-4 border-sky-200 bg-white dark:bg-slate-900 shadow-sm group-hover:scale-110 transition-transform z-10">
            <UserPlus className="h-8 w-8 text-sky-500" />
          </div>
          <div className="z-10">
            <h3 className="text-xl md:text-2xl font-black text-stone-700 dark:text-slate-200 tracking-tight">
              {t("invite_friends_title")}
            </h3>
            <p className="text-stone-500 dark:text-slate-400 font-bold text-sm md:text-base mt-1 leading-snug">
              {t("invite_friends_desc")}
            </p>
          </div>
        </div>

        <div className="md:col-span-2 rounded-[2.5rem] border-2 border-purple-200 border-b-[10px] bg-purple-50 p-8 md:p-10 flex flex-col sm:flex-row items-center gap-6 shadow-sm group hover:scale-[1.01] hover:-translate-y-0.5 transition-all cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-200 rounded-full blur-3xl opacity-30 translate-x-12 -translate-y-12 pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] border-2 border-b-4 border-purple-200 bg-white dark:bg-slate-900 shadow-sm group-hover:rotate-12 transition-transform z-10">
            <Trophy className="h-8 w-8 text-purple-500 fill-purple-100" />
          </div>
          <div className="z-10">
            <h3 className="text-xl md:text-2xl font-black text-stone-700 dark:text-slate-200 tracking-tight">
              {t("weekly_ranking_title")}
            </h3>
            <p className="text-stone-500 dark:text-slate-400 font-bold text-sm md:text-base mt-1 leading-snug">
              {t("weekly_ranking_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BentoTab = ({
  label,
  icon,
  active,
  onClick,
  count,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  count: number;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-2xl font-black text-[10px] md:text-xs tracking-widest uppercase whitespace-nowrap transition-all border-2",
        active
          ? "bg-white dark:bg-slate-900 text-emerald-600 border-white/80 border-b-4 border-b-emerald-200/50 shadow-sm translate-y-[-1px]"
          : "bg-white/10 text-white/90 border-white/10 border-b-4 border-b-black/5 hover:bg-white/20 active:translate-y-0",
      )}
    >
      {icon}
      <span>{label}</span>
      {count > 0 && (
        <span
          className={cn(
            "ml-1 text-[10px] font-black px-1.5 py-0.5 rounded-full",
            active
              ? "bg-emerald-100 text-emerald-600"
              : "bg-white/20 text-white",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
};

const EmptyState = ({ activeTab }: { activeTab: TabStatus }) => {
  const t = useTranslations("shared");
  const messages: Record<TabStatus, { title: string; body: string }> = {
    all: { title: t("empty_all_title"), body: t("empty_all_body") },
    messages: {
      title: t("empty_messages_title"),
      body: t("empty_messages_body"),
    },
    social: { title: t("empty_social_title"), body: t("empty_social_body") },
  };

  const { title, body } = messages[activeTab];

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12 md:py-16 text-center">
      <div className="relative">
        <div className="w-32 h-32 md:w-40 md:h-40 animate-[breathe_4s_ease-in-out_infinite]">
          <TedyLottie className="w-full h-full" />
        </div>
        <span className="absolute -top-3 -right-4 text-2xl opacity-60 animate-[float_3s_ease-in-out_infinite] select-none">
          😴
        </span>
      </div>
      <div className="flex flex-col gap-3 max-w-md">
        <h2 className="text-2xl md:text-3xl font-black text-stone-700 dark:text-slate-200 tracking-tight">
          {title}
        </h2>
        <p className="text-stone-400 dark:text-slate-500 dark:text-slate-400 font-bold text-base md:text-lg leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  );
};

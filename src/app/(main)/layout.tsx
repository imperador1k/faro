import { Sidebar } from "@/components/shared/sidebar";
import { MobileHeader } from "@/components/shared/mobile-header";
import { MobileNav } from "@/components/shared/mobile-nav";
import { StreakCheck } from "@/components/shared/streak-check";
import {
  getUnreadMessageCount,
  getUnreadNotificationCount,
  getUserProgress,
} from "@/db/queries";
import { CommandMenu } from "@/components/shared/command-menu";
import { GlobalModals } from "@/components/modals/global-modals";
import { LeagueResultModal } from "@/components/modals/league-result-modal";
import type { LeagueResult } from "@/types";

type Props = {
  children: React.ReactNode;
};

export const dynamic = "force-dynamic";

export default async function MainLayout({ children }: Props) {
  const unreadMessages = await getUnreadMessageCount();
  const unreadNotifications = await getUnreadNotificationCount();
  const userProgress = await getUserProgress();

  return (
    <div className="relative flex h-screen overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:24px_24px] opacity-40"
      />

      <MobileHeader />

      <Sidebar
        notificationCount={unreadNotifications}
        unreadMessageCount={unreadMessages}
      />

      <main className="relative flex-1 h-full overflow-y-auto overflow-x-hidden z-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-green-400/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-sky-400/15 blur-3xl"
        />

        <div className="relative max-w-[1056px] mx-auto pt-6 px-6 pb-24 lg:pb-8 min-h-full">
          {children}
        </div>
      </main>

      <MobileNav
        notificationCount={unreadNotifications}
        unreadMessageCount={unreadMessages}
      />
      <StreakCheck />
      <CommandMenu />

      <GlobalModals />

      {!!userProgress?.lastWeekResult && (
        <LeagueResultModal
          result={userProgress.lastWeekResult as LeagueResult}
        />
      )}
    </div>
  );
}

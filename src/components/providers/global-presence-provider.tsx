"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  supabase,
  setSupabaseAuth,
  createClerkSupabaseClient,
} from "@/lib/supabaseClient";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface GlobalPresenceContextType {
  onlineUserIds: string[];
  isPartnerOnline: (partnerId: string) => boolean;
}

const GlobalPresenceContext = createContext<GlobalPresenceContextType>({
  onlineUserIds: [],
  isPartnerOnline: () => false,
});

export const useGlobalPresence = () => useContext(GlobalPresenceContext);

export const GlobalPresenceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const t = useTranslations("providers");
  const { userId, getToken, isLoaded: isAuthLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // 🌍 CONSOLIDATED EFFECT: Global Presence Lifecycle
  useEffect(() => {
    if (!isAuthLoaded || !userId || !user) return;

    let activeChannel: RealtimeChannel;
    let isStopped = false;

    const connectAndSync = async () => {
      try {
        const token = await getToken({ template: "supabase" });
        if (!token || isStopped) return;

        // Use a transient client to prevent TIMED_OUT errors with Clerk
        const client = createClerkSupabaseClient(token);

        const channel = client.channel("global_presence", {
          config: {
            presence: { key: userId },
          },
        });

        channel.on("presence", { event: "sync" }, () => {
          const state = channel.presenceState();
          const onlineIds = Object.keys(state);
          setOnlineUserIds(onlineIds);
        });

        // 🔔 Listen for background messages/notifications to update global layout badges (Sidebar)
        channel.on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          (payload) => {
            console.log(t("message_detected_log"), payload);
            // Let Next.js re-fetch the layout props like getUnreadMessageCount()
            if (!isStopped) router.refresh();
          },
        );

        channel.on(
          "postgres_changes",
          { event: "*", schema: "public", table: "notifications" },
          (payload) => {
            console.log(t("notification_detected_log"), payload);
            if (!isStopped) router.refresh();
          },
        );

        channel.subscribe(async (status, err) => {
          const timestamp = new Date().toLocaleTimeString();
          if (status === "SUBSCRIBED") {
            if (process.env.NODE_ENV !== "production")
              console.log(
                `[GlobalPresence] 🟢 [${timestamp}] ${t("connected_status")}`,
              );
            await channel.track({
              online_at: new Date().toISOString(),
              username: user.username || user.firstName,
            });
          } else if (status === "CLOSED") {
            if (!isStopped) {
              if (process.env.NODE_ENV !== "production")
                console.warn(
                  `[GlobalPresence] 📡 [${timestamp}] ${t("connection_closed")}`,
                );
              // Attempt to recover channel
              setTimeout(() => {
                if (!isStopped && activeChannel) {
                  activeChannel.subscribe();
                }
              }, 3000);
            }
          } else if (status === "TIMED_OUT") {
            if (process.env.NODE_ENV !== "production")
              console.error(
                `[GlobalPresence] ⏱️ [${timestamp}] ${t("timeout_error")}`,
              );
          }
        });

        activeChannel = channel;
        channelRef.current = channel;
      } catch (err) {
        console.error("[GlobalPresence] Connection error:", err);
      }
    };

    connectAndSync();

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        activeChannel?.state !== "joined"
      ) {
        connectAndSync();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isStopped = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (activeChannel) {
        if (process.env.NODE_ENV !== "production")
          console.log(t("cleanup_log"));
        activeChannel.unsubscribe();
      }
    };
  }, [isAuthLoaded, userId, user]); // Removed volatile getToken and isInternalAuthReady

  const isPartnerOnline = (partnerId: string) => {
    return onlineUserIds.includes(partnerId);
  };

  return (
    <GlobalPresenceContext.Provider value={{ onlineUserIds, isPartnerOnline }}>
      {children}
    </GlobalPresenceContext.Provider>
  );
};

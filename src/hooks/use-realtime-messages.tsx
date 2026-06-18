import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useUISounds } from "@/hooks/use-ui-sounds";
import {
  supabase,
  setSupabaseAuth,
  createClerkSupabaseClient,
} from "@/lib/supabaseClient";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type ChatMessage = {
  id: number | string;
  senderId: string;
  conversationId: number;
  content: string;
  type?: string;
  fileName?: string;
  gifUrl?: string | null;
  replyToId?: number | null;
  repliedMessage?: {
    content: string;
    senderId: string;
  } | null;
  createdAt: Date;
  read?: boolean;
  sender?: {
    userId: string;
    userName: string | null;
    userImageSrc: string | null;
    isPro?: boolean;
  } | null;
  reactions?: { emoji: string; userId: string }[];
};

type SupabasePresenceState = Record<
  string,
  { isTyping: boolean; online_at: string }[]
>;

export const useRealtimeMessages = (
  initialMessages: ChatMessage[],
  userId: string,
  conversationId: string,
) => {
  const [messages, setMessages] = useState(initialMessages);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playPop } = useUISounds();
  const { getToken } = useAuth();

  // Sync server messages when they update (e.g. after a router.refresh() or mutation)
  useEffect(() => {
    setMessages((prev) => {
      // Keep any optimistic temporary messages that are currently in flight
      const tempMessages = prev.filter((m) =>
        m.id?.toString().startsWith("temp-"),
      );

      // Combine server messages with temp messages, avoiding duplicates by ID
      const newMessages = [...initialMessages];

      tempMessages.forEach((temp) => {
        if (
          !newMessages.some(
            (m) => m.id === temp.id || m.content === temp.content,
          )
        ) {
          newMessages.push(temp); // temp messages are newest, add to bottom (since order is asc)
        }
      });

      return newMessages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    });
  }, [initialMessages]);

  useEffect(() => {
    if (!conversationId || !userId) return;

    let isStopped = false;

    const initChat = async () => {
      if (
        channelRef.current?.state === "joined" &&
        channelRef.current.topic.includes(conversationId)
      ) {
        return;
      }

      try {
        const token = await getToken({ template: "supabase" });
        if (!token || isStopped) return;

        // Use a transient client to prevent TIMED_OUT errors with Clerk singleton issues
        const client = createClerkSupabaseClient(token);

        const channel = client.channel(`chat_${conversationId}`, {
          config: { presence: { key: userId } },
        });

        channel.on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            if (process.env.NODE_ENV !== "production")
              console.log(
                "[RealtimeChat] 📡 EVENTO DETETADO NA TABELA!",
                payload.eventType,
                payload,
              );

            const newMsg = payload.new as Record<string, unknown> | null;
            if (!newMsg) {
              console.warn(
                "[RealtimeChat] ⚠️ Evento recebido mas SEM DADOS (Payload vazio). Pode ser RLS!",
              );
              return;
            }

            if (process.env.NODE_ENV !== "production")
              console.log("[RealtimeChat] ✅ Mensagem válida! Atualizando...");

            // Check if it's an update (like marking as read)
            if (payload.eventType === "UPDATE") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === newMsg.id
                    ? { ...m, read: newMsg.read as boolean }
                    : m,
                ),
              );
              return;
            }

            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              if (newMsg.sender_id !== userId) playPop();
              return [
                ...prev.filter((m) => !m.id?.toString().startsWith("temp-")),
                {
                  id: newMsg.id as number,
                  senderId: newMsg.sender_id as string,
                  conversationId: newMsg.conversation_id as number, // UUID is sent back correctly via filter
                  content: newMsg.content as string,
                  type: newMsg.type as string | undefined,
                  createdAt: new Date(
                    (newMsg.created_at as string) || Date.now(),
                  ),
                  read: newMsg.read as boolean | undefined,
                },
              ];
            });
          },
        );

        channel.on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "message_reactions",
          },
          (payload) => {
            console.log("[RealtimeChat] Reação recebida!", payload);

            if (payload.eventType === "DELETE") {
              const oldReaction = payload.old as Record<string, unknown>;
              if (!oldReaction || !oldReaction.message_id) return;
              setMessages((prev) =>
                prev.map((m) =>
                  Number(m.id) === Number(oldReaction.message_id)
                    ? {
                        ...m,
                        reactions: m.reactions?.filter(
                          (r) =>
                            r.emoji !== oldReaction.emoji ||
                            r.userId !== oldReaction.user_id,
                        ),
                      }
                    : m,
                ),
              );
              return;
            }

            const reaction = payload.new as Record<string, unknown>;
            if (!reaction || !reaction.message_id) return;

            setMessages((prev) =>
              prev.map((m) => {
                if (Number(m.id) === Number(reaction.message_id)) {
                  const existing = m.reactions || [];
                  const filtered = existing.filter(
                    (r) =>
                      !(
                        r.emoji === reaction.emoji &&
                        r.userId === reaction.user_id
                      ),
                  );
                  return {
                    ...m,
                    reactions: [
                      ...filtered,
                      {
                        emoji: reaction.emoji as string,
                        userId: reaction.user_id as string,
                      },
                    ],
                  };
                }
                return m;
              }),
            );
          },
        );

        channel.on("presence", { event: "sync" }, () => {
          const state = channel.presenceState() as SupabasePresenceState;
          const others = Object.keys(state).filter((k) => k !== userId);
          setIsPartnerTyping(others.some((uid) => state[uid]?.[0]?.isTyping));
        });

        channel.subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            if (process.env.NODE_ENV !== "production")
              console.log(`[RealtimeChat] 🟢 CANAL ATIVO: ${conversationId}`);
            await channel.track({ isTyping: false });
          }
        });

        channelRef.current = channel;
      } catch (err) {
        console.error("[RealtimeChat] Erro fatal:", err);
      }
    };

    initChat();

    return () => {
      isStopped = true;
      if (channelRef.current) {
        if (process.env.NODE_ENV !== "production")
          console.log(`[RealtimeChat] 🔴 Fechando canal ${conversationId}`);
        // We use the singleton's method or the channel's method to unsubscribe
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [conversationId, userId, playPop, getToken]);

  const trackTyping = useCallback((isTyping: boolean) => {
    if (channelRef.current && channelRef.current.state === "joined") {
      if (process.env.NODE_ENV !== "production")
        console.log(`[RealtimeChat] ⌨️ Tracking typing: ${isTyping}`);
      channelRef.current
        .track({ isTyping, online_at: new Date().toISOString() })
        .catch((err) => {
          console.error("[RealtimeChat] ❌ Falha no trackTyping", err);
        });
    } else {
      console.warn(
        `[RealtimeChat] ⚠️ trackTyping ignorado. Canal estado: ${channelRef.current?.state}`,
      );
    }
  }, []);

  const addOptimisticMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  return { messages, addOptimisticMessage, isPartnerTyping, trackTyping };
};

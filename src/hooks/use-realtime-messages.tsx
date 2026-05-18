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

  useEffect(() => {
    setMessages(initialMessages);
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

        await setSupabaseAuth(token);
        supabase.realtime.setAuth(token);

        const channel = supabase.channel(`chat_${conversationId}`, {
          config: { presence: { key: userId } },
        });

        channel.on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
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

            const msgConvId = String(
              newMsg.conversation_id || "",
            ).toLowerCase();
            const currentConvId = String(conversationId).toLowerCase();

            if (msgConvId === currentConvId) {
              if (process.env.NODE_ENV !== "production")
                console.log(
                  "[RealtimeChat] ✅ Mensagem válida! Atualizando...",
                );
              setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                if (newMsg.sender_id !== userId) playPop();
                return [
                  ...prev.filter((m) => !m.id?.toString().startsWith("temp-")),
                  {
                    id: newMsg.id as number,
                    senderId: newMsg.sender_id as string,
                    conversationId: Number(newMsg.conversation_id),
                    content: newMsg.content as string,
                    type: newMsg.type as string | undefined,
                    createdAt: new Date(
                      (newMsg.created_at as string) || Date.now(),
                    ),
                    read: newMsg.read as boolean | undefined,
                  },
                ];
              });
            } else {
              if (process.env.NODE_ENV !== "production")
                console.log(
                  `[RealtimeChat] ⏭️ Ignorada: Conv ${msgConvId} != ${currentConvId}`,
                );
            }
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
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [conversationId, userId, playPop]);

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

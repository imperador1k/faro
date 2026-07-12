"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { onSearchUsers } from "@/actions/user-actions";
import { Search, Loader2, Users, UserPlus, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateGroupModal } from "@/components/modals/create-group-modal";
import { NewChatModal } from "@/components/modals/new-chat-modal";
import { useGlobalPresence } from "@/components/providers/global-presence-provider";
import { useAuth } from "@clerk/nextjs";
import { createClerkSupabaseClient } from "@/lib/supabaseClient";
import { useUISounds } from "@/hooks/use-ui-sounds";
import { decryptMessage, decryptConversationKey } from "@/lib/crypto";
import { getConversationKey } from "@/actions/crypto";
import localforage from "localforage";
import { useTranslations } from "next-intl";

type Conversation = {
  id: string;
  name: string | null;
  isGroup: boolean;
  groupImageUrl?: string | null;
  partner: {
    userId: string;
    userName: string;
    userImageSrc: string | null;
    isPro?: boolean;
  } | null;
  participants: {
    userId: string;
    userName: string | null;
    userImageSrc: string | null;
    isPro?: boolean;
  }[];
  lastMessage: {
    id: number;
    content: string;
    createdAt: Date;
    senderId: string;
    read: boolean;
  } | null;
  unreadCount: number;
  updatedAt: Date;
};

type Props = {
  conversations: Conversation[];
};

function LastMessagePreview({
  conversationId,
  message,
}: {
  conversationId: string;
  message: NonNullable<Conversation["lastMessage"]>;
}) {
  const t = useTranslations("chat");
  const [decryptedText, setDecryptedText] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (message.content.startsWith("[e2ee-v2]:")) {
      const decrypt = async () => {
        try {
          const ciphertext = message.content.replace("[e2ee-v2]:", "");
          let conversationKey: CryptoKey | null = null;
          const localRoomKeys =
            (await localforage.getItem<Record<string, CryptoKey>>(
              "e2e_room_keys",
            )) || {};
          conversationKey = localRoomKeys[conversationId];

          if (!conversationKey) {
            const encryptedRoomKeyBase64 =
              await getConversationKey(conversationId);
            if (encryptedRoomKeyBase64) {
              const myPrivateKey =
                await localforage.getItem<CryptoKey>("e2e_private_key");
              if (myPrivateKey) {
                conversationKey = await decryptConversationKey(
                  encryptedRoomKeyBase64,
                  myPrivateKey,
                );
                localRoomKeys[conversationId] = conversationKey;
                await localforage.setItem("e2e_room_keys", localRoomKeys);
              }
            }
          }

          if (conversationKey) {
            const text = await decryptMessage(ciphertext, conversationKey);
            if (isMounted) setDecryptedText(text);
          }
        } catch (error) {
          console.error("Preview decryption failed", error);
        }
      };
      decrypt();
    }

    return () => {
      isMounted = false;
    };
  }, [message.content, conversationId]);

  const isOldSignalMsg = message.content.startsWith("[e2ee]:");
  const displayContent =
    decryptedText ??
    (isOldSignalMsg ? t("encrypted_message") : message.content);

  return (
    <>
      {message.senderId === "me" && t("you_label")}
      {displayContent}
    </>
  );
}

export const ChatSidebar = ({ conversations }: Props) => {
  const t = useTranslations("chat");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeConversationId = searchParams.get("conversationId");
  const { isPartnerOnline } = useGlobalPresence();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!query) {
        setResults([]);
        return;
      }
      setLoading(true);
      const data = await onSearchUsers(query);
      setResults(data);
      setLoading(false);
    };

    const timeoutId = setTimeout(fetchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isPending, startTransition] = useTransition();

  const { userId, getToken } = useAuth();
  const { playPop } = useUISounds();

  const [localConversations, setLocalConversations] = useState(conversations);

  useEffect(() => {
    setLocalConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    let isStopped = false;
    let channel: any = null;

    const initGlobalInbox = async () => {
      const token = await getToken({ template: "supabase" });
      if (!token || isStopped) return;

      const client = createClerkSupabaseClient(token);
      channel = client.channel("global_inbox");

      channel.on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload: any) => {
          const newMsg = payload.new;
          if (!newMsg) return;

          setLocalConversations((prev) => {
            const convIndex = prev.findIndex(
              (c) => c.id === newMsg.conversation_id,
            );
            if (convIndex === -1) {
              startTransition(() => {
                router.refresh();
              });
              return prev;
            }

            const updated = [...prev];
            const conv = updated[convIndex];
            const isFromMe = newMsg.sender_id === userId;
            const isActiveConv =
              activeConversationId === newMsg.conversation_id;

            let newUnread = conv.unreadCount;
            if (!isFromMe && !isActiveConv) {
              newUnread += 1;
              playPop();
            }

            updated[convIndex] = {
              ...conv,
              lastMessage: {
                id: newMsg.id,
                content: newMsg.content,
                createdAt: new Date(newMsg.created_at || Date.now()),
                senderId: newMsg.sender_id,
                read: newMsg.read || false,
              },
              unreadCount: newUnread,
              updatedAt: new Date(newMsg.created_at || Date.now()),
            };

            return updated.sort(
              (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
            );
          });
        },
      );

      channel.on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload: any) => {
          const newMsg = payload.new;
          if (!newMsg || !newMsg.read) return;

          setLocalConversations((prev) => {
            const convIndex = prev.findIndex(
              (c) => c.id === newMsg.conversation_id,
            );
            if (convIndex === -1) return prev;

            const updated = [...prev];
            const conv = updated[convIndex];
            const lm = conv.lastMessage;
            if (lm && lm.id === newMsg.id) {
              updated[convIndex] = {
                ...conv,
                lastMessage: {
                  ...lm,
                  read: true,
                  id: lm.id as number,
                  content: lm.content as string,
                  createdAt: lm.createdAt as Date,
                  senderId: lm.senderId as string,
                },
              };
            }
            return updated;
          });
        },
      );

      channel.subscribe();
    };

    initGlobalInbox();

    return () => {
      isStopped = true;
      if (channel) channel.unsubscribe();
    };
  }, [userId, activeConversationId, getToken, playPop, router]);

  const onSelectConversation = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("conversationId", id);
    params.delete("userId");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const onSelectUser = async (userId: string) => {
    setQuery("");
    setResults([]);
    try {
      const { createConversation } = await import("@/actions/messages");
      const conversationId = await createConversation([userId], false);
      const params = new URLSearchParams(searchParams);
      params.set("conversationId", conversationId);
      router.push(`${pathname}?${params.toString()}`);
    } catch (error) {
      console.error("Erro ao iniciar conversa:", error);
    }
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col bg-stone-50 dark:bg-slate-900 h-full",
        activeConversationId ? "hidden md:flex md:w-[380px]" : "w-full",
      )}
    >
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
      />

      <div className="p-6 border-b-2 border-stone-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-6 z-20 relative">
        <h1 className="text-2xl font-black text-stone-800 dark:text-slate-100 tracking-tight">
          {t("title")}
        </h1>

        <div className="flex gap-3">
          <Button
            onClick={() => setIsNewChatModalOpen(true)}
            variant="default"
            className="flex-1 font-black text-sm uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {t("new_message")}
          </Button>
          <Button
            onClick={() => setIsGroupModalOpen(true)}
            variant="outline"
            className="rounded-xl px-4 flex items-center justify-center"
          >
            <Users className="w-5 h-5" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 dark:text-slate-500" />
          <input
            id="chat-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full pl-11 pr-4 py-3 bg-stone-100 dark:bg-slate-800 rounded-2xl text-[15px] font-bold text-stone-700 dark:text-slate-200 placeholder:text-stone-400 dark:text-slate-500 border-2 border-stone-200 dark:border-slate-800 border-b-[4px] outline-none focus:bg-white dark:bg-slate-900 focus:border-[#1CB0F6] transition-all"
          />
          {query && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border-2 border-stone-200 dark:border-slate-800 border-b-[6px] z-50 overflow-hidden max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="p-6 flex justify-center text-[#1CB0F6]">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : results.length === 0 ? (
                <div className="p-6 text-center text-stone-400 dark:text-slate-500 font-bold text-sm">
                  {t("no_users_found")}
                </div>
              ) : (
                results.map((user) => (
                  <div
                    key={user.userId}
                    onClick={() => onSelectUser(user.userId)}
                    className="flex items-center gap-4 p-4 hover:bg-stone-50 dark:bg-slate-950 active:bg-stone-100 dark:bg-slate-800 cursor-pointer transition border-b-2 border-stone-100 last:border-b-0"
                  >
                    <div className="relative h-10 w-10 rounded-[12px] border-2 border-stone-200 dark:border-slate-800 overflow-hidden flex-shrink-0 bg-stone-100 dark:bg-slate-800">
                      {user.userImageSrc ? (
                        <Image
                          src={user.userImageSrc}
                          alt={user.userName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-black text-stone-400 dark:text-slate-500">
                          {user.userName[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-black text-stone-800 dark:text-slate-100 truncate">
                        {user.userName}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pb-[120px] md:pb-4 flex flex-col gap-3 scrollbar-hide">
        {localConversations.length === 0 && !query && (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-stone-200 dark:border-slate-800 border-b-4 mt-4">
            <span className="text-4xl">📭</span>
            <h3 className="text-lg font-black text-stone-700 dark:text-slate-200 mt-4">
              {t("empty_title")}
            </h3>
            <p className="text-sm font-bold text-stone-400 dark:text-slate-500 mt-2">
              {t("empty_description")}
            </p>
          </div>
        )}
        {localConversations.map((conv: Conversation) => {
          const isActive = activeConversationId === conv.id;
          const displayName = conv.isGroup ? conv.name : conv.partner?.userName;

          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={cn(
                "flex items-start gap-4 p-4 rounded-2xl border-2 border-b-4 cursor-pointer transition-all hover:-translate-y-1 active:translate-y-1 active:border-b-2",
                isActive
                  ? "bg-blue-50 dark:bg-sky-950 border-[#1CB0F6] border-b-[#1CB0F6] text-stone-800 dark:text-slate-100 shadow-md"
                  : "bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800",
              )}
            >
              <div className="h-14 w-14 shrink-0 relative flex items-center justify-center">
                {conv.isGroup ? (
                  conv.groupImageUrl ? (
                    <Image
                      src={conv.groupImageUrl}
                      alt={conv.name || "Group"}
                      fill
                      className="object-cover rounded-full border-2 border-white"
                    />
                  ) : (
                    <div className="flex -space-x-4 items-center h-full w-full justify-center">
                      {conv.participants.slice(0, 2).map((p, idx) => (
                        <div
                          key={p.userId}
                          className={cn(
                            "h-10 w-10 rounded-full border-2 border-white overflow-hidden bg-stone-100 dark:bg-slate-800 shadow-sm relative shrink-0",
                            idx === 1 && "z-10",
                          )}
                        >
                          {p.userImageSrc ? (
                            <Image
                              src={p.userImageSrc}
                              alt={p.userName || ""}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-black text-stone-400 dark:text-slate-500">
                              {p.userName?.[0] || "?"}
                            </div>
                          )}
                        </div>
                      ))}
                      {conv.participants.length > 2 && (
                        <div className="h-10 w-10 rounded-full border-2 border-white bg-stone-50 dark:bg-slate-950 flex items-center justify-center text-[10px] font-black text-stone-500 dark:text-slate-400 z-20 shadow-sm shrink-0">
                          +{conv.participants.length - 2}
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div
                    className={cn(
                      "relative h-14 w-14 rounded-[16px] border-2 overflow-hidden shrink-0 flex items-center justify-center shadow-sm",
                      isActive
                        ? "border-[#1CB0F6] bg-white dark:bg-slate-900"
                        : "border-stone-200 dark:border-slate-800 bg-stone-100 dark:bg-slate-800",
                    )}
                  >
                    {conv.partner?.userImageSrc ? (
                      <Image
                        src={conv.partner.userImageSrc}
                        alt={conv.partner.userName}
                        fill
                        className="object-cover rounded-[14px]"
                      />
                    ) : (
                      <span
                        className={cn(
                          "text-xl font-black",
                          isActive
                            ? "text-[#1CB0F6]"
                            : "text-stone-400 dark:text-slate-500",
                        )}
                      >
                        {conv.partner?.userName?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                )}
                {!conv.isGroup &&
                  conv.partner &&
                  isPartnerOnline(conv.partner.userId) && (
                    <span className="w-3.5 h-3.5 bg-[#58CC02] rounded-full border-2 border-white absolute -bottom-0.5 -right-0.5 z-10 shadow-sm"></span>
                  )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col pt-0.5">
                <div className="flex justify-between items-baseline mb-1">
                  <span
                    className={cn(
                      "truncate text-[15px] font-black flex items-center",
                      isActive
                        ? "text-[#1CB0F6]"
                        : "text-stone-800 dark:text-slate-100",
                    )}
                  >
                    <span className="truncate">{displayName}</span>
                    {!conv.isGroup && conv.partner?.isPro && (
                      <BadgeCheck
                        className="h-4 w-4 text-amber-500 fill-amber-300 ml-1 shrink-0 inline-block"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold",
                      isActive
                        ? "text-[#1CB0F6]/70"
                        : "text-stone-400 dark:text-slate-500",
                    )}
                  >
                    {mounted && conv.lastMessage
                      ? new Date(
                          conv.lastMessage.createdAt,
                        ).toLocaleDateString()
                      : mounted
                        ? t("new_status")
                        : ""}
                  </span>
                </div>
                <div className="flex justify-between items-center pr-1 mt-1">
                  <p
                    className={cn(
                      "text-[13px] font-bold truncate mr-3",
                      isActive
                        ? "text-stone-600 dark:text-slate-300"
                        : conv.unreadCount > 0 &&
                            conv.lastMessage?.senderId !== "me"
                          ? "text-stone-900 dark:text-slate-200"
                          : "text-stone-400 dark:text-slate-500",
                    )}
                  >
                    {conv.lastMessage ? (
                      <LastMessagePreview
                        conversationId={conv.id}
                        message={conv.lastMessage}
                      />
                    ) : (
                      t("start_conversation")
                    )}
                  </p>
                  {conv.unreadCount > 0 && (
                    <div
                      className={cn(
                        "flex h-6 min-w-[24px] items-center justify-center rounded-xl px-2 text-[11px] font-black shadow-sm bg-[#1CB0F6] text-white",
                      )}
                    >
                      {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

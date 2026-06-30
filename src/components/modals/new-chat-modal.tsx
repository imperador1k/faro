"use client";

import { useTranslations } from "next-intl";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UserPlus, Loader2, MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createConversation, getFriendsAction } from "@/actions/messages";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const NewChatModal = ({ isOpen, onClose }: Props) => {
  const t = useTranslations("modals");
  const router = useRouter();
  const [friends, setFriends] = useState<
    { userId: string; userName: string; userImageSrc: string | null }[]
  >([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchFriends = async () => {
        setIsLoadingFriends(true);
        try {
          const data = await getFriendsAction();
          // map to following user data
          setFriends(
            data
              .map(
                (f: {
                  following: {
                    userId: string;
                    userName: string;
                    userImageSrc: string | null;
                  };
                }) => f.following,
              )
              .filter(Boolean),
          );
        } catch (error) {
          console.error("Error fetching friends:", error);
        } finally {
          setIsLoadingFriends(false);
        }
      };
      fetchFriends();
    }
  }, [isOpen]);

  const onSelectFriend = async (userId: string, userName: string) => {
    setIsSubmitting(userId);
    try {
      const conversationId = await createConversation([userId], false);

      toast.success(t("toast_success_title"), {
        description: t("toast_success_desc", { userName }),
        icon: (
          <div className="bg-blue-100 p-1.5 rounded-full">
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
        ),
      });

      onClose();
      router.push(`/messages?conversationId=${conversationId}`);
    } catch (error) {
      toast.error(t("toast_error_title"), {
        description: t("toast_error_desc"),
      });
      console.error(error);
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="z-modal max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none [&>button]:hidden">
        <div className="relative bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col p-6 md:p-8">
          {/* Custom Close Button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-4 hover:bg-stone-50 dark:bg-slate-950 active:translate-y-1 active:border-b-0 transition-all z-50 group"
          >
            <X className="w-5 h-5 text-stone-400 dark:text-slate-500 dark:text-slate-400 group-hover:text-stone-600 dark:text-slate-300 transition-colors" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-green-100 p-3 rounded-2xl">
              <UserPlus className="w-6 h-6 text-[#58CC02]" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-stone-800 dark:text-slate-100 tracking-tight">
                {t("title")}
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Friend Selection */}
          <div className="space-y-3">
            <label className="text-xs font-black text-stone-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
              {t("choose_friend")}
            </label>
            <div className="max-h-80 overflow-y-auto pr-2 flex flex-col gap-2 scrollbar-hide">
              {isLoadingFriends ? (
                <div className="flex justify-center py-12 text-stone-300">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-12 px-4 bg-stone-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-stone-200 dark:border-slate-800">
                  <p className="text-stone-400 dark:text-slate-500 dark:text-slate-400 font-bold text-sm">
                    {t("no_friends")}
                  </p>
                </div>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.userId}
                    onClick={() =>
                      !isSubmitting &&
                      onSelectFriend(friend.userId, friend.userName)
                    }
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border-2 border-stone-100 cursor-pointer transition-all hover:border-[#1CB0F6] hover:bg-blue-50/30 group active:translate-y-1 active:border-b-2",
                      isSubmitting === friend.userId &&
                        "border-[#1CB0F6] bg-blue-50/50",
                      isSubmitting &&
                        isSubmitting !== friend.userId &&
                        "opacity-50 pointer-events-none",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-[14px] border-2 border-stone-200 dark:border-slate-800 overflow-hidden bg-stone-100 dark:bg-slate-800 shadow-sm group-hover:border-[#1CB0F6] transition-colors">
                        {friend.userImageSrc ? (
                          <Image
                            src={friend.userImageSrc}
                            alt={friend.userName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center font-black text-stone-400 dark:text-slate-500 dark:text-slate-400 uppercase">
                            {friend.userName[0]}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-stone-800 dark:text-slate-100 group-hover:text-[#1CB0F6] transition-colors">
                          {friend.userName}
                        </span>
                        <span className="text-xs font-bold text-stone-400 dark:text-slate-500 dark:text-slate-400">
                          {t("online_recently")}
                        </span>
                      </div>
                    </div>

                    {isSubmitting === friend.userId ? (
                      <Loader2 className="w-5 h-5 animate-spin text-[#1CB0F6]" />
                    ) : (
                      <div className="h-8 w-8 rounded-xl bg-stone-100 dark:bg-slate-800 flex items-center justify-center text-stone-400 dark:text-slate-500 dark:text-slate-400 group-hover:bg-[#1CB0F6] group-hover:text-white transition-all shadow-sm">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Hint */}
          <div className="mt-8 pt-6 border-t-2 border-stone-100 text-center">
            <p className="text-[13px] font-bold text-stone-400 dark:text-slate-500 dark:text-slate-400">
              {t("search_hint")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

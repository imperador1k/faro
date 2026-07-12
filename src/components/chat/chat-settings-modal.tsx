import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  X,
  Image as ImageIcon,
  ShieldCheck,
  Users,
  Search,
  Trash2,
  LogOut,
  ChevronRight,
  BellOff,
  Clock,
  Ban,
  Flag,
  Phone,
  Video,
  ArrowLeft,
  Pencil,
  Save,
  File,
  MoreVertical,
  Star,
  AlertTriangle,
  UserPlus,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { type ChatMessage } from "@/hooks/use-realtime-messages";
import { cn } from "@/lib/utils";
import { useState, useTransition, useRef, useEffect } from "react";
import {
  clearHistory,
  updateGroupInfo,
  kickParticipant,
  leaveGroup,
  promoteToAdmin,
  getFriendsAction,
  addParticipants,
} from "@/actions/messages";
import { getE2EPublicKeys } from "@/actions/crypto";
import {
  generateConversationKey,
  encryptConversationKeyForUser,
  importPublicKey,
} from "@/lib/crypto";
import localforage from "localforage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isGroup?: boolean;
  groupName?: string | null;
  partner?: {
    userId: string;
    userName: string;
    userImageSrc: string | null;
    isPro?: boolean;
  } | null;
  participants: {
    userId: string;
    userName: string | null;
    userImageSrc: string | null;
    role?: string;
  }[];
  messages: ChatMessage[];
  conversationId: string;
  isPartnerOnline: boolean;
  groupImageUrl?: string | null;
};

type ConfirmAction = {
  type: "promote" | "kick" | "leave";
  targetId?: string;
  targetName?: string;
} | null;

export const ChatSettingsModal = ({
  isOpen,
  onClose,
  isGroup,
  groupName,
  partner,
  participants,
  messages,
  conversationId,
  isPartnerOnline,
  groupImageUrl,
}: ChatSettingsModalProps) => {
  const t = useTranslations("chat");
  const router = useRouter();
  const { userId: currentUserId } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [viewMode, setViewMode] = useState<
    "settings" | "media" | "edit-group" | "add-member"
  >("settings");
  const [managingUserId, setManagingUserId] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmAction>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [friends, setFriends] = useState<
    { userId: string; userName: string; userImageSrc: string | null }[]
  >([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [isSubmittingMembers, setIsSubmittingMembers] = useState(false);

  const [editGroupName, setEditGroupName] = useState(groupName || "");
  const [editGroupImageUrl, setEditGroupImageUrl] = useState(
    groupImageUrl || "",
  );

  const myRole = participants.find((p) => p.userId === currentUserId)?.role;
  const isAdmin = isGroup && myRole === "admin";

  const handleClearHistory = () => {
    startTransition(() => {
      clearHistory(conversationId)
        .then(() => toast.success(t("toast_clear_success")))
        .catch(() => toast.error(t("toast_clear_error")));
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // We only accept images
    if (!file.type.startsWith("image/")) {
      toast.error(t("toast_invalid_image"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 256; // 256x256 px is plenty for a chat avatar

        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Export as highly compressed JPEG
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setEditGroupImageUrl(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveGroupInfo = () => {
    if (!isAdmin) return;

    startTransition(() => {
      updateGroupInfo(conversationId, editGroupName, editGroupImageUrl)
        .then(() => {
          toast.success(t("toast_update_success"));
          setViewMode("settings");
        })
        .catch(() => toast.error(t("toast_update_error")));
    });
  };

  const handlePromoteToAdmin = (
    e: React.MouseEvent,
    targetUserId: string,
    targetName: string,
  ) => {
    e.preventDefault();
    if (!isAdmin) return;
    setConfirmState({ type: "promote", targetId: targetUserId, targetName });
  };

  const handleKick = (
    e: React.MouseEvent,
    targetUserId: string,
    targetName: string,
  ) => {
    e.preventDefault();
    if (!isAdmin) return;
    setConfirmState({ type: "kick", targetId: targetUserId, targetName });
  };

  const handleLeaveGroup = () => {
    setConfirmState({ type: "leave" });
  };

  const executeConfirmAction = async () => {
    if (!confirmState) return;

    if (confirmState.type === "promote" && confirmState.targetId) {
      startTransition(() => {
        promoteToAdmin(conversationId, confirmState.targetId!)
          .then(() => {
            toast.success(t("toast_promote_success"));
            setManagingUserId(null);
            setConfirmState(null);
          })
          .catch(() => toast.error(t("toast_promote_error")));
      });
    }

    if (confirmState.type === "kick" && confirmState.targetId) {
      startTransition(async () => {
        try {
          const targetUserId = confirmState.targetId!;
          // 1. Get remaining participants (excluding the kicked one)
          const remainingParticipants = participants.filter(
            (p) => p.userId !== targetUserId,
          );
          const remainingUserIds = remainingParticipants.map((p) => p.userId);

          // 2. Fetch their public keys
          const publicKeys = await getE2EPublicKeys(remainingUserIds);

          // 3. Generate a new Room Key
          const newRoomKey = await generateConversationKey();

          // 4. Encrypt for all remaining
          const newKeys: { userId: string; encryptedRoomKey: string }[] = [];
          for (const pk of publicKeys) {
            if (pk.e2ePublicKey) {
              const importedPub = await importPublicKey(pk.e2ePublicKey);
              const encryptedStr = await encryptConversationKeyForUser(
                newRoomKey,
                importedPub,
              );
              newKeys.push({
                userId: pk.userId,
                encryptedRoomKey: encryptedStr,
              });
            }
          }

          // 5. Save the new key locally for the admin
          const localRoomKeys =
            (await localforage.getItem<Record<string, CryptoKey>>(
              "e2e_room_keys",
            )) || {};
          localRoomKeys[conversationId] = newRoomKey;
          await localforage.setItem("e2e_room_keys", localRoomKeys);

          // 6. Execute Kick & Rotation
          await kickParticipant(conversationId, targetUserId, newKeys);
          toast.success(t("toast_kick_success"));
          setConfirmState(null);
        } catch (error) {
          console.error(error);
          toast.error(t("toast_kick_error"));
        }
      });
    }

    if (confirmState.type === "leave") {
      startTransition(() => {
        leaveGroup(conversationId)
          .then(() => {
            toast.success(t("toast_leave_success"));
            setConfirmState(null);
            router.push("/messages");
          })
          .catch(() => toast.error(t("toast_leave_error")));
      });
    }
  };

  const handleAddMembers = async () => {
    if (selectedFriends.length === 0 || !isAdmin) return;

    setIsSubmittingMembers(true);
    try {
      // 1. Get current Room Key
      const localRoomKeys =
        (await localforage.getItem<Record<string, CryptoKey>>(
          "e2e_room_keys",
        )) || {};
      const currentRoomKey = localRoomKeys[conversationId];

      if (!currentRoomKey) throw new Error(t("error_key_not_found"));

      // 2. Fetch public keys of selected friends
      const publicKeys = await getE2EPublicKeys(selectedFriends);

      // 3. Encrypt the current Room Key for the new members
      const newParticipantsWithKeys: {
        userId: string;
        encryptedRoomKey: string;
      }[] = [];
      for (const pk of publicKeys) {
        if (pk.e2ePublicKey) {
          const importedPub = await importPublicKey(pk.e2ePublicKey);
          const encryptedStr = await encryptConversationKeyForUser(
            currentRoomKey,
            importedPub,
          );
          newParticipantsWithKeys.push({
            userId: pk.userId,
            encryptedRoomKey: encryptedStr,
          });
        }
      }

      // 4. Send to backend
      await addParticipants(conversationId, newParticipantsWithKeys);
      toast.success(t("toast_add_members_success"));
      setViewMode("settings");
      setSelectedFriends([]);
    } catch (error) {
      console.error(error);
      toast.error(t("toast_add_members_error"));
    } finally {
      setIsSubmittingMembers(false);
    }
  };

  const toggleFriend = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    if (viewMode === "add-member") {
      const fetchFriends = async () => {
        setIsLoadingFriends(true);
        try {
          const data = await getFriendsAction();
          // Filter out users already in the group
          const existingIds = participants.map((p) => p.userId);
          setFriends(
            data
              .map((f: any) => f.following)
              .filter(Boolean)
              .filter((f: any) => !existingIds.includes(f.userId)),
          );
        } catch (error) {
          console.error("Error fetching friends:", error);
        } finally {
          setIsLoadingFriends(false);
        }
      };
      fetchFriends();
    }
  }, [viewMode, participants]);

  // Filter for media messages (images and gifs)
  const mediaMessages = messages.filter(
    (m) =>
      m.type === "image" ||
      m.type === "gif" ||
      (typeof m.content === "string" && m.content.includes("giphy.com/media")),
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (confirmState)
            setConfirmState(null); // Cancel confirm when closing
          else onClose();
        }
      }}
    >
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] h-[100dvh] sm:h-[90vh] w-full sm:w-[500px] md:w-[600px] max-w-full p-0 sm:rounded-[2.5rem] border-0 sm:border-4 sm:border-white dark:sm:border-slate-800 flex flex-col overflow-hidden bg-[#f4f6f8] dark:bg-slate-950 shadow-[0_0_80px_rgba(0,0,0,0.15)] z-[100] duration-300 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>

        {confirmState && (
          <div className="absolute inset-0 bg-[#f4f6f8]/80 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm w-full max-w-[320px] flex flex-col items-center text-center border-2 border-stone-100 dark:border-slate-800 relative">
              <div
                className={cn(
                  "w-20 h-20 rounded-[2rem] flex items-center justify-center mb-5 rotate-[-5deg]",
                  confirmState.type === "promote"
                    ? "bg-amber-100 text-amber-500"
                    : "bg-rose-100 text-rose-500",
                )}
              >
                {confirmState.type === "promote" ? (
                  <Star className="w-10 h-10 fill-current" />
                ) : (
                  <AlertTriangle className="w-10 h-10" />
                )}
              </div>
              <h2 className="text-xl font-black text-stone-800 dark:text-slate-100 mb-2">
                {t(`confirm.${confirmState.type}.title`)}
              </h2>
              <p className="text-sm text-stone-400 dark:text-slate-500 dark:text-slate-400 font-bold mb-8">
                {t.rich(`confirm.${confirmState.type}.message`, {
                  target: confirmState.targetName || "",
                })}
              </p>
              <div className="flex w-full gap-3">
                <Button
                  onClick={() => setConfirmState(null)}
                  disabled={isPending}
                  variant="ghost"
                  className="flex-1 py-3 rounded-2xl font-bold active:scale-95"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={executeConfirmAction}
                  disabled={isPending}
                  variant="destructive"
                  className={cn(
                    "flex-1 py-3 rounded-2xl font-bold active:scale-95 flex justify-center items-center",
                    confirmState.type === "promote"
                      ? "bg-amber-500 hover:bg-amber-400 border-amber-600"
                      : "bg-rose-500 hover:bg-rose-400 border-rose-600",
                  )}
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Confirmar"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {viewMode === "media" ? (
          <>
            <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 shrink-0 z-10 sticky top-0 shadow-sm">
              <div className="flex items-center gap-3">
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="p-2 -ml-2 rounded-2xl"
                >
                  <X className="h-6 w-6" />
                </Button>
                <span className="font-black text-stone-800 dark:text-slate-100 text-lg tracking-tight">
                  Info da Conversa
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-1 bg-white dark:bg-slate-900">
              {mediaMessages.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {mediaMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square bg-stone-100 dark:bg-slate-800 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={msg.content || ""}
                        alt="Media"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 flex flex-col items-center justify-center text-center mt-20">
                  <File className="h-12 w-12 text-stone-200 mb-4" />
                  <p className="text-base font-bold text-stone-400 dark:text-slate-500 dark:text-slate-400">
                    Nenhuma média partilhada
                  </p>
                </div>
              )}
            </div>
          </>
        ) : viewMode === "edit-group" ? (
          <>
            {/* Header - Edit Group */}
            <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 shrink-0 z-10 sticky top-0 shadow-sm">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setViewMode("settings")}
                  variant="ghost"
                  size="icon"
                  className="p-2 -ml-2 rounded-2xl"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <span className="font-black text-stone-800 dark:text-slate-100 text-lg tracking-tight">
                  Editar Grupo
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-stone-50 dark:bg-slate-950">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 dark:text-slate-200 uppercase tracking-wider ml-2">
                  Nome do Grupo
                </label>
                <input
                  type="text"
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  placeholder="Ex: Grupo de Estudos"
                  className="w-full p-4 bg-white dark:bg-slate-900 rounded-2xl text-[15px] font-bold text-stone-700 dark:text-slate-200 placeholder:text-stone-400 dark:text-slate-500 dark:text-slate-400 border-2 border-stone-200 dark:border-slate-800 border-b-[4px] outline-none focus:border-[#1CB0F6] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 dark:text-slate-200 uppercase tracking-wider ml-2">
                  Fotografia do Grupo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1 py-3 px-4 font-bold rounded-2xl border-b-[4px] flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="h-5 w-5 text-[#1CB0F6]" />
                    Escolher da Galeria
                  </Button>
                  {editGroupImageUrl && (
                    <Button
                      onClick={() => setEditGroupImageUrl("")}
                      variant="ghost"
                      size="icon"
                      className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100"
                      title="Remover Foto"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>

              {editGroupImageUrl && (
                <div className="space-y-2 flex flex-col items-center pt-4">
                  <label className="text-xs font-bold text-stone-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Pré-visualização
                  </label>
                  <div className="relative h-24 w-24 rounded-[2rem] border-4 border-white shadow-md overflow-hidden bg-stone-200 dark:bg-slate-700">
                    <Image
                      src={editGroupImageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      onError={() => toast.error("Link de imagem inválido")}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleSaveGroupInfo}
                disabled={isPending || !editGroupName.trim()}
                variant="secondary"
                className="w-full py-4 mt-6 font-black rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                {isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </>
        ) : viewMode === "add-member" ? (
          <>
            <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 shrink-0 z-10 sticky top-0 shadow-sm">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setViewMode("settings")}
                  variant="ghost"
                  size="icon"
                  className="p-2 -ml-2 rounded-2xl"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <span className="font-black text-stone-800 dark:text-slate-100 text-lg tracking-tight">
                  Adicionar Membros
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-stone-50 dark:bg-slate-950 flex flex-col">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-stone-100 p-2 flex flex-col gap-1">
                {isLoadingFriends ? (
                  <div className="flex justify-center py-8 text-[#1CB0F6]">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : friends.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 dark:text-slate-500 dark:text-slate-400 font-bold text-sm px-6">
                    Não tens amigos para adicionar ou já estão todos neste
                    grupo.
                  </div>
                ) : (
                  friends.map((friend) => {
                    const isSelected = selectedFriends.includes(friend.userId);
                    return (
                      <div
                        key={friend.userId}
                        onClick={() =>
                          !isSubmittingMembers && toggleFriend(friend.userId)
                        }
                        className={cn(
                          "flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors group",
                          isSelected
                            ? "bg-blue-50/50"
                            : "hover:bg-stone-50 dark:bg-slate-950",
                          isSubmittingMembers &&
                            "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-stone-100 dark:bg-slate-800">
                            {friend.userImageSrc ? (
                              <Image
                                src={friend.userImageSrc}
                                alt={friend.userName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center font-black text-stone-400 dark:text-slate-500 dark:text-slate-400">
                                {friend.userName[0]?.toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-stone-700 dark:text-slate-200 group-hover:text-[#1CB0F6] transition-colors">
                            {friend.userName}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                            isSelected
                              ? "bg-[#1CB0F6] border-[#1CB0F6]"
                              : "bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 group-hover:border-stone-300 dark:border-slate-700",
                          )}
                        >
                          {isSelected && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border-t border-stone-200 dark:border-slate-800 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] sticky bottom-0 z-10">
              <Button
                onClick={handleAddMembers}
                disabled={selectedFriends.length === 0 || isSubmittingMembers}
                variant="default"
                className="w-full py-4 font-black tracking-widest text-sm uppercase rounded-2xl"
              >
                {isSubmittingMembers ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  `Adicionar ${selectedFriends.length > 0 ? `(${selectedFriends.length})` : ""}`
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 shrink-0 z-10 sticky top-0 shadow-sm">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setViewMode("settings")}
                  variant="ghost"
                  size="icon"
                  className="p-2 -ml-2 rounded-2xl"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <span className="font-black text-stone-800 dark:text-slate-100 text-lg tracking-tight">
                  Info da Conversa
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-5 scrollbar-hide">
              {/* Main Profile Info Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-stone-100 dark:border-slate-800 flex flex-col items-center">
                <div className="relative h-28 w-28 shrink-0 flex items-center justify-center rounded-[2rem] border-4 border-white dark:border-slate-900 bg-stone-50 dark:bg-slate-800 overflow-hidden shadow-md mb-5">
                  {isGroup ? (
                    groupImageUrl ? (
                      <Image
                        src={groupImageUrl}
                        alt={groupName || ""}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex -space-x-4 items-center h-full w-full justify-center bg-stone-100 dark:bg-slate-800">
                        {participants.slice(0, 2).map((p, idx) => (
                          <div
                            key={p.userId}
                            className={cn(
                              "h-14 w-14 rounded-full border-4 border-white overflow-hidden bg-stone-200 dark:bg-slate-700 shadow-sm relative shrink-0",
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
                              <div className="flex h-full w-full items-center justify-center text-sm font-black text-stone-400 dark:text-slate-500 dark:text-slate-400">
                                {p.userName?.[0] || "?"}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  ) : partner?.userImageSrc ? (
                    <Image
                      src={partner.userImageSrc}
                      alt={partner.userName}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl font-black text-stone-400 dark:text-slate-500 dark:text-slate-400 uppercase">
                      {partner?.userName?.[0] || "?"}
                    </div>
                  )}
                </div>

                <h2 className="font-black text-stone-800 dark:text-slate-100 text-2xl tracking-tight text-center leading-none">
                  {isGroup ? groupName : partner?.userName}
                </h2>
                <span
                  className={cn(
                    "text-xs font-black uppercase tracking-widest mt-3 px-4 py-1.5 rounded-full border-2",
                    isPartnerOnline || isGroup
                      ? "bg-green-50 border-green-200 text-green-500"
                      : "bg-stone-50 dark:bg-slate-950 border-stone-200 dark:border-slate-800 text-stone-400 dark:text-slate-500 dark:text-slate-400",
                  )}
                >
                  {isGroup
                    ? `${participants.length} membros`
                    : isPartnerOnline
                      ? "Online"
                      : "Visto recentemente"}
                </span>

                {isAdmin && (
                  <Button
                    onClick={() => {
                      setEditGroupName(groupName || "");
                      setEditGroupImageUrl(groupImageUrl || "");
                      setViewMode("edit-group");
                    }}
                    variant="ghost"
                    className="mt-5 w-full py-3 rounded-xl font-bold"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar Perfil do Grupo
                  </Button>
                )}

                {/* Quick Actions (Audio / Video / Search) */}
                <div className="flex items-center gap-4 mt-6 w-full justify-center">
                  <Button variant="ghost" className="flex flex-col items-center gap-2 h-auto p-0 group">
                    <div className="h-12 w-12 rounded-2xl bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 flex items-center justify-center group-hover:bg-[#1CB0F6] group-hover:text-white transition-all active:scale-95">
                      <Phone className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 dark:text-slate-400 group-hover:text-stone-700 dark:text-slate-200">
                      Áudio
                    </span>
                  </Button>
                  <Button variant="ghost" className="flex flex-col items-center gap-2 h-auto p-0 group">
                    <div className="h-12 w-12 rounded-2xl bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 flex items-center justify-center group-hover:bg-[#1CB0F6] group-hover:text-white transition-all active:scale-95">
                      <Video className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 dark:text-slate-400 group-hover:text-stone-700 dark:text-slate-200">
                      Vídeo
                    </span>
                  </Button>
                  <Button variant="ghost" className="flex flex-col items-center gap-2 h-auto p-0 group">
                    <div className="h-12 w-12 rounded-2xl bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 flex items-center justify-center group-hover:bg-[#1CB0F6] group-hover:text-white transition-all active:scale-95">
                      <Search className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 dark:text-slate-400 group-hover:text-stone-700 dark:text-slate-200">
                      Pesquisar
                    </span>
                  </Button>
                </div>
              </div>

              {/* Options Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-stone-100 dark:border-slate-800 overflow-hidden flex flex-col">
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  variant="ghost"
                  className="flex items-center justify-between p-5 w-full rounded-none h-auto border-b border-stone-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl">
                      <BellOff className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-stone-700 dark:text-slate-200">
                        Silenciar Notificações
                      </span>
                      <span className="text-xs text-stone-400 dark:text-slate-500 dark:text-slate-400 font-medium">
                        As mensagens não farão som
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-12 h-6 rounded-full flex items-center p-1 transition-colors duration-300",
                      isMuted
                        ? "bg-indigo-500"
                        : "bg-stone-200 dark:bg-slate-700",
                    )}
                  >
                    <div
                      className={cn(
                        "bg-white dark:bg-slate-900 w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300",
                        isMuted ? "translate-x-6" : "translate-x-0",
                      )}
                    />
                  </div>
                </Button>
              </div>

              {/* Media Section */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-stone-100 dark:border-slate-800 overflow-hidden flex flex-col">
                <Button
                  onClick={() => setViewMode("media")}
                  variant="ghost"
                  className="flex items-center justify-between p-5 w-full rounded-none h-auto"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-stone-700 dark:text-slate-200">
                        Média, Links e Docs
                      </span>
                      <span className="text-xs text-stone-400 dark:text-slate-500 dark:text-slate-400 font-medium">
                        {mediaMessages.length} ficheiros partilhados
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-stone-300" />
                </Button>

                {mediaMessages.length > 0 && (
                  <div className="px-5 pb-5 grid grid-cols-4 gap-2 pointer-events-none">
                    {mediaMessages.slice(0, 4).map((msg, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950"
                      >
                        <Image
                          src={msg.content || ""}
                          alt="Media preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Participants (If Group) */}
              {isGroup && (
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-stone-100 dark:border-slate-800 overflow-hidden p-2">
                  <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-purple-50 text-purple-500 rounded-xl">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-bold text-stone-700 dark:text-slate-200">
                          Membros do Grupo
                        </h3>
                        <p className="text-xs font-bold text-stone-400 dark:text-slate-500 dark:text-slate-400">
                          {participants.length} participantes
                        </p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        onClick={() => setViewMode("add-member")}
                        variant="ghost"
                        size="icon"
                        className="bg-green-100 text-green-600 hover:bg-green-200 rounded-xl"
                      >
                        <UserPlus className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    {participants.map((p) => (
                      <div
                        key={p.userId}
                        className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className="flex items-center gap-4 p-3">
                          <Link
                            href={
                              p.userId === currentUserId
                                ? "/profile"
                                : `/profile/${p.userId}`
                            }
                            className="flex items-center gap-4 flex-1 min-w-0"
                          >
                            <div className="relative h-12 w-12 shrink-0 rounded-full border-2 border-white shadow-sm overflow-hidden bg-stone-100 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                              {p.userImageSrc ? (
                                <Image
                                  src={p.userImageSrc}
                                  alt=""
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-black text-stone-400 dark:text-slate-500 dark:text-slate-400 uppercase">
                                  {p.userName?.[0] || "?"}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="font-bold text-stone-700 dark:text-slate-200 truncate group-hover:text-[#1CB0F6] transition-colors">
                                {p.userName}
                              </span>
                              <span className="text-xs text-stone-400 dark:text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-1">
                                {p.role === "admin" && (
                                  <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                    Admin
                                  </span>
                                )}
                                No Faro
                              </span>
                            </div>
                          </Link>

                          {isAdmin &&
                            p.userId !== currentUserId &&
                            p.role !== "admin" && (
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setManagingUserId(
                                    managingUserId === p.userId
                                      ? null
                                      : p.userId,
                                  );
                                }}
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "p-2 rounded-xl",
                                  managingUserId === p.userId
                                    ? "bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-slate-200"
                                    : "text-stone-400 dark:text-slate-500 dark:text-slate-400 hover:text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 dark:bg-slate-800",
                                )}
                              >
                                <MoreVertical className="h-5 w-5" />
                              </Button>
                            )}
                        </div>

                        {/* Expandable Manage Action Menu */}
                        {managingUserId === p.userId && (
                          <div className="flex flex-col gap-1 px-3 pb-3 pt-1 border-t border-stone-100 mt-1 animate-in slide-in-from-top-2 fade-in duration-200">
                            <Button
                              disabled={isPending}
                              onClick={(e) =>
                                handlePromoteToAdmin(
                                  e,
                                  p.userId,
                                  p.userName || "o membro",
                                )
                              }
                              variant="ghost"
                              className="flex items-center gap-3 w-full p-3 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 font-bold text-sm"
                            >
                              <Star className="h-4 w-4" />
                              Promover a Administrador
                            </Button>
                            <Button
                              disabled={isPending}
                              onClick={(e) =>
                                handleKick(
                                  e,
                                  p.userId,
                                  p.userName || "o membro",
                                )
                              }
                              variant="ghost"
                              className="flex items-center gap-3 w-full p-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 font-bold text-sm"
                            >
                              <LogOut className="h-4 w-4" />
                              Expulsar do Grupo
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security */}
              <div className="bg-[#f0fdf4] dark:bg-green-950/30 rounded-[2rem] border border-green-200 dark:border-green-900/50 shadow-sm p-6 flex flex-col items-center text-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 rounded-2xl shrink-0">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-black text-green-800 dark:text-green-500 mb-1">
                    Encriptação de Ponta a Ponta
                  </h3>
                  <p className="text-xs font-bold text-green-600/80 dark:text-green-500/80 leading-relaxed px-4">
                    Esta conversa está protegida com E2EE de nível militar. O
                    Faro não consegue ler as tuas mensagens.
                  </p>
                </div>
              </div>

              {/* Danger Zone Actions */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-stone-100 dark:border-slate-800 overflow-hidden flex flex-col">
                <Button
                  disabled={isPending}
                  onClick={handleClearHistory}
                  variant="ghost"
                  className="flex items-center gap-4 p-5 w-full rounded-none h-auto border-b border-stone-100 dark:border-slate-800 text-rose-500 font-bold"
                >
                  {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                  {isPending ? "A limpar..." : "Limpar Histórico"}
                </Button>

                {!isGroup && (
                  <>
                    <Button variant="ghost" className="flex items-center gap-4 p-5 w-full rounded-none h-auto border-b border-stone-100 dark:border-slate-800 text-rose-500 font-bold">
                      <Ban className="h-5 w-5" />
                      Bloquear Contacto
                    </Button>
                    <Button variant="ghost" className="flex items-center gap-4 p-5 w-full rounded-none h-auto text-rose-500 font-bold">
                      <Flag className="h-5 w-5" />
                      Denunciar
                    </Button>
                  </>
                )}

                {isGroup && (
                  <Button
                    disabled={isPending}
                    onClick={handleLeaveGroup}
                    variant="ghost"
                    className="flex items-center gap-4 p-5 w-full rounded-none h-auto text-rose-500 font-bold"
                  >
                    <LogOut className="h-5 w-5" />
                    Sair do Grupo
                  </Button>
                )}
              </div>

              <div className="h-10" />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

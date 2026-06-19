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
        .then(() => toast.success("Histórico limpo!"))
        .catch(() => toast.error("Erro ao limpar histórico"));
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // We only accept images
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, seleciona uma imagem válida.");
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
          toast.success("Grupo atualizado!");
          setViewMode("settings");
        })
        .catch(() => toast.error("Erro ao atualizar grupo"));
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
            toast.success("Membro promovido a Administrador!");
            setManagingUserId(null);
            setConfirmState(null);
          })
          .catch(() => toast.error("Erro ao promover membro"));
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
          toast.success("Membro expulso e chave de segurança rodada!");
          setConfirmState(null);
        } catch (error) {
          console.error(error);
          toast.error("Erro ao expulsar membro");
        }
      });
    }

    if (confirmState.type === "leave") {
      startTransition(() => {
        leaveGroup(conversationId)
          .then(() => {
            toast.success("Saíste do grupo.");
            setConfirmState(null);
            router.push("/messages");
          })
          .catch(() => toast.error("Erro ao sair do grupo"));
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

      if (!currentRoomKey) throw new Error("Chave de segurança não encontrada");

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
      toast.success("Membros adicionados com sucesso!");
      setViewMode("settings");
      setSelectedFriends([]);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar membros");
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
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] h-[100dvh] sm:h-[90vh] w-full sm:w-[500px] md:w-[600px] max-w-full p-0 sm:rounded-[2.5rem] border-0 sm:border-4 sm:border-white flex flex-col overflow-hidden bg-[#f4f6f8] shadow-[0_0_80px_rgba(0,0,0,0.15)] z-[100] duration-300 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        <DialogTitle className="sr-only">Definições da Conversa</DialogTitle>

        {confirmState && (
          <div className="absolute inset-0 bg-[#f4f6f8]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 shadow-sm w-full max-w-[320px] flex flex-col items-center text-center border-2 border-stone-100 relative">
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
              <h2 className="text-xl font-black text-stone-800 mb-2">
                {confirmState.type === "promote"
                  ? "Promover Membro?"
                  : confirmState.type === "kick"
                    ? "Expulsar Membro?"
                    : "Sair do Grupo?"}
              </h2>
              <p className="text-sm text-stone-400 font-bold mb-8">
                {confirmState.type === "promote"
                  ? `Queres promover ${confirmState.targetName} a Administrador? Ele terá os mesmos poderes que tu.`
                  : confirmState.type === "kick"
                    ? `Queres mesmo expulsar ${confirmState.targetName}? As chaves de segurança serão atualizadas.`
                    : "Tens a certeza que queres sair deste grupo? O membro mais antigo será promovido a Administrador se fores o único."}
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setConfirmState(null)}
                  disabled={isPending}
                  className="flex-1 py-3 rounded-2xl bg-stone-100 text-stone-600 font-bold hover:bg-stone-200 transition active:scale-95 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeConfirmAction}
                  disabled={isPending}
                  className={cn(
                    "flex-1 py-3 rounded-2xl text-white font-bold transition active:scale-95 flex justify-center items-center disabled:opacity-50 border-b-4 active:border-b-0 active:translate-y-1",
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
                </button>
              </div>
            </div>
          </div>
        )}

        {viewMode === "media" ? (
          <>
            <div className="flex items-center justify-between p-5 bg-white border-b border-stone-200 shrink-0 z-10 sticky top-0 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("settings")}
                  className="p-2 -ml-2 rounded-2xl hover:bg-stone-100 text-stone-500 transition-colors active:scale-95"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <span className="font-black text-stone-800 text-lg tracking-tight">
                  Média, Links e Docs
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-1 bg-white">
              {mediaMessages.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {mediaMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square bg-stone-100 cursor-pointer hover:opacity-80 transition-opacity"
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
                  <p className="text-base font-bold text-stone-400">
                    Nenhuma média partilhada
                  </p>
                </div>
              )}
            </div>
          </>
        ) : viewMode === "edit-group" ? (
          <>
            {/* Header - Edit Group */}
            <div className="flex items-center justify-between p-5 bg-white border-b border-stone-200 shrink-0 z-10 sticky top-0 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("settings")}
                  className="p-2 -ml-2 rounded-2xl hover:bg-stone-100 text-stone-500 transition-colors active:scale-95"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <span className="font-black text-stone-800 text-lg tracking-tight">
                  Editar Grupo
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-stone-50">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 uppercase tracking-wider ml-2">
                  Nome do Grupo
                </label>
                <input
                  type="text"
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  placeholder="Ex: Grupo de Estudos"
                  className="w-full p-4 bg-white rounded-2xl text-[15px] font-bold text-stone-700 placeholder:text-stone-400 border-2 border-stone-200 border-b-[4px] outline-none focus:border-[#1CB0F6] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 uppercase tracking-wider ml-2">
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
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-3 px-4 bg-white hover:bg-stone-50 text-stone-700 font-bold rounded-2xl border-2 border-stone-200 border-b-[4px] active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="h-5 w-5 text-[#1CB0F6]" />
                    Escolher da Galeria
                  </button>
                  {editGroupImageUrl && (
                    <button
                      onClick={() => setEditGroupImageUrl("")}
                      className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-colors"
                      title="Remover Foto"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {editGroupImageUrl && (
                <div className="space-y-2 flex flex-col items-center pt-4">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Pré-visualização
                  </label>
                  <div className="relative h-24 w-24 rounded-[2rem] border-4 border-white shadow-md overflow-hidden bg-stone-200">
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

              <button
                onClick={handleSaveGroupInfo}
                disabled={isPending || !editGroupName.trim()}
                className="w-full py-4 mt-6 bg-[#1CB0F6] hover:bg-[#1899D6] active:bg-[#1CB0F6] text-white font-black rounded-2xl border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                {isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </>
        ) : viewMode === "add-member" ? (
          <>
            <div className="flex items-center justify-between p-5 bg-white border-b border-stone-200 shrink-0 z-10 sticky top-0 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode("settings")}
                  className="p-2 -ml-2 rounded-2xl hover:bg-stone-100 text-stone-500 transition-colors active:scale-95"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <span className="font-black text-stone-800 text-lg tracking-tight">
                  Adicionar Membros
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-stone-50 flex flex-col">
              <div className="bg-white rounded-[2rem] shadow-sm border border-stone-100 p-2 flex flex-col gap-1">
                {isLoadingFriends ? (
                  <div className="flex justify-center py-8 text-[#1CB0F6]">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : friends.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 font-bold text-sm px-6">
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
                          isSelected ? "bg-blue-50/50" : "hover:bg-stone-50",
                          isSubmittingMembers &&
                            "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-stone-100">
                            {friend.userImageSrc ? (
                              <Image
                                src={friend.userImageSrc}
                                alt={friend.userName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center font-black text-stone-400">
                                {friend.userName[0]?.toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-stone-700 group-hover:text-[#1CB0F6] transition-colors">
                            {friend.userName}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                            isSelected
                              ? "bg-[#1CB0F6] border-[#1CB0F6]"
                              : "bg-white border-stone-200 group-hover:border-stone-300",
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

            <div className="p-5 bg-white border-t border-stone-200 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] sticky bottom-0 z-10">
              <button
                onClick={handleAddMembers}
                disabled={selectedFriends.length === 0 || isSubmittingMembers}
                className="w-full flex items-center justify-center py-4 bg-[#58CC02] hover:bg-[#46a302] text-white font-black tracking-widest text-sm uppercase rounded-2xl shadow-sm border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all disabled:bg-stone-200 disabled:border-stone-300 disabled:text-stone-400"
              >
                {isSubmittingMembers ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  `Adicionar ${selectedFriends.length > 0 ? `(${selectedFriends.length})` : ""}`
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-5 bg-white border-b border-stone-200 shrink-0 z-10 sticky top-0 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-2 -ml-2 rounded-2xl hover:bg-stone-100 text-stone-500 transition-colors active:scale-95"
                >
                  <X className="h-6 w-6" />
                </button>
                <span className="font-black text-stone-800 text-lg tracking-tight">
                  Info da Conversa
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-5 scrollbar-hide">
              {/* Main Profile Info Card */}
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-stone-100 flex flex-col items-center">
                <div className="relative h-28 w-28 shrink-0 flex items-center justify-center rounded-[2rem] border-4 border-white bg-stone-50 overflow-hidden shadow-md mb-5">
                  {isGroup ? (
                    groupImageUrl ? (
                      <Image
                        src={groupImageUrl}
                        alt={groupName || ""}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex -space-x-4 items-center h-full w-full justify-center bg-stone-100">
                        {participants.slice(0, 2).map((p, idx) => (
                          <div
                            key={p.userId}
                            className={cn(
                              "h-14 w-14 rounded-full border-4 border-white overflow-hidden bg-stone-200 shadow-sm relative shrink-0",
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
                              <div className="flex h-full w-full items-center justify-center text-sm font-black text-stone-400">
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
                    <div className="flex h-full w-full items-center justify-center text-4xl font-black text-stone-400 uppercase">
                      {partner?.userName?.[0] || "?"}
                    </div>
                  )}
                </div>

                <h2 className="font-black text-stone-800 text-2xl tracking-tight text-center leading-none">
                  {isGroup ? groupName : partner?.userName}
                </h2>
                <span
                  className={cn(
                    "text-xs font-black uppercase tracking-widest mt-3 px-4 py-1.5 rounded-full border-2",
                    isPartnerOnline || isGroup
                      ? "bg-green-50 border-green-200 text-green-500"
                      : "bg-stone-50 border-stone-200 text-stone-400",
                  )}
                >
                  {isGroup
                    ? `${participants.length} membros`
                    : isPartnerOnline
                      ? "Online"
                      : "Visto recentemente"}
                </span>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setEditGroupName(groupName || "");
                      setEditGroupImageUrl(groupImageUrl || "");
                      setViewMode("edit-group");
                    }}
                    className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 rounded-xl text-stone-700 font-bold transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar Perfil do Grupo
                  </button>
                )}

                {/* Quick Actions (Audio / Video / Search) */}
                <div className="flex items-center gap-4 mt-6 w-full justify-center">
                  <button className="flex flex-col items-center gap-2 group">
                    <div className="h-12 w-12 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center group-hover:bg-[#1CB0F6] group-hover:text-white transition-all active:scale-95">
                      <Phone className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 group-hover:text-stone-700">
                      Áudio
                    </span>
                  </button>
                  <button className="flex flex-col items-center gap-2 group">
                    <div className="h-12 w-12 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center group-hover:bg-[#1CB0F6] group-hover:text-white transition-all active:scale-95">
                      <Video className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 group-hover:text-stone-700">
                      Vídeo
                    </span>
                  </button>
                  <button className="flex flex-col items-center gap-2 group">
                    <div className="h-12 w-12 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center group-hover:bg-[#1CB0F6] group-hover:text-white transition-all active:scale-95">
                      <Search className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 group-hover:text-stone-700">
                      Pesquisar
                    </span>
                  </button>
                </div>
              </div>

              {/* Options Card */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-stone-100 overflow-hidden flex flex-col">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex items-center justify-between p-5 hover:bg-stone-50 transition-colors border-b border-stone-100 active:bg-stone-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl">
                      <BellOff className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-stone-700">
                        Silenciar Notificações
                      </span>
                      <span className="text-xs text-stone-400 font-medium">
                        As mensagens não farão som
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-12 h-6 rounded-full flex items-center p-1 transition-colors duration-300",
                      isMuted ? "bg-indigo-500" : "bg-stone-200",
                    )}
                  >
                    <div
                      className={cn(
                        "bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300",
                        isMuted ? "translate-x-6" : "translate-x-0",
                      )}
                    />
                  </div>
                </button>
              </div>

              {/* Media Section */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-stone-100 overflow-hidden flex flex-col">
                <button
                  onClick={() => setViewMode("media")}
                  className="flex items-center justify-between p-5 hover:bg-stone-50 transition-colors active:bg-stone-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-stone-700">
                        Média, Links e Docs
                      </span>
                      <span className="text-xs text-stone-400 font-medium">
                        {mediaMessages.length} ficheiros partilhados
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-stone-300" />
                </button>

                {mediaMessages.length > 0 && (
                  <div className="px-5 pb-5 grid grid-cols-4 gap-2 pointer-events-none">
                    {mediaMessages.slice(0, 4).map((msg, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-50"
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
                <div className="bg-white rounded-[2rem] shadow-sm border border-stone-100 overflow-hidden p-2">
                  <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-purple-50 text-purple-500 rounded-xl">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-bold text-stone-700">
                          Membros do Grupo
                        </h3>
                        <p className="text-xs font-bold text-stone-400">
                          {participants.length} participantes
                        </p>
                      </div>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => setViewMode("add-member")}
                        className="bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded-xl transition-colors active:scale-95"
                      >
                        <UserPlus className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    {participants.map((p) => (
                      <div
                        key={p.userId}
                        className="flex flex-col bg-white rounded-2xl hover:bg-stone-50 transition-colors group"
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
                            <div className="relative h-12 w-12 shrink-0 rounded-full border-2 border-white shadow-sm overflow-hidden bg-stone-100 group-hover:scale-105 transition-transform">
                              {p.userImageSrc ? (
                                <Image
                                  src={p.userImageSrc}
                                  alt=""
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-black text-stone-400 uppercase">
                                  {p.userName?.[0] || "?"}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="font-bold text-stone-700 truncate group-hover:text-[#1CB0F6] transition-colors">
                                {p.userName}
                              </span>
                              <span className="text-xs text-stone-400 font-medium truncate flex items-center gap-1">
                                {p.role === "admin" && (
                                  <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                    Admin
                                  </span>
                                )}
                                No Duolingo
                              </span>
                            </div>
                          </Link>

                          {isAdmin &&
                            p.userId !== currentUserId &&
                            p.role !== "admin" && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setManagingUserId(
                                    managingUserId === p.userId
                                      ? null
                                      : p.userId,
                                  );
                                }}
                                className={cn(
                                  "p-2 rounded-xl transition-colors active:scale-95",
                                  managingUserId === p.userId
                                    ? "bg-stone-200 text-stone-700"
                                    : "text-stone-400 hover:text-stone-600 hover:bg-stone-100",
                                )}
                              >
                                <MoreVertical className="h-5 w-5" />
                              </button>
                            )}
                        </div>

                        {/* Expandable Manage Action Menu */}
                        {managingUserId === p.userId && (
                          <div className="flex flex-col gap-1 px-3 pb-3 pt-1 border-t border-stone-100 mt-1 animate-in slide-in-from-top-2 fade-in duration-200">
                            <button
                              disabled={isPending}
                              onClick={(e) =>
                                handlePromoteToAdmin(
                                  e,
                                  p.userId,
                                  p.userName || "o membro",
                                )
                              }
                              className="flex items-center gap-3 w-full p-3 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 font-bold text-sm transition-colors disabled:opacity-50"
                            >
                              <Star className="h-4 w-4" />
                              Promover a Administrador
                            </button>
                            <button
                              disabled={isPending}
                              onClick={(e) =>
                                handleKick(
                                  e,
                                  p.userId,
                                  p.userName || "o membro",
                                )
                              }
                              className="flex items-center gap-3 w-full p-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 font-bold text-sm transition-colors disabled:opacity-50"
                            >
                              <LogOut className="h-4 w-4" />
                              Expulsar do Grupo
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security */}
              <div className="bg-[#f0fdf4] rounded-[2rem] border border-green-200 shadow-sm p-6 flex flex-col items-center text-center gap-3">
                <div className="p-3 bg-green-100 text-green-500 rounded-2xl shrink-0">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-black text-green-800 mb-1">
                    Encriptação de Ponta a Ponta
                  </h3>
                  <p className="text-xs font-bold text-green-600/80 leading-relaxed px-4">
                    Esta conversa está protegida com E2EE de nível militar. O
                    Duolingo não consegue ler as tuas mensagens.
                  </p>
                </div>
              </div>

              {/* Danger Zone Actions */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-stone-100 overflow-hidden flex flex-col">
                <button
                  disabled={isPending}
                  onClick={handleClearHistory}
                  className="flex items-center gap-4 p-5 hover:bg-stone-50 transition-colors border-b border-stone-100 text-rose-500 font-bold active:bg-stone-100 disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                  {isPending ? "A limpar..." : "Limpar Histórico"}
                </button>

                {!isGroup && (
                  <>
                    <button className="flex items-center gap-4 p-5 hover:bg-stone-50 transition-colors border-b border-stone-100 text-rose-500 font-bold active:bg-stone-100">
                      <Ban className="h-5 w-5" />
                      Bloquear Contacto
                    </button>
                    <button className="flex items-center gap-4 p-5 hover:bg-stone-50 transition-colors text-rose-500 font-bold active:bg-stone-100">
                      <Flag className="h-5 w-5" />
                      Denunciar
                    </button>
                  </>
                )}

                {isGroup && (
                  <button
                    disabled={isPending}
                    onClick={handleLeaveGroup}
                    className="flex items-center gap-4 p-5 hover:bg-stone-50 transition-colors text-rose-500 font-bold active:bg-stone-100 disabled:opacity-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Sair do Grupo
                  </button>
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

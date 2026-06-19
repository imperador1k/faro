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
  File,
  BellOff,
  Clock,
  Ban,
  Flag,
  Phone,
  Video,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { type ChatMessage } from "@/hooks/use-realtime-messages";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { clearHistory } from "@/actions/messages";
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
  }[];
  messages: ChatMessage[];
  conversationId: string;
  isPartnerOnline: boolean;
};

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
}: ChatSettingsModalProps) => {
  const { userId: currentUserId } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [viewMode, setViewMode] = useState<"settings" | "media">("settings");
  const [isPending, startTransition] = useTransition();

  const handleClearHistory = () => {
    startTransition(async () => {
      try {
        await clearHistory(conversationId);
        toast.success("Histórico limpo com sucesso!");
        onClose(); // Optional: close modal after clearing
      } catch (error) {
        toast.error("Erro ao limpar histórico.");
      }
    });
  };

  // Filter for media messages (images and gifs)
  const mediaMessages = messages.filter(
    (m) =>
      m.type === "image" ||
      m.type === "gif" ||
      (typeof m.content === "string" && m.content.includes("giphy.com/media")),
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] h-[100dvh] sm:h-[90vh] w-full sm:w-[500px] md:w-[600px] max-w-full p-0 sm:rounded-[2.5rem] border-0 sm:border-4 sm:border-white flex flex-col overflow-hidden bg-[#f4f6f8] shadow-[0_0_80px_rgba(0,0,0,0.15)] z-[100] duration-300 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        <DialogTitle className="sr-only">Definições da Conversa</DialogTitle>

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
                <div className="relative h-28 w-28 shrink-0 flex items-center justify-center rounded-[2rem] border-4 border-white bg-stone-50 overflow-hidden shadow-md mb-5 group">
                  {isGroup ? (
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
                  <div className="px-4 pt-4 pb-3 flex items-center gap-4">
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
                  <div className="flex flex-col gap-1">
                    {participants.map((p) => (
                      <Link
                        href={
                          p.userId === currentUserId
                            ? "/profile"
                            : `/profile/${p.userId}`
                        }
                        key={p.userId}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-stone-50 cursor-pointer transition-colors group"
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
                          <span className="text-xs text-stone-400 font-medium truncate">
                            No Duolingo
                          </span>
                        </div>
                      </Link>
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
                  <button className="flex items-center gap-4 p-5 hover:bg-stone-50 transition-colors text-rose-500 font-bold active:bg-stone-100">
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

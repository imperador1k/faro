"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { setupUserProfile } from "@/actions/profile";
import { usePreferencesStore } from "@/store/use-preferences-store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Upload, User, ArrowRight, Check } from "lucide-react";

export const SetupProfileModal = () => {
  const { user, isLoaded } = useUser();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasSetupProfile = usePreferencesStore((state) => state.hasSetupProfile);
  const setPreference = usePreferencesStore((state) => state.setPreference);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (user?.firstName) {
      setName(user.firstName);
    }
  }, [user?.firstName]);

  if (!mounted || !isLoaded) return null;

  const isModalOpen = !hasSetupProfile;

  const handleNextStep = () => {
    if (name.trim().length < 2) {
      toast.error("O nome deve ter pelo menos 2 caracteres");
      return;
    }
    setStep(2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Create preview
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setFile(selectedFile);
    }
  };

  const onSubmit = () => {
    startTransition(async () => {
      try {
        // 1. Update Clerk Name if needed
        if (user && name.trim() !== user.firstName) {
          await user.update({ firstName: name.trim() });
        }

        // 2. Upload Profile Image to Clerk if file selected
        if (user && file) {
          await user.setProfileImage({ file });
        }

        // 3. Update Database (userName) and Mark as Setup
        const res = await setupUserProfile({
          userName: name.trim(),
        });

        if (res && "success" in res && res.success) {
          setPreference("hasSetupProfile", true);
          toast.success("Perfil incrível criado com sucesso!");
          router.refresh();
        } else {
          toast.error(
            res && "message" in res ? res.message : "Erro ao configurar perfil",
          );
        }
      } catch (error) {
        console.error(error);
        toast.error("Ocorreu um erro ao atualizar o perfil. Tenta novamente.");
      }
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md w-full [&>button]:hidden bg-white dark:bg-slate-900 border-2 border-b-4 border-slate-200 dark:border-slate-800 rounded-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2 w-full">
            <div
              className={`h-2 flex-1 rounded-full transition-colors duration-500 ${
                step >= 1 ? "bg-green-500" : "bg-slate-200 dark:bg-slate-800"
              }`}
            />
            <div
              className={`h-2 flex-1 rounded-full transition-colors duration-500 ${
                step >= 2 ? "bg-green-500" : "bg-slate-200 dark:bg-slate-800"
              }`}
            />
          </div>
        </div>

        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-black tracking-tight text-slate-800 dark:text-slate-100">
            {step === 1 ? "Como te chamas?" : "A tua melhor foto!"}
          </DialogTitle>
          <DialogDescription className="text-center font-medium text-slate-500 dark:text-slate-400">
            {step === 1
              ? "Este nome vai aparecer nas tabelas de liderança e amigos."
              : "Mostra a tua cara aos teus amigos! (Opcional)"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {step === 1 && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                placeholder="Ex: João Silva"
                className="w-full text-lg h-14 bg-slate-100 dark:bg-slate-800 border-2 focus-visible:ring-0 focus-visible:border-sky-500 font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 placeholder:font-normal"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNextStep();
                }}
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer w-32 h-32 rounded-full border-4 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800"
              >
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt="Current Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              </div>

              <p
                className="text-sm font-bold text-sky-500 cursor-pointer hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                Carregar Imagem
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          {step === 1 ? (
            <Button
              onClick={handleNextStep}
              size="lg"
              className="w-full h-12 text-lg font-bold bg-green-500 hover:bg-green-600 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all"
            >
              Avançar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <>
              <Button
                onClick={onSubmit}
                disabled={isPending}
                size="lg"
                className="w-full h-12 text-lg font-bold bg-green-500 hover:bg-green-600 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all"
              >
                {isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Check className="w-6 h-6 mr-2" />
                    {file ? "Guardar Foto e Concluir" : "Concluir Perfil"}
                  </>
                )}
              </Button>
              {!file && !isPending && (
                <Button
                  onClick={onSubmit}
                  disabled={isPending}
                  variant="ghost"
                  className="w-full h-12 font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Saltar por agora
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

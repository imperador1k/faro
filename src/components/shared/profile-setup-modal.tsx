"use client";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Camera, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProfileSetupModalProps {
  onComplete: () => void;
}

export const ProfileSetupModal = ({ onComplete }: ProfileSetupModalProps) => {
  const t = useTranslations("profile_setup");
  const { user } = useUser();
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isValid = name.trim().length >= 2;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!isValid || !user || isSaving) return;
    setIsSaving(true);
    setError("");

    try {
      await user.update({
        firstName: name.trim(),
      });

      if (selectedFile) {
        await user.setProfileImage({ file: selectedFile });
      }

      onComplete();
    } catch (err: unknown) {
      const apiErr = err as { errors?: { longMessage?: string }[] };
      setError(apiErr?.errors?.[0]?.longMessage || t("error_fallback"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 260 }}
        className="relative w-full max-w-md rounded-[2rem] border-2 border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#58cc02]/10">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Camera className="h-8 w-8 text-[#58cc02]" />
            </motion.div>
          </div>

          <h2 className="text-xl font-black text-slate-800 dark:text-white">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("description")}
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="group relative h-24 w-24 overflow-hidden rounded-full border-4 border-slate-200 dark:border-slate-600 transition-colors hover:border-[#58cc02]"
          >
            {preview ? (
              <Image src={preview} alt="Avatar" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-4xl font-black text-slate-300 dark:bg-slate-700 dark:text-slate-500">
                ?
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {t("photo_optional")}
          </span>

          <div className="w-full space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t("name_label")} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("name_placeholder")}
              maxLength={50}
              autoFocus
              className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-800 placeholder:text-slate-400 focus:border-[#58cc02] focus:outline-none focus:ring-2 focus:ring-[#58cc02]/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          {error && (
            <p className="w-full rounded-lg bg-rose-50 p-3 text-center text-sm font-bold text-rose-500 dark:bg-rose-950 dark:text-rose-400">
              {error}
            </p>
          )}

          <Button
            onClick={handleSave}
            variant={isValid ? "default" : "locked"}
            size="lg"
            className="w-full"
            disabled={!isValid || isSaving}
          >
            {isSaving ? (
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-white/30 border-t-white" />
            ) : (
              <>
                <Check className="mr-2 h-5 w-5" />
                {t("continue")}
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

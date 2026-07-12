"use client";

import { useTranslations } from "next-intl";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { User, X, Camera, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const EditProfileButton = () => {
  const t = useTranslations("profile");
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setPreviewImage(null);
    setSelectedFile(null);
    setIsOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      // Update Name
      if (firstName !== user.firstName || lastName !== user.lastName) {
        await user.update({
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
        });
      }

      // Update Avatar
      if (selectedFile) {
        await user.setProfileImage({ file: selectedFile });
      }

      toast.success(t("success_message"));
      setIsOpen(false);
    } catch (error: unknown) {
      const err = error as {
        errors?: { longMessage?: string; message?: string }[];
        message?: string;
      };
      console.error(err);
      toast.error(t("error_title"), {
        description:
          err?.errors?.[0]?.message || err?.message || t("error_description"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="ghost"
        className="bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 font-bold px-5 py-3 rounded-xl border-2 border-stone-200 dark:border-slate-800 uppercase tracking-wide"
      >
        {t("edit_profile")}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="z-modal max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none [&>button]:hidden">
          <div className="relative bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col p-6 md:p-8">
            {/* Custom Close Button */}
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="absolute right-6 top-6 h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 z-50 disabled:opacity-50"
              disabled={isSaving}
            >
              <X className="w-5 h-5 text-stone-400 dark:text-slate-500 dark:text-slate-400" />
            </Button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-sky-100 p-3 rounded-2xl">
                <User className="w-6 h-6 text-[#1CB0F6]" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-stone-800 dark:text-slate-100 tracking-tight">
                  {t("your_profile")}
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => !isSaving && fileInputRef.current?.click()}
                >
                  <div className="relative h-28 w-28 rounded-[2rem] border-4 border-stone-200 dark:border-slate-800 overflow-hidden bg-stone-100 dark:bg-slate-800 group-hover:border-[#1CB0F6] transition-colors shadow-sm">
                    <Image
                      src={previewImage || user?.imageUrl || ""}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <span className="text-xs font-bold text-stone-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {t("change_photo")}
                </span>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-stone-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                    {t("first_name")}
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSaving}
                    className="w-full bg-stone-50 dark:bg-slate-950 border-2 border-stone-200 dark:border-slate-800 rounded-2xl px-4 py-4 text-base font-bold text-stone-700 dark:text-slate-200 outline-none focus:border-[#1CB0F6] focus:bg-white dark:bg-slate-900 transition-all"
                    placeholder={t("first_name_placeholder")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-stone-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                    {t("last_name")}
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSaving}
                    className="w-full bg-stone-50 dark:bg-slate-950 border-2 border-stone-200 dark:border-slate-800 rounded-2xl px-4 py-4 text-base font-bold text-stone-700 dark:text-slate-200 outline-none focus:border-[#1CB0F6] focus:bg-white dark:bg-slate-900 transition-all"
                    placeholder={t("last_name_placeholder")}
                  />
                </div>

                <div className="space-y-2 opacity-60">
                  <label className="text-xs font-black text-stone-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                    <span>{t("email")}</span>
                    <span className="text-[#1CB0F6]">{t("primary")}</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.primaryEmailAddress?.emailAddress || ""}
                    className="w-full bg-stone-100 dark:bg-slate-800 border-2 border-stone-200 dark:border-slate-800 rounded-2xl px-4 py-4 text-base font-bold text-stone-500 dark:text-slate-400 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Action */}
              <div className="pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !firstName.trim()}
                  variant="secondary"
                  className="w-full py-4 font-black uppercase tracking-wider rounded-2xl"
                >
                  {isSaving ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {t("save_changes")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

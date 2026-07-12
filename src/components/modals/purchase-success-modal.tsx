"use client";

import { useTranslations } from "next-intl";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type PurchaseSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  icon: string;
  title: string;
  description: string;
  color: string; // Tailwind bg color class, e.g. "bg-rose-100"
};

export const PurchaseSuccessModal = ({
  isOpen,
  onClose,
  icon,
  title,
  description,
  color,
}: PurchaseSuccessModalProps) => {
  const t = useTranslations("modals");
  // Prevent hydration mismatch for portals/modals
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-above-modal flex items-center justify-center bg-stone-900/60 backdrop-blur-xl animate-in fade-in duration-500 px-4">
      <div className="w-full max-w-[420px] rounded-[3rem] bg-gradient-to-b from-white to-amber-50 p-8 md:p-10 shadow-2xl flex flex-col items-center text-center border-2 border-stone-200 dark:border-slate-800 border-b-8 relative overflow-hidden animate-in zoom-in-90 duration-500">
        {/* Immersive radial background */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-200/30 to-transparent -z-10" />
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-40 animate-pulse" />

        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute right-8 top-8 p-2 rounded-xl"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Massive Gamified Icon Container */}
        <div
          className={cn(
            "flex h-28 w-28 items-center justify-center rounded-[2rem] shadow-sm mb-8 relative border-2 border-white border-b-4 ring-8 ring-white/50 animate-bounce",
            color,
          )}
        >
          <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-amber-500 fill-amber-300 animate-pulse" />
          <span className="text-[4rem] relative z-10 drop-shadow-xl select-none">
            {icon}
          </span>
        </div>

        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-stone-700 dark:text-slate-200 tracking-tight leading-tight uppercase">
            {title}
          </h2>
          <div className="h-1.5 w-16 bg-amber-400 rounded-full mx-auto" />
        </div>

        <p className="mb-10 text-lg md:text-xl font-bold text-stone-500/80 px-4 leading-relaxed tracking-tight">
          {description}
        </p>

        <div className="flex flex-col w-full mt-auto">
          <Button
            variant="default"
            onClick={onClose}
            className="w-full h-16 md:h-20 text-xl rounded-2xl uppercase tracking-[0.1em] shadow-md"
          >
            <span>{t("continue")}</span>
          </Button>
          <p className="mt-6 text-xs font-black text-amber-500 uppercase tracking-widest animate-pulse">
            {t("inventory_updated")}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
};

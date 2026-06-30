"use client";

import { useTranslations } from "next-intl";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertCircle } from "lucide-react";

export const DangerZone = () => {
  const t = useTranslations("settings");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isConfirmed = confirmationText === t("confirm_keyword");

  const handleDelete = () => {
    if (!isConfirmed) return;
    // TODO: Call server action to delete user data
    console.log("Delete account triggered");
  };

  const handleClose = () => {
    setIsDeleteModalOpen(false);
    setConfirmationText("");
  };

  const modalContent = (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="z-modal w-[92%] max-w-sm bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 border-b-8 rounded-[2rem] p-6 sm:p-8 text-center shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Decorative background glowing circle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-100 dark:bg-red-900/40 rounded-full opacity-50 blur-xl"></div>

        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 border-4 border-red-50 dark:border-red-900 mb-6 shadow-sm">
          <AlertCircle
            className="h-12 w-12 text-red-600 dark:text-red-500"
            strokeWidth={2.5}
          />
        </div>

        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
          {t("modal_title")}
        </h2>

        <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed">
          {t.rich("modal_description", {
            span: (chunks) => (
              <span className="font-bold text-red-500">{chunks}</span>
            ),
          })}
        </p>

        <div className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-5 mb-8 text-left shadow-inner">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            {t.rich("confirm_instruction", {
              span: (chunks) => <span className="text-red-500">{chunks}</span>,
            })}
          </label>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder={t("confirm_keyword")}
            className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-base font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all font-mono placeholder:text-slate-300"
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleDelete}
            disabled={!isConfirmed}
            className={`w-full font-black uppercase tracking-wider py-4 rounded-2xl border-b-4 transition-all ${
              isConfirmed
                ? "bg-red-500 text-white border-red-700 hover:bg-red-400 active:translate-y-[2px] active:border-b-2 shadow-lg shadow-red-200 dark:shadow-none"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-70"
            }`}
          >
            {t("confirm_button")}
          </button>
          <button
            onClick={handleClose}
            className="w-full bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 border-b-4 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 active:translate-y-1 active:border-b-0 transition-all"
          >
            {t("cancel_button")}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-900/50 border-b-8 rounded-[2rem] p-6 md:p-8">
      <h3 className="text-xl font-black text-red-600 dark:text-red-500 mb-2">
        {t("title")}
      </h3>
      <p className="text-sm font-bold text-red-400 dark:text-red-500/80 mb-6 max-w-md">
        {t("description")}
      </p>

      <button
        onClick={() => setIsDeleteModalOpen(true)}
        className="bg-red-500 hover:bg-red-400 text-white border-2 border-b-4 border-red-600 font-black uppercase tracking-wider rounded-2xl px-8 py-4 active:translate-y-[2px] active:border-b-2 transition-all w-full md:w-auto text-center block"
      >
        {t("delete_action")}
      </button>

      {isDeleteModalOpen &&
        mounted &&
        createPortal(modalContent, document.body)}
    </div>
  );
};

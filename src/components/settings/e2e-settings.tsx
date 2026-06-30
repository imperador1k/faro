"use client";

import { useState } from "react";
import { Lock, KeyRound, Info, X } from "lucide-react";
import { getMyE2EBundle } from "@/actions/crypto";
import { generateSalt, encryptPrivateKeyWithPIN } from "@/lib/crypto";
import localforage from "localforage";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

export function E2ESettings() {
  const t = useTranslations("settings_components");
  const [isChanging, setIsChanging] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePin = async () => {
    if (newPin.length < 4) {
      toast.error(t("pin_min_length_error"));
      return;
    }

    setLoading(true);
    try {
      const rawPrivateKey =
        await localforage.getItem<CryptoKey>("e2e_private_key");
      if (!rawPrivateKey) {
        toast.error(t("key_not_found_error"));
        return;
      }

      const exportedJwk = await window.crypto.subtle.exportKey(
        "jwk",
        rawPrivateKey,
      );

      const salt = generateSalt(16);
      const encryptedPrivateKey = await encryptPrivateKeyWithPIN(
        exportedJwk,
        newPin,
        salt,
      );

      const bundle = await getMyE2EBundle();
      if (!bundle || !bundle.publicKey) {
        throw new Error(t("get_public_key_error"));
      }

      const res = await fetch("/api/crypto/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          e2ePublicKey: bundle.publicKey,
          e2eEncryptedPrivateKey: encryptedPrivateKey,
          e2eSalt: salt,
        }),
      });

      if (!res.ok) throw new Error(t("save_pin_error"));

      toast.success(t("pin_changed_success"));
      setIsChanging(false);
      setNewPin("");
    } catch (error) {
      console.error(error);
      toast.error(t("generic_pin_change_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-black text-stone-800 dark:text-slate-100 mb-4 flex items-center gap-2">
        <Lock className="w-6 h-6 text-emerald-500" />
        {t("e2ee_title")}
      </h3>
      <div className="bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-[2rem] p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 border-2 border-emerald-100 text-emerald-500 rounded-2xl shrink-0">
              <KeyRound className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-lg font-bold text-stone-800 dark:text-slate-100">
                {t("vault_title")}
              </h4>
              <p className="text-sm font-medium text-stone-500 dark:text-slate-400">
                {t("vault_subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(true)}
            className="w-full sm:w-auto h-12 px-5 rounded-xl bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400 font-black uppercase tracking-wider border-2 border-stone-200 dark:border-slate-800 border-b-4 hover:bg-stone-200 dark:hover:bg-slate-700 dark:bg-slate-700 active:border-b-0 active:translate-y-1 transition-all flex justify-center items-center gap-2 shrink-0"
          >
            <Info className="w-5 h-5" />
            {t("what_is_pin_button")}
          </button>
        </div>

        <Dialog open={showInfo} onOpenChange={setShowInfo}>
          <DialogContent className="z-modal max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none [&>button]:hidden">
            <div className="relative bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-8 rounded-[2rem] shadow-2xl p-6 md:p-8 max-w-md w-full">
              <button
                onClick={() => setShowInfo(false)}
                className="absolute right-4 top-4 h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border-2 border-stone-200 dark:border-slate-800 border-b-4 hover:bg-stone-50 dark:bg-slate-950 active:translate-y-1 active:border-b-0 transition-all text-stone-400 dark:text-slate-500 dark:text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-sky-50 border-2 border-sky-100 text-[#1CB0F6] rounded-2xl shrink-0">
                  <Info className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-stone-800 dark:text-slate-100">
                  {t("vault_modal_title")}
                </h3>
              </div>
              <p className="text-sm font-bold text-stone-500 dark:text-slate-400 leading-relaxed mb-6">
                {t.rich("vault_explanation", {
                  b: (chunks) => <b>{chunks}</b>,
                })}
              </p>
              <button
                onClick={() => setShowInfo(false)}
                className="w-full h-12 px-6 rounded-xl bg-[#1CB0F6] text-white font-black uppercase tracking-wider border-2 border-[#1899D6] border-b-4 active:border-b-0 active:translate-y-1 transition-all"
              >
                {t("understood_button")}
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <hr className="border-2 border-stone-100 rounded-full" />

        {isChanging ? (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
            <label className="text-sm font-bold text-stone-700 dark:text-slate-200">
              {t("enter_new_pin_label")}
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <input
                type="password"
                className="flex h-12 w-full rounded-xl border-2 border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-bold ring-offset-background placeholder:text-stone-400 dark:text-slate-500 dark:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:border-transparent transition-all"
                placeholder={t("pin_input_placeholder")}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                disabled={loading}
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleChangePin}
                  disabled={loading || newPin.length < 4}
                  className="w-full sm:w-auto h-12 px-6 rounded-xl bg-emerald-500 text-white font-black uppercase tracking-wider border-2 border-emerald-600 border-b-4 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {loading ? t("saving_status") : t("confirm_button")}
                </button>
                <button
                  onClick={() => setIsChanging(false)}
                  disabled={loading}
                  className="w-full sm:w-auto h-12 px-6 rounded-xl bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400 font-black uppercase tracking-wider border-2 border-stone-200 dark:border-slate-800 border-b-4 active:border-b-0 active:translate-y-1 transition-all shrink-0"
                >
                  {t("cancel_button")}
                </button>
              </div>
            </div>
            <p className="text-xs font-bold text-stone-400 dark:text-slate-500 dark:text-slate-400">
              {t("pin_change_note")}
            </p>
          </div>
        ) : (
          <div className="flex justify-start">
            <button
              onClick={() => setIsChanging(true)}
              className="w-full sm:w-auto h-12 px-6 rounded-xl bg-sky-500 text-white font-black uppercase tracking-wider border-2 border-sky-600 border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              {t("change_pin_button")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

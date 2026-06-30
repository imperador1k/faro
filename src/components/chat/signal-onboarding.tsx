"use client";

import { useEffect, useState } from "react";
import { getMyE2EBundle } from "@/actions/crypto";
import {
  generateMasterKeyPair,
  generateSalt,
  encryptPrivateKeyWithPIN,
  decryptPrivateKeyWithPIN,
  arrayBufferToBase64,
} from "@/lib/crypto";
import localforage from "localforage";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function SignalOnboarding() {
  const t = useTranslations("chat");
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsPin, setNeedsPin] = useState<"CREATE" | "UNLOCK" | null>(null);
  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverBundle, setServerBundle] = useState<any>(null);

  useEffect(() => {
    async function checkState() {
      try {
        const localKey =
          await localforage.getItem<CryptoKey>("e2e_private_key");
        if (localKey) {
          setIsInitializing(false);
          return;
        }

        const bundle = await getMyE2EBundle();
        if (bundle) {
          setServerBundle(bundle);
          setNeedsPin("UNLOCK");
        } else {
          setNeedsPin("CREATE");
        }
      } catch (err) {
        console.error("E2E State Check Error:", err);
        setError(t("error_verifying_encryption"));
      } finally {
        setIsInitializing(false);
      }
    }

    checkState();
  }, [t]);

  const handlePinSubmit = async () => {
    if (pin.length < 4) {
      setError(t("error_pin_length"));
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      if (needsPin === "CREATE") {
        const { keyPair, publicKeyBase64, privateKeyJwk } =
          await generateMasterKeyPair();

        const salt = generateSalt(16);
        const encryptedPrivateKey = await encryptPrivateKeyWithPIN(
          privateKeyJwk,
          pin,
          salt,
        );

        const res = await fetch("/api/crypto/keys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            e2ePublicKey: publicKeyBase64,
            e2eEncryptedPrivateKey: encryptedPrivateKey,
            e2eSalt: salt,
          }),
        });

        if (!res.ok) throw new Error(t("error_save_server"));

        await localforage.setItem("e2e_private_key", keyPair.privateKey);
      } else if (needsPin === "UNLOCK" && serverBundle) {
        const privateKey = await decryptPrivateKeyWithPIN(
          serverBundle.encryptedPrivateKey,
          pin,
          serverBundle.salt,
        );

        await localforage.setItem("e2e_private_key", privateKey);
      }

      setNeedsPin(null);
    } catch (err: any) {
      console.error("PIN processing error:", err);
      setError(t("error_pin_invalid"));
    } finally {
      setIsProcessing(false);
    }
  };

  if (needsPin) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
        <div className="bg-background rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl border">
          <h3 className="font-bold text-lg text-center">
            {needsPin === "CREATE"
              ? t("title_create_pin")
              : t("title_unlock_messages")}
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            {needsPin === "CREATE"
              ? t("desc_create_pin")
              : t("desc_unlock_messages")}
          </p>

          <div className="space-y-2">
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="password"
              placeholder={t("placeholder_pin")}
              value={pin}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPin(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                e.key === "Enter" && handlePinSubmit()
              }
              disabled={isProcessing}
            />
            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}
          </div>

          <Button
            className="w-full"
            onClick={handlePinSubmit}
            disabled={isProcessing || pin.length < 4}
          >
            {isProcessing
              ? t("btn_processing")
              : needsPin === "CREATE"
                ? t("btn_create_identity")
                : t("btn_unlock")}
          </Button>
        </div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="text-muted-foreground text-xs text-center mt-2 animate-pulse">
        {t("msg_initializing")}
      </div>
    );
  }

  return null;
}

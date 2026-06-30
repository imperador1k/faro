"use client";

import { useEffect, useTransition } from "react";
import { onSyncUserInfo } from "@/actions/user-progress";
import { useTranslations } from "next-intl";

export const UserSync = () => {
  const t = useTranslations("shared");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Sync user info on mount (once per session)
    const synced = sessionStorage.getItem("userSynced");

    if (!synced) {
      startTransition(() => {
        onSyncUserInfo()
          .then(() => {
            sessionStorage.setItem("userSynced", "true");
          })
          .catch((err) => console.error(t("error_syncing_user"), err));
      });
    }
  }, [t]);

  // This component renders nothing
  return null;
};

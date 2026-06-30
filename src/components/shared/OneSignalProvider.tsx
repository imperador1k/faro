"use client";

import { useEffect, useRef } from "react";
import OneSignal from "react-onesignal";
import { useAuth } from "@clerk/nextjs";
import { Capacitor } from "@capacitor/core";
import { useTranslations } from "next-intl";

export const OneSignalProvider = () => {
  const t = useTranslations("shared");
  const { userId } = useAuth();
  const isInitialized = useRef(false);
  const ONESIGNAL_APP_ID = "23b0fe4f-661c-4726-91ad-92f20d9c6ac0";

  useEffect(() => {
    const initOneSignal = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      const platform = Capacitor.getPlatform();

      if (platform === "web") {
        try {
          await OneSignal.init({
            appId: ONESIGNAL_APP_ID,
            safari_web_id:
              "web.onesignal.auto.3db514d6-c75f-4a27-ad99-adae19a9a814",
            allowLocalhostAsSecureOrigin: true,
          });
          console.log(t("onesignal_web_initialized"));
        } catch (error) {
          console.error(t("onesignal_web_init_failed"), error);
        }
      } else {
        const OneSignalNative = (window as any).plugins?.OneSignal;
        if (OneSignalNative) {
          try {
            OneSignalNative.initialize(ONESIGNAL_APP_ID);

            OneSignalNative.Notifications.requestPermission(true).then(
              (accepted: boolean) => {
                console.log(t("notification_permission_status"), accepted);
              },
            );

            console.log(t("onesignal_native_initialized"));
          } catch (error) {
            console.error(t("onesignal_native_init_failed"), error);
          }
        }
      }
    };

    if (
      typeof window !== "undefined" &&
      !window.location.hostname.includes("localhost")
    ) {
      initOneSignal();
    }
  }, [t]);

  useEffect(() => {
    const loginOneSignal = async () => {
      if (userId && isInitialized.current) {
        const platform = Capacitor.getPlatform();

        try {
          if (platform === "web") {
            await OneSignal.login(userId);
          } else {
            const OneSignalNative = (window as any).plugins?.OneSignal;
            OneSignalNative?.login(userId);
          }
          console.log(t("onesignal_login_success"), userId);
        } catch (error) {
          console.error(t("onesignal_login_failed"), error);
        }
      }
    };

    if (
      typeof window !== "undefined" &&
      !window.location.hostname.includes("localhost")
    ) {
      loginOneSignal();
    }
  }, [userId, t]);

  return null;
};

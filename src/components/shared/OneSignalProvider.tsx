"use client";

import { useEffect, useRef } from "react";
import OneSignal from "react-onesignal";
import { useAuth } from "@clerk/nextjs";
import { Capacitor } from "@capacitor/core";

export const OneSignalProvider = () => {
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
                        safari_web_id: "web.onesignal.auto.3db514d6-c75f-4a27-ad99-adae19a9a814",
                        allowLocalhostAsSecureOrigin: true
                    });
                    console.log("OneSignal Web Initialized");
                } catch (error) {
                    console.error("OneSignal Web initialization failed:", error);
                }
            } else {
                // Native (Android/iOS)
                const OneSignalNative = (window as any).plugins?.OneSignal;
                if (OneSignalNative) {
                    try {
                        OneSignalNative.initialize(ONESIGNAL_APP_ID);
                        
                        // Android 13+ Notification Permission Request
                        OneSignalNative.Notifications.requestPermission(true).then((accepted: boolean) => {
                            console.log("Notification permission status:", accepted);
                        });

                        console.log("OneSignal Native Initialized");
                    } catch (error) {
                        console.error("OneSignal Native initialization failed:", error);
                    }
                }
            }
        };

        if (typeof window !== "undefined" && !window.location.hostname.includes("localhost")) {
            initOneSignal();
        }
    }, []);

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
                    console.log("Logged into OneSignal with user:", userId);
                } catch (error) {
                    console.error("OneSignal login failed:", error);
                }
             }
        };

        if (typeof window !== "undefined" && !window.location.hostname.includes("localhost")) {
            loginOneSignal();
        }
    }, [userId]);

    return null;
};

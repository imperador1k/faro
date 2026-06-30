"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  check,
  type Update,
  type DownloadEvent,
} from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export function NativeUpdater() {
  const t = useTranslations("providers");
  const [updateInfo, setUpdateInfo] = useState<Update | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string>("");
  const [status, setStatus] = useState<
    "idle" | "checking" | "available" | "downloading" | "ready" | "error"
  >("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    const isTauri =
      typeof window !== "undefined" &&
      navigator.userAgent.includes("TauriDesktop");
    if (!isTauri) return;

    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === "production") {
        e.preventDefault();
      }
    };
    window.addEventListener("contextmenu", handleContextMenu);

    async function setupUpdater() {
      try {
        const { getVersion } = await import("@tauri-apps/api/app");
        const version = await getVersion();
        setCurrentVersion(version);

        setStatus("checking");
        const update = await check();
        if (update) {
          setUpdateInfo(update);
          setStatus("available");
        } else {
          setStatus("idle");
        }
      } catch (error) {
        console.error("Failed to check for updates:", error);
        setStatus("idle");
      }
    }

    setupUpdater();

    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  const handleUpdate = async () => {
    if (!updateInfo) return;

    try {
      setStatus("downloading");
      let downloadedLength = 0;
      let contentLength = 0;

      await updateInfo.downloadAndInstall((event: DownloadEvent) => {
        switch (event.event) {
          case "Started":
            contentLength = event.data.contentLength || 0;
            break;
          case "Progress":
            downloadedLength += event.data.chunkLength;
            if (contentLength > 0) {
              setDownloadProgress(
                Math.round((downloadedLength / contentLength) * 100),
              );
            }
            break;
          case "Finished":
            setStatus("ready");
            break;
        }
      });
    } catch (error) {
      console.error("Update failed:", error);
      setStatus("error");
    }
  };

  if (status === "idle" || status === "checking") return null;

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: [
      "radial-gradient(ellipse 460px 380px at 108% -10%, rgba(215,88,15,0.8) 0%, rgba(160,50,10,0.3) 45%, transparent 70%)",
      "radial-gradient(ellipse 350px 300px at 65% 25%,  rgba(95,25,160,0.5) 0%, transparent 65%)",
      "radial-gradient(ellipse 300px 380px at -5% 95%,  rgba(15,25,110,0.4)  0%, transparent 75%)",
      "#0a0c14",
    ].join(", "),
    backdropFilter: "blur(12px)",
  };

  const cardStyle: React.CSSProperties = {
    width: "480px",
    background: "rgba(20, 24, 38, 0.72)",
    backdropFilter: "blur(40px)",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "40px",
    boxShadow:
      "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255,255,255,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    color: "#fff",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  const buttonStyle = (
    hovered: boolean,
    destructive = false,
  ): React.CSSProperties => ({
    width: "100%",
    height: "52px",
    background: destructive
      ? hovered
        ? "rgba(248, 113, 113, 0.2)"
        : "rgba(248, 113, 113, 0.1)"
      : hovered
        ? "linear-gradient(135deg, #3291ff 0%, #0070f3 100%)"
        : "linear-gradient(135deg, #1b7bff 0%, #0c68db 100%)",
    border: destructive ? "1px solid rgba(248, 113, 113, 0.3)" : "none",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow:
      !destructive && hovered ? "0 10px 30px rgba(0,112,243,0.4)" : "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  });

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 20px rgba(22,163,74,0.3)",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                fontWeight: 800,
                letterSpacing: "0.1em",
              }}
            >
              {t("update_available_label")}
            </span>
            <span style={{ fontSize: "24px", fontWeight: 800 }}>
              v{currentVersion} → v{updateInfo?.version}
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {status === "available" && (
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.6,
                fontSize: "15px",
              }}
            >
              {t("update_available_description")}
            </p>
          )}

          {(status === "downloading" || status === "ready") && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                <span>
                  {status === "ready"
                    ? t("download_finished")
                    : t("downloading_update")}
                </span>
                <span>{downloadProgress}%</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "10px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${downloadProgress}%`,
                    background: "linear-gradient(90deg, #7c3aed, #3b82f6)",
                    transition: "width 0.4s ease-out",
                    boxShadow: "0 0 20px rgba(59,130,246,0.5)",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {status === "available" && (
            <>
              <button style={buttonStyle(false)} onClick={handleUpdate}>
                {t("update_now")}
              </button>
              <button
                style={buttonStyle(false, true)}
                onClick={() => setStatus("idle")}
              >
                {t("remind_later")}
              </button>
            </>
          )}

          {status === "ready" && (
            <button style={buttonStyle(false)} onClick={() => relaunch()}>
              {t("restart_to_apply")}
            </button>
          )}

          {status === "error" && (
            <p
              style={{
                color: "#f87171",
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              {t("update_error_message")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

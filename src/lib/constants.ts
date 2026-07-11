// ============================================================
// SUPPORTED LANGUAGES — Single Source of Truth
// ============================================================
// All UI dropdowns, LLM prompts, and language logic should
// reference this array. Adding a language here makes it
// available app-wide.

export type SupportedLanguage = {
    /** The canonical name sent to LLMs and stored in DB */
    value: string;
    /** Display label with flag emoji for UI dropdowns */
    label: string;
    /** BCP 47 locale code for TTS and i18n */
    locale: string;
};

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
    { value: "English", label: "🇬🇧 English", locale: "en-US" },
    { value: "Spanish", label: "🇪🇸 Español", locale: "es-ES" },
    { value: "French", label: "🇫🇷 Français", locale: "fr-FR" },
    { value: "Portuguese", label: "🇵🇹 Português", locale: "pt-PT" },
    { value: "German", label: "🇩🇪 Deutsch", locale: "de-DE" },
    { value: "Italian", label: "🇮🇹 Italiano", locale: "it-IT" },
    { value: "Japanese", label: "🇯🇵 日本語", locale: "ja-JP" },
    { value: "Korean", label: "🇰🇷 한국어", locale: "ko-KR" },
    { value: "Mandarin", label: "🇨🇳 中文", locale: "zh-CN" },
    { value: "Russian", label: "🇷🇺 Русский", locale: "ru-RU" },
    { value: "Arabic", label: "🇸🇦 العربية", locale: "ar-SA" },
    { value: "Dutch", label: "🇳🇱 Nederlands", locale: "nl-NL" },
];

/** Get the locale for a given language value (e.g., "Spanish" → "es-ES") */
export function getLocaleForLanguage(language: string): string {
    return SUPPORTED_LANGUAGES.find(
        (l) => l.value.toLowerCase() === language.toLowerCase()
    )?.locale || "en-US";
}

/** Default language if nothing else is available */
export const DEFAULT_LANGUAGE = "English";

// ============================================================
// NATIVE APP DOWNLOADS — Platform-specific install URLs
// ============================================================
// Set to empty string to hide the download option for a platform.
// The PWA installer will show the native download button for
// the detected platform if a URL is configured, otherwise
// falls back to the PWA beforeinstallprompt.

export const APP_DOWNLOADS: Record<string, string> = {
  android: "",
  ios: "",
  windows: "",
  macos: "",
  linux: "",
};

// ============================================================
// PWA INSTALLER SETTINGS
// ============================================================

export const PWA_INSTALLER = {
  /** Minimum page views before the prompt is first shown */
  engagementThreshold: 3,
  /** Days to wait after dismissal before showing again */
  dismissCooldownDays: 7,
  /** localStorage keys */
  storageKeys: {
    engagement: "faro-pwa-engagement",
    dismissed: "faro-pwa-dismissed",
    installed: "faro-pwa-installed",
  },
};

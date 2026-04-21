import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const getStoredTheme = (): ThemeMode | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("customerTheme");
  return stored === "dark" || stored === "light" ? stored : null;
};

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "light";

  const stored = getStoredTheme();
  if (stored) return stored;

  const telegramScheme = window.Telegram?.WebApp?.colorScheme;
  if (telegramScheme === "dark" || telegramScheme === "light") {
    return telegramScheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function useCustomerTheme(enabled: boolean) {
  const [theme, setTheme] = useState<ThemeMode>(getPreferredTheme);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const syncTheme = () => setTheme(getPreferredTheme());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const telegram = window.Telegram?.WebApp;

    syncTheme();

    const handleMediaChange = () => {
      if (!getStoredTheme()) {
        syncTheme();
      }
    };

    const handleTelegramThemeChange = () => {
      if (!getStoredTheme()) {
        syncTheme();
      }
    };

    media.addEventListener?.("change", handleMediaChange);
    media.addListener?.(handleMediaChange);
    telegram?.onEvent?.("themeChanged", handleTelegramThemeChange);

    return () => {
      media.removeEventListener?.("change", handleMediaChange);
      media.removeListener?.(handleMediaChange);
      telegram?.offEvent?.("themeChanged", handleTelegramThemeChange);
    };
  }, [enabled]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const adminTheme =
      typeof window !== "undefined" ? localStorage.getItem("adminTheme") : null;

    if (enabled) {
      root.classList.add("customer-ui");
      root.classList.toggle("dark", theme === "dark");
      root.style.colorScheme = theme;
      return;
    }

    root.classList.remove("customer-ui");
    root.classList.toggle("dark", adminTheme === "dark");
    root.style.colorScheme = adminTheme === "dark" ? "dark" : "light";
  }, [enabled, theme]);

  return theme;
}

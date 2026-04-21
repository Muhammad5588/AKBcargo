import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type InstallMethod = "telegram" | "browser" | "manual";

export interface UseInstallPromptResult {
  canInstall: boolean;
  installMethod: InstallMethod | null;
  isInstalled: boolean;
  handleInstall: () => Promise<void>;
}

interface InstallPromptState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  installMethod: InstallMethod | null;
  isInstalled: boolean;
}

const DISPLAY_MODE_QUERY = "(display-mode: standalone)";

const installPromptState: InstallPromptState = {
  deferredPrompt: null,
  installMethod: null,
  isInstalled: false,
};

const subscribers = new Set<() => void>();
let isMonitoringStarted = false;

function notifySubscribers() {
  subscribers.forEach((callback) => callback());
}

function setInstallPromptState(
  updater: Partial<InstallPromptState> | ((state: InstallPromptState) => void),
) {
  if (typeof updater === "function") {
    updater(installPromptState);
  } else {
    Object.assign(installPromptState, updater);
  }

  notifySubscribers();
}

function isStandaloneMode() {
  const mediaMatches =
    typeof window.matchMedia === "function" &&
    window.matchMedia(DISPLAY_MODE_QUERY).matches;
  const navigatorStandalone = Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone,
  );

  return mediaMatches || navigatorStandalone;
}

function syncInstalledState() {
  if (typeof window === "undefined") return false;

  const installed = isStandaloneMode();
  installPromptState.isInstalled = installed;

  if (installed) {
    installPromptState.deferredPrompt = null;
    installPromptState.installMethod = null;
  }

  notifySubscribers();
  return installed;
}

function startInstallPromptMonitoring() {
  if (isMonitoringStarted || typeof window === "undefined") return;
  isMonitoringStarted = true;

  const telegram = window.Telegram?.WebApp;
  const standaloneMediaQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia(DISPLAY_MODE_QUERY)
      : null;

  const handleBeforeInstallPrompt = (event: Event) => {
    if (syncInstalledState()) return;

    event.preventDefault();
    setInstallPromptState({
      deferredPrompt: event as BeforeInstallPromptEvent,
      installMethod: "browser",
    });
  };

  const handleAppInstalled = () => {
    setInstallPromptState({
      deferredPrompt: null,
      installMethod: null,
      isInstalled: true,
    });
  };

  const handleDisplayModeChange = () => {
    syncInstalledState();
  };

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);

  if (standaloneMediaQuery) {
    if (typeof standaloneMediaQuery.addEventListener === "function") {
      standaloneMediaQuery.addEventListener("change", handleDisplayModeChange);
    } else {
      standaloneMediaQuery.addListener(handleDisplayModeChange);
    }
  }

  syncInstalledState();

  if (
    !installPromptState.isInstalled &&
    telegram &&
    typeof telegram.isVersionAtLeast === "function" &&
    telegram.isVersionAtLeast("8.0") &&
    typeof telegram.addToHomeScreen === "function"
  ) {
    const applyTelegramStatus = (status: TelegramHomeScreenStatus) => {
      if (status === "added") {
        setInstallPromptState({
          deferredPrompt: null,
          installMethod: null,
          isInstalled: true,
        });
        return;
      }

      if (status !== "unsupported") {
        setInstallPromptState({
          installMethod: "telegram",
          isInstalled: false,
        });
      }
    };

    if (typeof telegram.checkHomeScreenStatus === "function") {
      telegram.checkHomeScreenStatus(applyTelegramStatus);
    } else {
      setInstallPromptState({ installMethod: "telegram", isInstalled: false });
    }

    const handleHomeScreenAdded = () => {
      setInstallPromptState({
        deferredPrompt: null,
        installMethod: null,
        isInstalled: true,
      });
    };

    telegram.onEvent?.("homeScreenAdded", handleHomeScreenAdded);
  } else if (!installPromptState.isInstalled) {
    setInstallPromptState({ installMethod: "manual" });
  }
}

startInstallPromptMonitoring();

function getSnapshot() {
  return {
    canInstall:
      installPromptState.installMethod !== null && !installPromptState.isInstalled,
    installMethod: installPromptState.installMethod,
    isInstalled: installPromptState.isInstalled,
  };
}

export function useInstallPrompt(): UseInstallPromptResult {
  const [snapshot, setSnapshot] = useState(getSnapshot);

  useEffect(() => {
    startInstallPromptMonitoring();

    const updateSnapshot = () => {
      setSnapshot(getSnapshot());
    };

    subscribers.add(updateSnapshot);
    updateSnapshot();

    return () => {
      subscribers.delete(updateSnapshot);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    startInstallPromptMonitoring();

    if (installPromptState.installMethod === "telegram") {
      window.Telegram?.WebApp?.addToHomeScreen?.();
      return;
    }

    if (
      installPromptState.installMethod === "browser" &&
      installPromptState.deferredPrompt
    ) {
      await installPromptState.deferredPrompt.prompt();
      const result = await installPromptState.deferredPrompt.userChoice;

      if (result.outcome === "accepted") {
        setInstallPromptState({
          deferredPrompt: null,
          installMethod: null,
          isInstalled: true,
        });
      } else {
        setInstallPromptState({
          deferredPrompt: null,
          installMethod: "manual",
          isInstalled: false,
        });
      }
    }
  }, []);

  return {
    ...snapshot,
    handleInstall,
  };
}

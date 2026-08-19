"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    /** Captured as early as possible by an inline <head> script in layout.tsx. */
    __kimaraPwaPrompt?: BeforeInstallPromptEvent | null;
    /** Diagnostics set at runtime to debug why the prompt is unavailable. */
    __kimaraPwaDebug?: Record<string, string | boolean>;
  }
}

const STORAGE_KEY = "sda_pwa_installed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  const ua = navigator.userAgent;
  // iPadOS reports a Mac platform but has touch points.
  const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return /iphone|ipad|ipod/i.test(ua) || iPadOS;
}

function isAndroid() {
  return /android/i.test(navigator.userAgent);
}

function hasManifestLink() {
  return !!document.querySelector('link[rel="manifest"]');
}

/**
 * Install popup shown on every visit unless the app is already installed.
 * Chrome/Edge (Android + desktop) fire beforeinstallprompt: the "Install"
 * button calls prompt(), which downloads and installs the app directly on the
 * device — no app store involved. On iPhone/iPad (no install API) it shows the
 * Safari "Add to Home Screen" steps instead. Add ?pwa-debug=1 to the URL to
 * see exactly why the prompt is (un)available on the device.
 */
export default function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window === "undefined") return null;
    return window.__kimaraPwaPrompt ?? null;
  });
  const [visible, setVisible] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [debug] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("pwa-debug") === "1";
  });
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userWantsRef = useRef(false);
  const seenRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (waitTimerRef.current) {
      clearTimeout(waitTimerRef.current);
      waitTimerRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    clearTimers();
    seenRef.current = true;
    userWantsRef.current = false;
    setWaiting(false);
    setVisible(false);
  }, [clearTimers]);

  const completeInstall = useCallback(
    async (p: BeforeInstallPromptEvent) => {
      await p.prompt();
      const choice = await p.userChoice;
      if (choice.outcome === "accepted") {
        seenRef.current = true;
        localStorage.setItem(STORAGE_KEY, "1");
        setWaiting(false);
        setVisible(false);
      } else {
        dismiss();
      }
    },
    [dismiss]
  );

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(STORAGE_KEY)) {
      seenRef.current = true;
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      const p = e as BeforeInstallPromptEvent;
      window.__kimaraPwaPrompt = p;
      deferredRef.current = p;
      setDeferred(p);
      if (seenRef.current) return;
      // If the user already tapped "Install", trigger the native install right away.
      if (userWantsRef.current) {
        void completeInstall(p);
        return;
      }
      setVisible(true);
    };
    const onInstalled = () => {
      seenRef.current = true;
      localStorage.setItem(STORAGE_KEY, "1");
      setWaiting(false);
      setVisible(false);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    if (isIOS()) {
      // iOS never fires beforeinstallprompt — show the manual steps.
      timerRef.current = setTimeout(() => setVisible(true), 2000);
    } else if (deferredRef.current || window.__kimaraPwaPrompt) {
      // The prompt was already captured (inline script) — show Install now.
      setVisible(true);
    } else {
      // Android / desktop: the "Install" button needs the browser's
      // beforeinstallprompt. Show the popup after a short wait. On Android we
      // keep the Install button ready (the SW-control reload enables it); on
      // desktop browsers that never fire the prompt we show a hint instead.
      timerRef.current = setTimeout(() => {
        if (!deferredRef.current) {
          if (!isAndroid()) setUnsupported(true);
          setVisible(true);
        }
      }, 8000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      clearTimers();
    };
  }, [clearTimers, completeInstall]);

  const install = async () => {
    const p = deferred ?? deferredRef.current ?? window.__kimaraPwaPrompt ?? null;
    if (p) {
      await completeInstall(p);
      return;
    }
    // No prompt captured yet — wait for it, then auto-install once it fires.
    userWantsRef.current = true;
    setWaiting(true);
    waitTimerRef.current = setTimeout(() => {
      userWantsRef.current = false;
      setWaiting(false);
      setUnsupported(true);
    }, 5000);
  };

  const reloadToEnable = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  useEffect(() => {
    if (!debug) return;
    window.__kimaraPwaDebug = {
      ...(window.__kimaraPwaDebug ?? {}),
      ua: navigator.userAgent,
      isAndroid: String(isAndroid()),
      isIOS: String(isIOS()),
      standalone: String(isStandalone()),
      manifestLink: String(hasManifestLink()),
      promptCaptured: String(Boolean(deferred || window.__kimaraPwaPrompt)),
      waiting: String(waiting),
      unsupported: String(unsupported),
    };
  }, [debug, deferred, waiting, unsupported]);

  if (!visible) return null;

  const isIOSDevice = isIOS();
  const isAndroidDevice = isAndroid();
  const promptReady = Boolean(deferred || window.__kimaraPwaPrompt);

  // Android: the button always performs an install attempt (or reload to
  // enable one). Desktop non-Chromium / iOS just close with "Got it".
  const primaryAction = isAndroidDevice
    ? waiting
      ? "preparing"
      : unsupported
        ? "reload"
        : promptReady
          ? "install"
          : "install"
    : "close";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-end sm:p-6">
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Install Kimara Youth app"
        className="animate-slide-up relative w-full max-w-sm overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close install prompt"
          className="absolute right-3 top-3 rounded-full p-1.5 text-navy-600 transition-colors hover:bg-navy-100"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex items-center gap-3 border-b border-navy-100 bg-navy-950 px-5 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon-192.png" alt="" width={44} height={44} className="h-11 w-11 rounded-xl" />
          <div>
            <p className="font-display text-base font-bold text-white">Kimara Youth</p>
            <p className="text-xs text-navy-100">Install our app on your device</p>
          </div>
        </div>

        <div className="px-5 py-4">
          {isIOSDevice ? (
            <ol className="list-decimal space-y-2 pl-5 text-sm text-navy-800">
              <li>Tap the <strong>Share</strong> button at the bottom of Safari.</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong> — the app appears on your Home Screen.</li>
            </ol>
          ) : (
            <p className="text-sm text-navy-800">
              {unsupported
                ? isAndroidDevice
                  ? "Your browser didn't offer installation. Reload to retry, or open the site in Chrome."
                  : "Install the Kimara Youth app directly on this device. Use Chrome or Edge on your computer to add it as an app."
                : "Install Kimara Youth directly on this device — it works offline, opens full-screen and never needs an app store."}
            </p>
          )}

          {debug && (
            <div className="mt-3 rounded-lg bg-navy-100 p-3 font-mono text-[10px] leading-relaxed text-navy-900">
              {Object.entries(window.__kimaraPwaDebug ?? {}).map(([k, v]) => (
                <div key={k}>
                  {k}: <span className="font-bold">{String(v)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-3">
            {(isAndroidDevice || unsupported || promptReady) && !waiting && (
              <button
                type="button"
                onClick={dismiss}
                className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-navy-600 transition-colors hover:text-navy-900"
              >
                Not now
              </button>
            )}
            {primaryAction === "preparing" && (
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-navy-900 disabled:opacity-70"
              >
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                Preparing...
              </button>
            )}
            {primaryAction === "install" && (
              <button
                type="button"
                onClick={install}
                className="rounded-full bg-gold-500 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
                Install
              </button>
            )}
            {primaryAction === "reload" && (
              <button
                type="button"
                onClick={reloadToEnable}
                className="rounded-full bg-navy-900 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              >
                Reload to enable
              </button>
            )}
            {primaryAction === "close" && (
              <button
                type="button"
                onClick={dismiss}
                className="rounded-full bg-gold-500 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-400"
              >
                {isIOSDevice ? "Got it" : "Close"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
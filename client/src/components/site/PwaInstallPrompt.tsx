"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const STORAGE_KEY = "sda_pwa_prompt_seen";

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

/**
 * First-visit install prompt. On Android it captures the browser's
 * beforeinstallprompt event and offers a real "Install" action; on iPhone /
 * iPad (which have no such event) it shows step-by-step instructions for
 * Safari's "Add to Home Screen". Mounted once in the root layout so it shows
 * on the landing page, sliding up from the bottom of the screen.
 */
export default function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }, []);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    if (!isAndroid() && !isIOS()) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      const p = e as BeforeInstallPromptEvent;
      deferredRef.current = p;
      setDeferred(p);
      setTimeout(() => setVisible(true), 600);
    };
    const onInstalled = () => {
      localStorage.setItem(STORAGE_KEY, "1");
      setVisible(false);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    // iOS never fires beforeinstallprompt — show manual instructions instead.
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isIOS()) {
      timer = setTimeout(() => setVisible(true), 2200);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const install = async () => {
    const p = deferred ?? deferredRef.current;
    if (!p) return;
    await p.prompt();
    const choice = await p.userChoice;
    if (choice.outcome === "accepted") {
      localStorage.setItem(STORAGE_KEY, "1");
      setVisible(false);
    } else {
      dismiss();
    }
  };

  if (!visible) return null;

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
            <p className="text-xs text-navy-100">Install our app on your phone</p>
          </div>
        </div>

        <div className="px-5 py-4">
          {isIOS() ? (
            <ol className="list-decimal space-y-2 pl-5 text-sm text-navy-800">
              <li>Tap the <strong>Share</strong> button at the bottom of Safari.</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong> — the app appears on your Home Screen.</li>
            </ol>
          ) : (
            <p className="text-sm text-navy-800">
              Add Kimara Youth to your home screen for quick access, live YouTube
              worship links and offline-friendly browsing.
            </p>
          )}

          <div className="mt-4 flex items-center justify-end gap-3">
            {!isIOS() && (
              <button
                type="button"
                onClick={dismiss}
                className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-navy-600 transition-colors hover:text-navy-900"
              >
                Not now
              </button>
            )}
            <button
              type="button"
              onClick={isIOS() ? dismiss : install}
              className="rounded-full bg-gold-500 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-400"
            >
              {isIOS() ? "Got it" : "Install"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
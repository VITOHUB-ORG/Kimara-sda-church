"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __kimaraPwaDebug?: Record<string, string | boolean>;
  }
}

export default function PwaRegister() {
  useEffect(() => {
    const setDiag = (patch: Record<string, string | boolean>) => {
      window.__kimaraPwaDebug = { ...(window.__kimaraPwaDebug ?? {}), ...patch };
    };

    if (!("serviceWorker" in navigator)) {
      setDiag({ swSupported: false, swRegistered: false });
      return;
    }
    setDiag({ swSupported: true });

    const isAndroid = /android/i.test(navigator.userAgent);

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setDiag({ swRegistered: true, swActive: !!reg.active });
          // Chrome's install prompt only fires once the page is controlled by
          // the service worker. On the very first visit that control hasn't
          // happened yet — reload once (per tab session) so the worker can
          // take over and the "Install" button appears. The sw.js activate
          // handler uses clients.claim() so the reload is normally not needed.
          if (!isAndroid) return;
          navigator.serviceWorker.ready.then(() => {
            if (
              !navigator.serviceWorker.controller &&
              !sessionStorage.getItem("sda_pwa_sw_ready")
            ) {
              sessionStorage.setItem("sda_pwa_sw_ready", "1");
              window.location.reload();
            }
          });
        })
        .catch(() => {
          setDiag({ swRegistered: false, swError: "registration failed" });
          /* service worker unavailable — app still works normally */
        });
    };

    register();

    // Re-register after the page fully loads so the worker takes over
    // even when the browser didn't fire the load event yet.
    if (document.readyState === "complete") return;
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
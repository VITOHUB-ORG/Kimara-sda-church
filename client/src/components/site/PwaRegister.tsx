"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {
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

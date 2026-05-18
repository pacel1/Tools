"use client";

import { useEffect, useRef } from "react";
import {
  COOKIE_CONSENT_ACCEPTED_EVENT,
  COOKIE_CONSENT_STORAGE_KEY
} from "@/components/layout/cookie-banner";

const ADSENSE_CLIENT_ID = "ca-pub-5682795103661617";
const GOOGLE_ANALYTICS_ID = "G-XNY8F6HEGK";

type GoogleWindow = Window &
  typeof globalThis & {
    adsbygoogle?: unknown[];
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

function hasAcceptedCookies() {
  return window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) === "accepted";
}

function runWhenIdle(callback: () => void) {
  if ("requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(callback, { timeout: 3000 });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = globalThis.setTimeout(callback, 1500);
  return () => globalThis.clearTimeout(timeoutId);
}

function appendScript({
  datasetKey,
  src,
  crossOrigin
}: {
  datasetKey: string;
  src: string;
  crossOrigin?: string;
}) {
  if (document.querySelector(`script[data-convertbase-script="${datasetKey}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  script.dataset.convertbaseScript = datasetKey;

  if (crossOrigin) {
    script.crossOrigin = crossOrigin;
  }

  document.head.appendChild(script);
}

function loadGoogleScripts() {
  const googleWindow = window as GoogleWindow;

  googleWindow.dataLayer = googleWindow.dataLayer ?? [];
  googleWindow.gtag =
    googleWindow.gtag ??
    function gtag(...args: unknown[]) {
      googleWindow.dataLayer?.push(args);
    };
  googleWindow.gtag("js", new Date());
  googleWindow.gtag("config", GOOGLE_ANALYTICS_ID);

  appendScript({
    datasetKey: "google-analytics",
    src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`
  });

  googleWindow.adsbygoogle = googleWindow.adsbygoogle ?? [];
  appendScript({
    datasetKey: "adsense",
    src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`,
    crossOrigin: "anonymous"
  });
}

export function ConsentScriptLoader() {
  const loadedRef = useRef(false);

  useEffect(() => {
    let cancelIdleLoad: (() => void) | undefined;

    const scheduleLoad = () => {
      if (loadedRef.current || !hasAcceptedCookies()) {
        return;
      }

      loadedRef.current = true;
      cancelIdleLoad = runWhenIdle(loadGoogleScripts);
    };

    scheduleLoad();
    window.addEventListener(COOKIE_CONSENT_ACCEPTED_EVENT, scheduleLoad);

    return () => {
      cancelIdleLoad?.();
      window.removeEventListener(COOKIE_CONSENT_ACCEPTED_EVENT, scheduleLoad);
    };
  }, []);

  return null;
}

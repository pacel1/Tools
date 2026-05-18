"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
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

function configureGoogleAnalytics() {
  const googleWindow = window as GoogleWindow;

  googleWindow.dataLayer = googleWindow.dataLayer ?? [];
  googleWindow.gtag =
    googleWindow.gtag ??
    function gtag(...args: unknown[]) {
      googleWindow.dataLayer?.push(args);
    };
  googleWindow.gtag("js", new Date());
  googleWindow.gtag("config", GOOGLE_ANALYTICS_ID);
}

function loadAdSenseScript() {
  const adsenseScriptUrl = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;

  if (document.querySelector(`script[src="${adsenseScriptUrl}"]`)) {
    return;
  }

  const googleWindow = window as GoogleWindow;
  googleWindow.adsbygoogle = googleWindow.adsbygoogle ?? [];

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = adsenseScriptUrl;
  script.setAttribute("data-ad-client", ADSENSE_CLIENT_ID);
  document.head.appendChild(script);
}

export function ConsentScriptLoader() {
  const [shouldLoadScripts, setShouldLoadScripts] = useState(false);

  useEffect(() => {
    let cancelIdleLoad: (() => void) | undefined;

    const scheduleLoad = () => {
      if (shouldLoadScripts || !hasAcceptedCookies()) {
        return;
      }

      cancelIdleLoad = runWhenIdle(() => setShouldLoadScripts(true));
    };

    scheduleLoad();
    window.addEventListener(COOKIE_CONSENT_ACCEPTED_EVENT, scheduleLoad);

    return () => {
      cancelIdleLoad?.();
      window.removeEventListener(COOKIE_CONSENT_ACCEPTED_EVENT, scheduleLoad);
    };
  }, [shouldLoadScripts]);

  useEffect(() => {
    if (shouldLoadScripts) {
      loadAdSenseScript();
    }
  }, [shouldLoadScripts]);

  if (!shouldLoadScripts) {
    return null;
  }

  return (
    <>
      <Script
        id="google-analytics-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
        onLoad={configureGoogleAnalytics}
      />
    </>
  );
}

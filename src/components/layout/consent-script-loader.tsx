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

// Inline bootstrap (Consent Mode v2): ustawia domyślny stan zgody ZANIM gtag.js
// przetworzy konfigurację. GA ładuje się dla każdego odwiedzającego — przy braku
// zgody w trybie 'denied' wysyła bezcookie'owe, zagregowane sygnały (ruch jest
// widoczny w GA), a pełne śledzenie włącza się po akceptacji cookies.
//
// Stan początkowy czytamy z localStorage tutaj (a nie z Reacta), żeby powracający
// użytkownik dostał od razu 'granted' i nie było wyścigu z domyślnym 'denied'.
const consentBootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var __consent = 'denied';
try { if (window.localStorage.getItem('${COOKIE_CONSENT_STORAGE_KEY}') === 'accepted') { __consent = 'granted'; } } catch (e) {}
gtag('consent', 'default', {
  ad_storage: __consent,
  ad_user_data: __consent,
  ad_personalization: __consent,
  analytics_storage: __consent,
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', '${GOOGLE_ANALYTICS_ID}');
`;

function hasAcceptedCookies() {
  return window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) === "accepted";
}

function grantConsent() {
  const googleWindow = window as GoogleWindow;

  googleWindow.dataLayer = googleWindow.dataLayer ?? [];
  googleWindow.gtag =
    googleWindow.gtag ??
    function gtag(...args: unknown[]) {
      googleWindow.dataLayer?.push(args);
    };

  googleWindow.gtag("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted"
  });
}

function runWhenIdle(callback: () => void) {
  if ("requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(callback, { timeout: 3000 });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = globalThis.setTimeout(callback, 1500);
  return () => globalThis.clearTimeout(timeoutId);
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
  // AdSense pozostaje za zgodą — reklamy wymagają akceptacji cookies.
  const [shouldLoadAds, setShouldLoadAds] = useState(false);

  useEffect(() => {
    let cancelIdleLoad: (() => void) | undefined;

    const scheduleAdLoad = () => {
      if (!shouldLoadAds) {
        cancelIdleLoad = runWhenIdle(() => setShouldLoadAds(true));
      }
    };

    // Powracający użytkownik: zgodę dla GA ustawił już inline bootstrap z
    // localStorage; tu wystarczy doładować AdSense.
    if (hasAcceptedCookies()) {
      scheduleAdLoad();
    }

    // Akceptacja w tej sesji: podnieś zgodę GA (Consent Mode update) + AdSense.
    const onAccepted = () => {
      grantConsent();
      scheduleAdLoad();
    };

    window.addEventListener(COOKIE_CONSENT_ACCEPTED_EVENT, onAccepted);

    return () => {
      cancelIdleLoad?.();
      window.removeEventListener(COOKIE_CONSENT_ACCEPTED_EVENT, onAccepted);
    };
  }, [shouldLoadAds]);

  useEffect(() => {
    if (shouldLoadAds) {
      loadAdSenseScript();
    }
  }, [shouldLoadAds]);

  return (
    <>
      <Script id="google-consent-default" strategy="afterInteractive">
        {consentBootstrap}
      </Script>
      <Script
        id="google-analytics-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}

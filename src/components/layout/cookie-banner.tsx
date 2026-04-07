"use client";

import { useEffect, useState } from "react";

const COOKIE_CONSENT_STORAGE_KEY = "convertbase_cookie_consent=v1";

type CookieBannerCopy = {
  title: string;
  description: string;
  accept: string;
};

export function CookieBanner({ copy }: { copy: CookieBannerCopy }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    setVisible(storedValue !== "accepted");
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-4xl rounded-[28px] border border-white/15 bg-slate-950/95 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100/80">
            {copy.title}
          </p>
          <p className="max-w-2xl text-sm leading-7 text-white/70">
            {copy.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem(
              COOKIE_CONSENT_STORAGE_KEY,
              "accepted"
            );
            setVisible(false);
          }}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          {copy.accept}
        </button>
      </div>
    </div>
  );
}

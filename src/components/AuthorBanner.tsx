import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Locale } from "@/lib/constants";

const linkedInUrl =
  "https://www.linkedin.com/in/pawe%C5%82-celi%C5%84ski-599ba6120";
const authorImageUrl = "/author-pawel-celinski.webp";

export async function AuthorBanner({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "eeat.authorBanner" });
  const headingId = `author-banner-heading-${locale}`;

  return (
    <aside
      aria-labelledby={headingId}
      className="grid gap-6 rounded-[28px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-cyan-950/10 md:grid-cols-[0.85fr_1.15fr] md:items-center"
    >
      <div className="flex items-center gap-4">
        <Image
          src={authorImageUrl}
          alt="Paweł Celiński"
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full border border-cyan-200/30 bg-cyan-300 object-cover"
        />
        <div className="min-w-0 space-y-2">
          <p
            id={headingId}
            className="text-sm tracking-[0.24em] text-cyan-100/75 uppercase"
          >
            {t("heading")}
          </p>
          <div>
            <p className="text-lg font-semibold text-white">Paweł Celiński</p>
            <p className="mt-1 text-sm leading-6 text-white/68">{t("role")}</p>
          </div>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-cyan-100 transition hover:text-white"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current"
            >
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05a3.75 3.75 0 0 1 3.38-1.86c3.61 0 4.28 2.38 4.28 5.47v6.29h-.02ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.04H3.53V8.98H7.1v11.47ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z" />
            </svg>
            {t("linkedin_label")}
          </a>
        </div>
      </div>
      <p className="text-base leading-8 text-white/72">{t("bio")}</p>
    </aside>
  );
}

import Link from "next/link";
import type { LegalPageContent } from "@/lib/pages/types";

export function LegalPageTemplate({ page }: { page: LegalPageContent }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12 lg:px-8 lg:py-16">
      <section className="space-y-5">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">
          ConvertBase.app
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          {page.heading}
        </h1>
        <div className="space-y-4 text-base leading-8 text-white/75">
          {page.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      {page.page === "contact" ? (
        <section className="rounded-[28px] border border-cyan-300/20 bg-cyan-300/10 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/75">
            ConvertBase.app
          </p>
          <p className="mt-3 text-lg text-white/80">
            contact@convertbase.app
          </p>
          <Link
            href="mailto:contact@convertbase.app"
            className="mt-5 inline-flex rounded-full border border-cyan-300/35 px-5 py-2 text-sm font-medium text-cyan-50 transition hover:border-cyan-200 hover:bg-cyan-200/10"
          >
            contact@convertbase.app
          </Link>
        </section>
      ) : null}

      <section className="space-y-5">
        {page.sections?.map((section) => (
          <article
            key={section.title}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              {section.title}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-white/72">
              {section.paragraphs.map((paragraph) => (
                <p key={`${section.title}-${paragraph}`}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

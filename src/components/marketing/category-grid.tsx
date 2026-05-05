import type { Route } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/constants";
import { categoryCatalog } from "@/data/categories/catalog";
import { getActiveCategories } from "@/lib/tools/categories";

export function CategoryGrid({ locale }: { locale: Locale }) {
  const categories = getActiveCategories(locale);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {categories.map((category) => {
        const meta = categoryCatalog[category];

        return (
          <Link
            key={category}
            href={`/${locale}/${category}` as Route}
            className="group rounded-[28px] border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/8"
          >
            <div
              className={`relative mb-4 flex h-24 items-center justify-center overflow-hidden rounded-[22px] bg-linear-to-br ${meta.accent} px-4 text-center ring-1 ring-white/10 ring-inset`}
            >
              <div className="absolute inset-0 bg-slate-950/20 transition group-hover:bg-slate-950/10" />
              <h3 className="relative text-lg font-semibold tracking-tight text-white [text-shadow:0_1px_10px_rgba(2,6,23,0.45)]">
                {meta.label[locale]}
              </h3>
            </div>
            <p className="text-sm leading-6 text-white/65">
              {meta.description[locale]}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

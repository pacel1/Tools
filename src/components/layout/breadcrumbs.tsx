import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";

type BreadcrumbItem = {
  href: string;
  label: ReactNode;
};

function makeDescriptiveLabel(label: ReactNode) {
  if (typeof label !== "string") {
    return label;
  }

  if (label.trim().split(/\s+/).length > 1) {
    return label;
  }

  if (["Home", "Start", "Inicio", "Accueil"].includes(label)) {
    return `${label} ConvertBase`;
  }

  return `${label} tools`;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-white/70">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 ? <span className="text-white/30">/</span> : null}
            <Link className="transition hover:text-white" href={item.href as Route}>
              {makeDescriptiveLabel(item.label)}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

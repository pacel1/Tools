import type { Route } from "next";
import Link from "next/link";
import type { ToolLink } from "@/lib/tools/internal-linking";

export function ToolCard({
  tool,
  titleAs = "h3"
}: {
  tool: ToolLink;
  titleAs?: "h3" | "p";
}) {
  const Title = titleAs;

  return (
    <Link
      href={tool.href as Route}
      className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/8"
    >
      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
        {tool.category} category
      </p>
      <Title className="mt-3 text-xl font-semibold tracking-tight text-white">
        {tool.title}
      </Title>
      <p className="mt-2 text-sm leading-6 text-white/65">{tool.shortDescription}</p>
    </Link>
  );
}

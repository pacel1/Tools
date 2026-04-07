"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import {
  htmlToolBaseLabels,
  htmlToolConfigs,
  type HtmlToolId
} from "@/lib/html-tools/config";
import { useToolUiLabels } from "@/lib/tools/ui-labels";
import { runHtmlCleaner } from "@/tools/logic/html-cleaner";
import { runHtmlEntityEncoder } from "@/tools/logic/html-entity-encoder";
import { runHtmlEscape } from "@/tools/logic/html-escape";
import { runHtmlFormatter } from "@/tools/logic/html-formatter";
import { runHtmlImageExtractor } from "@/tools/logic/html-image-extractor";
import { runHtmlLinkExtractor } from "@/tools/logic/html-link-extractor";
import { runHtmlMinifier } from "@/tools/logic/html-minifier";
import { runHtmlPrettyPrint } from "@/tools/logic/html-pretty-print";
import { runHtmlTagRemover } from "@/tools/logic/html-tag-remover";
import { runHtmlToMarkdown } from "@/tools/logic/html-to-markdown";
import { runHtmlToText } from "@/tools/logic/html-to-text";
import { runHtmlUnescape } from "@/tools/logic/html-unescape";
import { runHtmlValidator } from "@/tools/logic/html-validator";
import { runHtmlViewer } from "@/tools/logic/html-viewer";
import { runMarkdownToHtml } from "@/tools/logic/markdown-to-html";

export function HtmlToolClient({ toolId }: { toolId: HtmlToolId }) {
  const locale = useLocale();
  const config = htmlToolConfigs[toolId];
  const labels = useToolUiLabels(toolId, {
    ...htmlToolBaseLabels,
    input:
      config.inputKind === "markdown"
        ? "Markdown input"
        : config.inputKind === "text"
          ? "Text input"
          : "HTML input",
    placeholder:
      config.inputKind === "markdown"
        ? "Paste markdown here"
        : config.inputKind === "text"
          ? "Paste text here"
          : "Paste HTML here"
  });
  const [source, setSource] = useState(config.sampleInput);
  const [indentSize, setIndentSize] = useState(String(config.defaultIndent ?? 2));
  const [removeComments, setRemoveComments] = useState(true);
  const [copyState, setCopyState] = useState(false);
  const [asyncResult, setAsyncResult] = useState<{
    output: string;
    error: string | null;
  }>({
    output: "",
    error: null
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (toolId !== "html-minifier") {
      return;
    }

    startTransition(() => {
      void runHtmlMinifier({ html: source }).then(
        (result) => {
          setAsyncResult({
            output: result.minifiedHtml,
            error: null
          });
        },
        (error: unknown) => {
          setAsyncResult({
            output: "",
            error: error instanceof Error ? error.message : "Unable to minify HTML."
          });
        }
      );
    });
  }, [source, toolId, startTransition]);

  useEffect(() => {
    if (!copyState) {
      return;
    }

    const timeout = window.setTimeout(() => setCopyState(false), 1500);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  const syncState = useMemo(() => {
    if (toolId === "html-minifier") {
      return null;
    }

    try {
      switch (toolId) {
        case "html-formatter":
          return {
            kind: "text" as const,
            data: runHtmlFormatter({ html: source, indentSize: Number(indentSize) })
          };
        case "html-viewer":
          return { kind: "viewer" as const, data: runHtmlViewer({ html: source }) };
        case "html-to-text":
          return { kind: "text" as const, data: runHtmlToText({ html: source }) };
        case "html-escape":
          return { kind: "text" as const, data: runHtmlEscape({ text: source }) };
        case "html-unescape":
          return { kind: "text" as const, data: runHtmlUnescape({ text: source }) };
        case "html-to-markdown":
          return { kind: "text" as const, data: runHtmlToMarkdown({ html: source }) };
        case "markdown-to-html":
          return { kind: "viewer" as const, data: runMarkdownToHtml({ markdown: source }) };
        case "html-cleaner":
          return {
            kind: "text" as const,
            data: runHtmlCleaner({
              html: source,
              indentSize: Number(indentSize),
              removeComments
            })
          };
        case "html-tag-remover":
          return { kind: "text" as const, data: runHtmlTagRemover({ html: source }) };
        case "html-link-extractor":
          return { kind: "links" as const, data: runHtmlLinkExtractor({ html: source }) };
        case "html-image-extractor":
          return { kind: "images" as const, data: runHtmlImageExtractor({ html: source }) };
        case "html-validator":
          return { kind: "validation" as const, data: runHtmlValidator({ html: source }) };
        case "html-pretty-print":
          return { kind: "text" as const, data: runHtmlPrettyPrint({ html: source }) };
        case "html-entity-encoder":
          return { kind: "text" as const, data: runHtmlEntityEncoder({ text: source }) };
        default:
          return null;
      }
    } catch (error) {
      return {
        kind: "error" as const,
        error: error instanceof Error ? error.message : "Unable to process input."
      };
    }
  }, [indentSize, removeComments, source, toolId]);

  const previewMarkup = useMemo(() => {
    if (!syncState || syncState.kind !== "viewer") {
      return "";
    }

    return syncState.data.sanitizedHtml;
  }, [syncState]);

  const copyValue = useMemo(() => {
    if (toolId === "html-minifier") {
      return asyncResult.output;
    }

    if (!syncState || syncState.kind === "error") {
      return "";
    }

    switch (syncState.kind) {
      case "text":
        return syncState.data.output;
      case "viewer":
        return syncState.data.sanitizedHtml;
      case "links":
        return JSON.stringify(syncState.data.links, null, 2);
      case "images":
        return JSON.stringify(syncState.data.images, null, 2);
      case "validation":
        return JSON.stringify(syncState.data.issues, null, 2);
      default:
        return "";
    }
  }, [asyncResult.output, syncState, toolId]);

  async function copyToClipboard() {
    if (!copyValue) {
      return;
    }

    await navigator.clipboard.writeText(copyValue);
    setCopyState(true);
  }

  const showIndent = toolId === "html-formatter" || toolId === "html-cleaner";
  const showRemoveComments = toolId === "html-cleaner";

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {showIndent ? (
          <div>
            <label className="mb-2 block text-sm text-white/70" htmlFor={`${toolId}-indent`}>
              {labels.indent}
            </label>
            <select
              id={`${toolId}-indent`}
              value={indentSize}
              onChange={(event) => setIndentSize(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
            >
              {[2, 4, 6].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {showRemoveComments ? (
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            <input
              type="checkbox"
              checked={removeComments}
              onChange={(event) => setRemoveComments(event.target.checked)}
            />
            <span>{labels.removeComments}</span>
          </label>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor={`${toolId}-input`}>
          {labels.input}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={source}
          onChange={(event) => setSource(event.target.value)}
          placeholder={labels.placeholder}
          className="min-h-52 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-cyan-300/50"
          spellCheck={toolId === "markdown-to-html"}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-white/60">{locale.toUpperCase()}</p>
        <button
          type="button"
          onClick={() => void copyToClipboard()}
          className="rounded-full border border-cyan-300/30 px-4 py-2 text-sm text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
        >
          {copyState ? labels.copied : labels.copy}
        </button>
      </div>

      {toolId === "html-minifier" ? (
        asyncResult.error ? (
          <ErrorPanel message={asyncResult.error} />
        ) : (
          <ResultPanel
            title={labels.minifiedHtml}
            subtitle={isPending ? `${labels.outputReady}...` : labels.outputReady}
            content={asyncResult.output}
          />
        )
      ) : syncState?.kind === "error" ? (
        <ErrorPanel message={syncState.error} />
      ) : syncState?.kind === "text" ? (
        <ResultPanel
          title={getTextTitle(toolId, labels)}
          subtitle={labels.outputReady}
          content={syncState.data.output}
        />
      ) : syncState?.kind === "viewer" ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">
              {labels.preview}
            </p>
            <div
              className="prose prose-invert mt-4 max-w-none rounded-2xl border border-white/10 bg-slate-950/60 p-4"
              dangerouslySetInnerHTML={{ __html: previewMarkup }}
            />
          </div>
          <ResultPanel
            title={labels.sanitizedHtml}
            subtitle={labels.outputReady}
            content={syncState.data.sanitizedHtml}
            footer={
              <div className="grid gap-3 pt-4 sm:grid-cols-2">
                <MetricCard label={labels.links} value={String(syncState.data.linkCount)} />
                <MetricCard label={labels.images} value={String(syncState.data.imageCount)} />
              </div>
            }
          />
        </div>
      ) : syncState?.kind === "links" ? (
        <ListPanel
          title={labels.extractedLinks}
          total={syncState.data.total}
          emptyLabel={labels.empty}
          items={syncState.data.links.map((item) => ({
            title: item.text,
            rows: [
              { label: labels.href, value: item.href || "-" },
              { label: labels.rel, value: item.rel || "-" },
              { label: labels.target, value: item.target || "-" }
            ]
          }))}
        />
      ) : syncState?.kind === "images" ? (
        <ListPanel
          title={labels.extractedImages}
          total={syncState.data.total}
          emptyLabel={labels.empty}
          items={syncState.data.images.map((item) => ({
            title: item.src || "(no src)",
            rows: [
              { label: labels.alt, value: item.alt || "-" },
              { label: labels.width, value: item.width || "-" },
              { label: labels.height, value: item.height || "-" }
            ]
          }))}
        />
      ) : syncState?.kind === "validation" ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard
              label={syncState.data.isValid ? labels.valid : labels.invalid}
              value={syncState.data.isValid ? "OK" : "CHECK"}
            />
            <MetricCard label={labels.errors} value={String(syncState.data.errorCount)} />
            <MetricCard label={labels.warnings} value={String(syncState.data.warningCount)} />
          </div>
          <div className="space-y-3">
            {syncState.data.issues.length === 0 ? (
              <div className="rounded-[28px] border border-emerald-300/25 bg-emerald-300/10 p-5 text-sm text-emerald-50">
                {labels.valid}
              </div>
            ) : (
              syncState.data.issues.map((issue, index) => (
                <article
                  key={`${issue.message}-${index}`}
                  className="rounded-[28px] border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        issue.severity === "error"
                          ? "rounded-full border border-rose-400/25 bg-rose-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-rose-100"
                          : "rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-100"
                      }
                    >
                      {issue.severity}
                    </span>
                    {issue.context ? <span className="text-xs text-white/45">{issue.context}</span> : null}
                  </div>
                  <p className="mt-4 text-sm font-medium text-white">{issue.message}</p>
                  {issue.suggestion ? (
                    <p className="mt-2 text-sm leading-6 text-white/65">{issue.suggestion}</p>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getTextTitle(toolId: HtmlToolId, labels: Record<string, string>) {
  switch (toolId) {
    case "html-formatter":
      return labels.formattedHtml;
    case "html-cleaner":
      return labels.cleanedHtml;
    case "html-to-text":
    case "html-tag-remover":
      return labels.plainText;
    case "html-to-markdown":
      return labels.markdown;
    case "html-escape":
    case "html-unescape":
    case "html-entity-encoder":
      return labels.encodedText;
    case "html-pretty-print":
      return labels.prettyHtml;
    default:
      return labels.output;
  }
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="rounded-[28px] border border-rose-400/25 bg-rose-400/10 p-5 text-sm text-rose-100">
      {message}
    </div>
  );
}

function ResultPanel({
  title,
  subtitle,
  content,
  footer
}: {
  title: string;
  subtitle: string;
  content: string;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{title}</p>
      <p className="mt-2 text-xs text-white/45">{subtitle}</p>
      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-slate-950/70 p-4 font-mono text-sm text-white/90">
        {content}
      </pre>
      {footer}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function ListPanel({
  title,
  total,
  emptyLabel,
  items
}: {
  title: string;
  total: number;
  emptyLabel: string;
  items: Array<{
    title: string;
    rows: Array<{ label: string; value: string }>;
  }>;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <MetricCard label={title} value={String(total)} />
      </div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm text-white/65">
            {emptyLabel}
          </div>
        ) : (
          items.map((item) => (
            <article
              key={`${item.title}-${item.rows.map((row) => row.value).join("|")}`}
              className="rounded-[28px] border border-white/10 bg-white/5 p-5"
            >
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {item.rows.map((row) => (
                  <div key={`${row.label}-${row.value}`}>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                      {row.label}
                    </p>
                    <p className="mt-2 break-all text-sm text-white/78">{row.value}</p>
                  </div>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

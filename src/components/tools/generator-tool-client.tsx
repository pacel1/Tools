"use client";
/* eslint-disable @next/next/no-img-element */

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { generatorUiLabels, type GeneratorToolId } from "@/lib/generator-tools/config";
import {
  buildBoxShadowCss,
  buildGradientCss,
  buildMetaTagSnippet,
  buildPlaceholderFilename,
  generateQrCodeSvg,
  getFaviconSizes
} from "@/lib/generator-tools/core";
import {
  createPlaceholderImage,
  formatBytes,
  generateFaviconVariants,
  getOutputExtension,
  rasterizeSvgMarkup,
  readFileAsDataUrl,
  type OutputImageFormat
} from "@/lib/image-tools/core";
import { useToolUiLabels } from "@/lib/tools/ui-labels";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/50";
const textareaClassName = `${inputClassName} min-h-40 font-mono`;
const buttonClassName =
  "rounded-full border border-cyan-300/30 px-4 py-2 text-sm text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/10";

export function GeneratorToolClient({ toolId }: { toolId: GeneratorToolId }) {
  switch (toolId) {
    case "qr-code-generator":
      return <QrCodePanel />;
    case "gradient-generator":
      return <GradientPanel />;
    case "box-shadow-generator":
      return <BoxShadowPanel />;
    case "favicon-generator":
      return <FaviconPanel />;
    case "placeholder-image-generator":
      return <PlaceholderPanel />;
    case "meta-tag-generator":
      return <MetaTagPanel />;
    default:
      return null;
  }
}

function QrCodePanel() {
  const labels = useGeneratorLabels("qr-code-generator");
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState("320");
  const [margin, setMargin] = useState("1");
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [foreground, setForeground] = useState("#111827");
  const [background, setBackground] = useState("#ffffff");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState(false);

  useEffect(() => {
    let active = true;
    void generateQrCodeSvg({
      text,
      size: Number(size),
      margin: Number(margin),
      errorCorrectionLevel: level,
      foreground,
      background
    }).then(
      (result) => {
        if (!active) {
          return;
        }

        setSvg(result);
        setError(null);
      },
      (reason: unknown) => {
        if (!active) {
          return;
        }

        setSvg("");
        setError(reason instanceof Error ? reason.message : "Unable to generate QR code.");
      }
    );

    return () => {
      active = false;
    };
  }, [background, foreground, level, margin, size, text]);

  useEffect(() => {
    if (!copyState) {
      return;
    }

    const timeout = window.setTimeout(() => setCopyState(false), 1200);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  async function handleDownloadPng() {
    if (!svg) {
      return;
    }

    const result = await rasterizeSvgMarkup({
      svg,
      size: Number(size),
      format: "png"
    });

    downloadDataUrl(result.dataUrl, "qr-code.png");
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.text}>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            className={textareaClassName}
          />
        </Field>
        <div className="grid gap-4">
          <Field label={labels.size}>
            <input
              type="number"
              min="128"
              max="1024"
              step="32"
              value={size}
              onChange={(event) => setSize(event.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field label={labels.margin}>
            <input
              type="number"
              min="0"
              max="8"
              value={margin}
              onChange={(event) => setMargin(event.target.value)}
              className={inputClassName}
            />
          </Field>
          <Field label={labels.level}>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value as "L" | "M" | "Q" | "H")}
              className={inputClassName}
            >
              {["L", "M", "Q", "H"].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.foreground}>
          <input type="color" value={foreground} onChange={(event) => setForeground(event.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/90 p-2" />
        </Field>
        <Field label={labels.background}>
          <input type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/90 p-2" />
        </Field>
      </div>
      {error ? <ErrorPanel message={error} /> : null}
      {svg ? (
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <PreviewCard title={labels.generatedQr}>
            <div className="rounded-3xl bg-white p-6" dangerouslySetInnerHTML={{ __html: svg }} />
          </PreviewCard>
          <PreviewCard title="SVG">
            <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-slate-950/70 p-4 font-mono text-xs text-white/90">
              {svg}
            </pre>
          </PreviewCard>
        </div>
      ) : null}
      <ActionRow>
        <button type="button" onClick={() => void navigator.clipboard.writeText(svg).then(() => setCopyState(true))} className={buttonClassName} disabled={!svg}>
          {copyState ? labels.copied : labels.copy}
        </button>
        <button type="button" onClick={() => downloadText(svg, "qr-code.svg", "image/svg+xml")} className={buttonClassName} disabled={!svg}>
          {labels.downloadSvg}
        </button>
        <button type="button" onClick={() => void handleDownloadPng()} className={buttonClassName} disabled={!svg}>
          {labels.downloadPng}
        </button>
      </ActionRow>
    </div>
  );
}

function GradientPanel() {
  const labels = useGeneratorLabels("gradient-generator");
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState("135");
  const [colorOne, setColorOne] = useState("#0f172a");
  const [colorTwo, setColorTwo] = useState("#22d3ee");
  const [copied, setCopied] = useState(false);
  const css = useMemo(
    () =>
      buildGradientCss({
        gradientType,
        angle: Number(angle),
        colorOne,
        colorTwo
      }),
    [angle, colorOne, colorTwo, gradientType]
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.gradientType}>
          <select value={gradientType} onChange={(event) => setGradientType(event.target.value as "linear" | "radial")} className={inputClassName}>
            <option value="linear">{labels.linear}</option>
            <option value="radial">{labels.radial}</option>
          </select>
        </Field>
        <Field label={labels.angle}>
          <input type="number" min="0" max="360" value={angle} onChange={(event) => setAngle(event.target.value)} className={inputClassName} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.colorOne}>
          <input type="color" value={colorOne} onChange={(event) => setColorOne(event.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/90 p-2" />
        </Field>
        <Field label={labels.colorTwo}>
          <input type="color" value={colorTwo} onChange={(event) => setColorTwo(event.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/90 p-2" />
        </Field>
      </div>
      <PreviewCard title={labels.preview}>
        <div className="h-56 rounded-3xl border border-white/10" style={{ background: css.replace(/^background:\s*|;$/g, "") }} />
      </PreviewCard>
      <CodePanel title={labels.cssCode} content={css} copied={copied} onCopy={() => void navigator.clipboard.writeText(css).then(() => setCopied(true))} />
    </div>
  );
}

function BoxShadowPanel() {
  const labels = useGeneratorLabels("box-shadow-generator");
  const [offsetX, setOffsetX] = useState("0");
  const [offsetY, setOffsetY] = useState("18");
  const [blur, setBlur] = useState("36");
  const [spread, setSpread] = useState("0");
  const [opacity, setOpacity] = useState("0.25");
  const [color, setColor] = useState("#0f172a");
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);
  const css = useMemo(
    () =>
      buildBoxShadowCss({
        offsetX: Number(offsetX),
        offsetY: Number(offsetY),
        blur: Number(blur),
        spread: Number(spread),
        color,
        opacity: Number(opacity),
        inset
      }),
    [blur, color, inset, offsetX, offsetY, opacity, spread]
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.offsetX}><input type="number" value={offsetX} onChange={(event) => setOffsetX(event.target.value)} className={inputClassName} /></Field>
        <Field label={labels.offsetY}><input type="number" value={offsetY} onChange={(event) => setOffsetY(event.target.value)} className={inputClassName} /></Field>
        <Field label={labels.blur}><input type="number" min="0" value={blur} onChange={(event) => setBlur(event.target.value)} className={inputClassName} /></Field>
        <Field label={labels.spread}><input type="number" value={spread} onChange={(event) => setSpread(event.target.value)} className={inputClassName} /></Field>
        <Field label={labels.opacity}><input type="number" min="0" max="1" step="0.05" value={opacity} onChange={(event) => setOpacity(event.target.value)} className={inputClassName} /></Field>
        <Field label={labels.colorOne}><input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/90 p-2" /></Field>
      </div>
      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
        <input type="checkbox" checked={inset} onChange={(event) => setInset(event.target.checked)} />
        <span>{labels.inset}</span>
      </label>
      <PreviewCard title={labels.preview}>
        <div className="flex h-56 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/50">
          <div className="h-28 w-28 rounded-3xl bg-cyan-300/90" style={{ boxShadow: css.replace(/^box-shadow:\s*|;$/g, "") }} />
        </div>
      </PreviewCard>
      <CodePanel title={labels.cssCode} content={css} copied={copied} onCopy={() => void navigator.clipboard.writeText(css).then(() => setCopied(true))} />
    </div>
  );
}

function FaviconPanel() {
  const labels = useGeneratorLabels("favicon-generator");
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputImageFormat>("png");
  const [results, setResults] = useState<Array<{ size: number; dataUrl: string; bytes: number }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setResults([]);
      return;
    }

    let active = true;
    void readFileAsDataUrl(file)
      .then((sourceDataUrl) =>
        generateFaviconVariants({
          sourceDataUrl,
          sizes: getFaviconSizes(),
          format
        })
      )
      .then(
        (variants) => {
          if (!active) {
            return;
          }

          setResults(variants.map((item) => ({ size: item.size, dataUrl: item.dataUrl, bytes: item.bytes })));
          setError(null);
        },
        (reason: unknown) => {
          if (!active) {
            return;
          }

          setError(reason instanceof Error ? reason.message : "Unable to generate favicons.");
          setResults([]);
        }
      );

    return () => {
      active = false;
    };
  }, [file, format]);

  return (
    <div className="space-y-5">
      <Field label={labels.file}>
        <input type="file" accept="image/*" className={inputClassName} onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
      </Field>
      <Field label={labels.format}>
        <select value={format} onChange={(event) => setFormat(event.target.value as OutputImageFormat)} className={inputClassName}>
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WebP</option>
        </select>
      </Field>
      {error ? <ErrorPanel message={error} /> : null}
      {results.length ? (
        <div className="space-y-4">
          <PreviewCard title={labels.faviconSet}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {results.map((item) => (
                <button
                  key={item.size}
                  type="button"
                  onClick={() => downloadDataUrl(item.dataUrl, `favicon-${item.size}.${getOutputExtension(format)}`)}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                >
                  <img src={item.dataUrl} alt={`favicon ${item.size}`} className="mx-auto h-16 w-16 rounded-2xl bg-white object-contain p-2" />
                  <p className="mt-3 text-sm font-medium text-white">{item.size} x {item.size}</p>
                  <p className="text-xs text-white/55">{formatBytes(item.bytes)}</p>
                </button>
              ))}
            </div>
          </PreviewCard>
          <ActionRow>
            <button
              type="button"
              onClick={() => {
                results.forEach((item) => {
                  downloadDataUrl(item.dataUrl, `favicon-${item.size}.${getOutputExtension(format)}`);
                });
              }}
              className={buttonClassName}
            >
              {labels.downloadAll}
            </button>
          </ActionRow>
        </div>
      ) : null}
    </div>
  );
}

function PlaceholderPanel() {
  const labels = useGeneratorLabels("placeholder-image-generator");
  const [width, setWidth] = useState("1200");
  const [height, setHeight] = useState("630");
  const [background, setBackground] = useState("#0f172a");
  const [foreground, setForeground] = useState("#f8fafc");
  const [text, setText] = useState("1200x630");
  const [format, setFormat] = useState<OutputImageFormat>("png");
  const [result, setResult] = useState<{ dataUrl: string; bytes: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void createPlaceholderImage({
      width: Number(width),
      height: Number(height),
      background,
      color: foreground,
      text,
      format
    }).then(
      (value) => {
        if (!active) {
          return;
        }

        setResult({ dataUrl: value.dataUrl, bytes: value.bytes });
        setError(null);
      },
      (reason: unknown) => {
        if (!active) {
          return;
        }

        setError(reason instanceof Error ? reason.message : "Unable to generate placeholder.");
        setResult(null);
      }
    );

    return () => {
      active = false;
    };
  }, [background, foreground, format, height, text, width]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.width}><input type="number" min="1" value={width} onChange={(event) => setWidth(event.target.value)} className={inputClassName} /></Field>
        <Field label={labels.height}><input type="number" min="1" value={height} onChange={(event) => setHeight(event.target.value)} className={inputClassName} /></Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.background}><input type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/90 p-2" /></Field>
        <Field label={labels.foreground}><input type="color" value={foreground} onChange={(event) => setForeground(event.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/90 p-2" /></Field>
      </div>
      <Field label={labels.text}>
        <input value={text} onChange={(event) => setText(event.target.value)} className={inputClassName} />
      </Field>
      <Field label={labels.format}>
        <select value={format} onChange={(event) => setFormat(event.target.value as OutputImageFormat)} className={inputClassName}>
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WebP</option>
        </select>
      </Field>
      {error ? <ErrorPanel message={error} /> : null}
      {result ? (
        <div className="space-y-4">
          <PreviewCard title={labels.placeholderImage}>
            <img src={result.dataUrl} alt={labels.placeholderImage} className="w-full rounded-3xl border border-white/10 bg-slate-950/40 object-contain" />
          </PreviewCard>
          <ActionRow>
            <span className="text-sm text-white/55">{formatBytes(result.bytes)}</span>
            <button type="button" onClick={() => downloadDataUrl(result.dataUrl, buildPlaceholderFilename(Number(width), Number(height), getOutputExtension(format)))} className={buttonClassName}>
              {labels.download}
            </button>
          </ActionRow>
        </div>
      ) : null}
    </div>
  );
}

function MetaTagPanel() {
  const labels = useGeneratorLabels("meta-tag-generator");
  const [title, setTitle] = useState("Example page title");
  const [description, setDescription] = useState("Short meta description for your page.");
  const [canonicalUrl, setCanonicalUrl] = useState("https://example.com/page");
  const [siteName, setSiteName] = useState("Example Site");
  const [ogImage, setOgImage] = useState("https://example.com/og-image.jpg");
  const [copied, setCopied] = useState(false);
  const snippet = useMemo(
    () =>
      buildMetaTagSnippet({
        title,
        description,
        canonicalUrl,
        siteName,
        ogImage
      }),
    [canonicalUrl, description, ogImage, siteName, title]
  );

  return (
    <div className="space-y-5">
      <Field label={labels.title}><input value={title} onChange={(event) => setTitle(event.target.value)} className={inputClassName} /></Field>
      <Field label={labels.description}><textarea value={description} onChange={(event) => setDescription(event.target.value)} className={textareaClassName} /></Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.canonicalUrl}><input value={canonicalUrl} onChange={(event) => setCanonicalUrl(event.target.value)} className={inputClassName} /></Field>
        <Field label={labels.siteName}><input value={siteName} onChange={(event) => setSiteName(event.target.value)} className={inputClassName} /></Field>
      </div>
      <Field label={labels.ogImage}><input value={ogImage} onChange={(event) => setOgImage(event.target.value)} className={inputClassName} /></Field>
      <CodePanel title={labels.snippet} content={snippet} copied={copied} onCopy={() => void navigator.clipboard.writeText(snippet).then(() => setCopied(true))} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/70">{label}</label>
      {children}
    </div>
  );
}

function PreviewCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function CodePanel({
  title,
  content,
  copied,
  onCopy
}: {
  title: string;
  content: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <PreviewCard title={title}>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-slate-950/70 p-4 font-mono text-xs text-white/90">
        {content}
      </pre>
      <ActionRow>
        <button type="button" onClick={onCopy} className={buttonClassName}>
          {copied ? "Copied" : "Copy"}
        </button>
      </ActionRow>
    </PreviewCard>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="rounded-[28px] border border-rose-400/25 bg-rose-400/10 p-5 text-sm text-rose-100">
      {message}
    </div>
  );
}

function ActionRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

function useGeneratorLabels(toolId: GeneratorToolId) {
  const locale = useLocale();
  return useToolUiLabels(toolId, generatorUiLabels[locale as keyof typeof generatorUiLabels]);
}

function downloadText(value: string, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([value], { type }));
  downloadUrl(url, name);
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function downloadDataUrl(dataUrl: string, name: string) {
  downloadUrl(dataUrl, name);
}

function downloadUrl(url: string, name: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
}

"use client";
/* eslint-disable @next/next/no-img-element */

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { imageUiLabels, type ImageToolId } from "@/lib/image-tools/config";
import {
  extractImageMetadata,
  formatBytes,
  getOutputExtension,
  loadImageFromDataUrl,
  readFileAsDataUrl,
  renderImageTransform,
  type OutputImageFormat
} from "@/lib/image-tools/core";
import { useToolUiLabels } from "@/lib/tools/ui-labels";
import { runBase64ToImage } from "@/tools/logic/base64-to-image";
import { runImageCompressor } from "@/tools/logic/image-compressor";
import { runImageCropper } from "@/tools/logic/image-cropper";
import { runImageFormatConverter } from "@/tools/logic/image-format-converter";
import { runImageMetadataReader } from "@/tools/logic/image-metadata-reader";
import { runImageResizer } from "@/tools/logic/image-resizer";
import { runImageToBase64 } from "@/tools/logic/image-to-base64";
import type { ImageMetadataReaderOutput } from "@/tools/schema/image-metadata-reader";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/50";
const textareaClassName = `${inputClassName} min-h-44 font-mono`;
const buttonClassName =
  "rounded-full border border-cyan-300/30 px-4 py-2 text-sm text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/10";

export function ImageToolClient({ toolId }: { toolId: ImageToolId }) {
  switch (toolId) {
    case "image-resizer":
      return <ImageResizerPanel />;
    case "image-compressor":
      return <ImageCompressorPanel />;
    case "image-cropper":
      return <ImageCropperPanel />;
    case "image-to-base64":
      return <ImageToBase64Panel />;
    case "base64-to-image":
      return <Base64ToImagePanel />;
    case "image-format-converter":
      return <ImageFormatConverterPanel />;
    case "image-metadata-reader":
      return <ImageMetadataReaderPanel />;
    default:
      return null;
  }
}

function ImageResizerPanel() {
  const labels = useImageLabels("image-resizer");
  const [file, setFile] = useState<File | null>(null);
  const [sourceDataUrl, setSourceDataUrl] = useState("");
  const [targetWidth, setTargetWidth] = useState("1200");
  const [targetHeight, setTargetHeight] = useState("1200");
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [format, setFormat] = useState<OutputImageFormat>("png");
  const [sourceSize, setSourceSize] = useState<{ width: number; height: number } | null>(null);
  const [result, setResult] = useState<ImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const plan = useMemo(
    () =>
      file && sourceSize
        ? runImageResizer({
            sourceName: file.name,
            sourceDataUrl,
            originalWidth: sourceSize.width,
            originalHeight: sourceSize.height,
            targetWidth: Number(targetWidth),
            targetHeight: Number(targetHeight),
            keepAspectRatio,
            format
          })
        : null,
    [file, format, keepAspectRatio, sourceDataUrl, sourceSize, targetHeight, targetWidth]
  );

  useEffect(() => {
    if (!file) {
      setSourceDataUrl("");
      setSourceSize(null);
      setResult(null);
      return;
    }

    let active = true;
    void readFileAsDataUrl(file).then(
      (value) => {
        if (active) {
          setSourceDataUrl(value);
        }
      },
      (reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Unable to read image.");
        }
      }
    );

    return () => {
      active = false;
    };
  }, [file]);

  useEffect(() => {
    if (!sourceDataUrl) {
      return;
    }

    let active = true;
    void loadImageFromDataUrl(sourceDataUrl).then(
      (loaded) => {
        if (!active) {
          return;
        }

        setSourceSize({ width: loaded.width, height: loaded.height });
        setTargetWidth(String(loaded.width));
        setTargetHeight(String(loaded.height));
      },
      (reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Unable to load image.");
        }
      }
    );

    return () => {
      active = false;
    };
  }, [sourceDataUrl]);

  useEffect(() => {
    if (!file || !sourceDataUrl || !plan) {
      return;
    }

    let active = true;
    void renderImageTransform({
      sourceDataUrl,
      width: plan.width,
      height: plan.height,
      format
    }).then(
      (value) => {
        if (!active) {
          return;
        }

        setResult({
          ...value,
          originalWidth: plan.originalWidth,
          originalHeight: plan.originalHeight,
          fileName: plan.downloadName
        });
        setError(null);
      },
      (reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Unable to resize image.");
        }
      }
    );

    return () => {
      active = false;
    };
  }, [file, format, plan, sourceDataUrl]);

  return (
    <div className="space-y-5">
      <UploadField label={labels.file} onChange={setFile} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.width}><input type="number" min="1" value={targetWidth} onChange={(event) => setTargetWidth(event.target.value)} className={inputClassName} /></Field>
        <Field label={labels.height}><input type="number" min="1" value={targetHeight} onChange={(event) => setTargetHeight(event.target.value)} className={inputClassName} /></Field>
      </div>
      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
        <input type="checkbox" checked={keepAspectRatio} onChange={(event) => setKeepAspectRatio(event.target.checked)} />
        <span>{labels.keepAspectRatio}</span>
      </label>
      <FormatField format={format} setFormat={setFormat} labels={labels} />
      <ImageOutput labels={labels} result={result} error={error} />
    </div>
  );
}

function ImageCompressorPanel() {
  const labels = useImageLabels("image-compressor");
  const [file, setFile] = useState<File | null>(null);
  const [sourceDataUrl, setSourceDataUrl] = useState("");
  const [quality, setQuality] = useState("0.75");
  const [format, setFormat] = useState<OutputImageFormat>("jpeg");
  const [sourceSize, setSourceSize] = useState<{ width: number; height: number } | null>(null);
  const [result, setResult] = useState<ImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFileDataUrl(file, setSourceDataUrl, setError);

  useImageMeta(sourceDataUrl, setSourceSize, setError);

  useEffect(() => {
    if (!file || !sourceDataUrl || !sourceSize) {
      setResult(null);
      return;
    }

    let active = true;
    const plan = runImageCompressor({
      sourceName: file.name,
      sourceDataUrl,
      width: sourceSize.width,
      height: sourceSize.height,
      format,
      quality: Number(quality),
      originalBytes: file.size
    });

    void renderImageTransform({
      sourceDataUrl,
      width: plan.width,
      height: plan.height,
      format,
      quality: plan.quality
    }).then(
      (value) => {
        if (active) {
          setResult({ ...value, fileName: plan.downloadName, originalBytes: file.size });
          setError(null);
        }
      },
      (reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Unable to compress image.");
        }
      }
    );

    return () => {
      active = false;
    };
  }, [file, format, quality, sourceDataUrl, sourceSize]);

  return (
    <div className="space-y-5">
      <UploadField label={labels.file} onChange={setFile} />
      <Field label={labels.quality}><input type="number" min="0.1" max="0.95" step="0.05" value={quality} onChange={(event) => setQuality(event.target.value)} className={inputClassName} /></Field>
      <FormatField format={format} setFormat={setFormat} labels={labels} />
      <ImageOutput labels={labels} result={result} error={error} />
    </div>
  );
}

function ImageCropperPanel() {
  const labels = useImageLabels("image-cropper");
  const [file, setFile] = useState<File | null>(null);
  const [sourceDataUrl, setSourceDataUrl] = useState("");
  const [x, setX] = useState("0");
  const [y, setY] = useState("0");
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("800");
  const [format, setFormat] = useState<OutputImageFormat>("png");
  const [sourceSize, setSourceSize] = useState<{ width: number; height: number } | null>(null);
  const [result, setResult] = useState<ImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFileDataUrl(file, setSourceDataUrl, setError);
  useImageMeta(sourceDataUrl, setSourceSize, setError);

  useEffect(() => {
    if (!sourceSize) {
      return;
    }

    setWidth(String(Math.max(1, Math.round(sourceSize.width * 0.8))));
    setHeight(String(Math.max(1, Math.round(sourceSize.height * 0.8))));
  }, [sourceSize?.height, sourceSize?.width]);

  useEffect(() => {
    if (!file || !sourceDataUrl || !sourceSize) {
      setResult(null);
      return;
    }

    let active = true;
    const plan = runImageCropper({
      sourceName: file.name,
      sourceDataUrl,
      imageWidth: sourceSize.width,
      imageHeight: sourceSize.height,
      x: Number(x),
      y: Number(y),
      width: Number(width),
      height: Number(height),
      format
    });

    void renderImageTransform({
      sourceDataUrl,
      width: plan.width,
      height: plan.height,
      format,
      crop: plan.crop
    }).then(
      (value) => {
        if (active) {
          setResult({ ...value, fileName: plan.downloadName });
          setError(null);
        }
      },
      (reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Unable to crop image.");
        }
      }
    );

    return () => {
      active = false;
    };
  }, [file, format, height, sourceDataUrl, sourceSize, width, x, y]);

  return (
    <div className="space-y-5">
      <UploadField label={labels.file} onChange={setFile} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.cropX}><input type="number" min="0" value={x} onChange={(event) => setX(event.target.value)} className={inputClassName} /></Field>
        <Field label={labels.cropY}><input type="number" min="0" value={y} onChange={(event) => setY(event.target.value)} className={inputClassName} /></Field>
        <Field label={labels.cropWidth}><input type="number" min="1" value={width} onChange={(event) => setWidth(event.target.value)} className={inputClassName} /></Field>
        <Field label={labels.cropHeight}><input type="number" min="1" value={height} onChange={(event) => setHeight(event.target.value)} className={inputClassName} /></Field>
      </div>
      <FormatField format={format} setFormat={setFormat} labels={labels} />
      <ImageOutput labels={labels} result={result} error={error} />
    </div>
  );
}

function ImageFormatConverterPanel() {
  const labels = useImageLabels("image-format-converter");
  const [file, setFile] = useState<File | null>(null);
  const [sourceDataUrl, setSourceDataUrl] = useState("");
  const [format, setFormat] = useState<OutputImageFormat>("webp");
  const [quality, setQuality] = useState("0.82");
  const [sourceSize, setSourceSize] = useState<{ width: number; height: number } | null>(null);
  const [result, setResult] = useState<ImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFileDataUrl(file, setSourceDataUrl, setError);
  useImageMeta(sourceDataUrl, setSourceSize, setError);

  useEffect(() => {
    if (!file || !sourceDataUrl || !sourceSize) {
      setResult(null);
      return;
    }

    let active = true;
    const plan = runImageFormatConverter({
      sourceName: file.name,
      sourceDataUrl,
      width: sourceSize.width,
      height: sourceSize.height,
      targetFormat: format,
      quality: Number(quality)
    });

    void renderImageTransform({
      sourceDataUrl,
      width: plan.width,
      height: plan.height,
      format: plan.targetFormat,
      quality: plan.quality
    }).then(
      (value) => {
        if (active) {
          setResult({ ...value, fileName: plan.downloadName });
          setError(null);
        }
      },
      (reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Unable to convert image.");
        }
      }
    );

    return () => {
      active = false;
    };
  }, [file, format, quality, sourceDataUrl, sourceSize]);

  return (
    <div className="space-y-5">
      <UploadField label={labels.file} onChange={setFile} />
      <FormatField format={format} setFormat={setFormat} labels={labels} />
      <Field label={labels.quality}><input type="number" min="0.1" max="0.95" step="0.05" value={quality} onChange={(event) => setQuality(event.target.value)} className={inputClassName} /></Field>
      <ImageOutput labels={labels} result={result} error={error} />
    </div>
  );
}

function ImageToBase64Panel() {
  const labels = useImageLabels("image-to-base64");
  const [file, setFile] = useState<File | null>(null);
  const [sourceDataUrl, setSourceDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFileDataUrl(file, setSourceDataUrl, setError);

  const result = !sourceDataUrl
    ? null
    : safeRun(() => runImageToBase64({ sourceName: file?.name ?? "image", dataUrl: sourceDataUrl }), setError);

  return (
    <div className="space-y-5">
      <UploadField label={labels.file} onChange={setFile} />
      {error ? <ErrorPanel message={error} /> : null}
      {result ? (
        <>
          <PreviewCard title={labels.imagePreview}>
            <img src={result.dataUrl} alt={labels.imagePreview} className="max-h-72 rounded-3xl border border-white/10 bg-slate-950/50 object-contain" />
          </PreviewCard>
          <CodePanel title={labels.base64} content={result.base64} copied={copied} copyLabel={labels.copy} copiedLabel={labels.copied} onCopy={() => void navigator.clipboard.writeText(result.base64).then(() => setCopied(true))} />
        </>
      ) : null}
    </div>
  );
}

function Base64ToImagePanel() {
  const labels = useImageLabels("base64-to-image");
  const [value, setValue] = useState("");
  const [format, setFormat] = useState<OutputImageFormat>("png");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const result = !value.trim() ? null : safeRun(() => runBase64ToImage({ value, format }), setError);

  return (
    <div className="space-y-5">
      <Field label={labels.base64}>
        <textarea value={value} onChange={(event) => setValue(event.target.value)} className={textareaClassName} />
      </Field>
      <FormatField format={format} setFormat={setFormat} labels={labels} />
      {error ? <ErrorPanel message={error} /> : null}
      {result ? (
        <>
          <PreviewCard title={labels.decodedImage}>
            <img src={result.dataUrl} alt={labels.decodedImage} className="max-h-72 rounded-3xl border border-white/10 bg-slate-950/50 object-contain" />
          </PreviewCard>
          <ActionRow>
            <button type="button" onClick={() => void navigator.clipboard.writeText(result.dataUrl).then(() => setCopied(true))} className={buttonClassName}>
              {copied ? labels.copied : labels.copy}
            </button>
            <button type="button" onClick={() => downloadDataUrl(result.dataUrl, `decoded-image.${getOutputExtension(format)}`)} className={buttonClassName}>
              {labels.download}
            </button>
          </ActionRow>
        </>
      ) : null}
    </div>
  );
}

function ImageMetadataReaderPanel() {
  const labels = useImageLabels("image-metadata-reader");
  const [file, setFile] = useState<File | null>(null);
  const [sourceDataUrl, setSourceDataUrl] = useState("");
  const [result, setResult] = useState<ImageMetadataReaderOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useFileDataUrl(file, setSourceDataUrl, setError);

  useEffect(() => {
    if (!file) {
      setResult(null);
      return;
    }

    let active = true;
    void extractImageMetadata(file).then(
      (metadata) => {
        if (!active) {
          return;
        }

        const normalized = runImageMetadataReader(metadata);
        setResult(normalized);
        setError(null);
      },
      (reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Unable to read photo metadata.");
          setResult(null);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [file]);

  const summaryRows = result
    ? [
        { label: labels.camera, value: [result.cameraMake, result.cameraModel].filter(Boolean).join(" ") || "-" },
        { label: labels.lens, value: result.lensModel ?? "-" },
        { label: labels.dateTaken, value: result.dateTaken ? formatDateDisplay(result.dateTaken) : "-" },
        { label: labels.resolution, value: `${result.width} x ${result.height}` },
        { label: labels.fileSize, value: formatBytes(result.fileSizeBytes) },
        { label: labels.iso, value: result.iso ? String(result.iso) : "-" },
        { label: labels.exposure, value: result.exposureTime ?? "-" },
        { label: labels.aperture, value: result.fNumber ?? "-" },
        { label: labels.focalLength, value: result.focalLength ?? "-" },
        { label: labels.flash, value: result.flash ?? "-" },
        { label: labels.orientation, value: result.orientation ?? "-" }
      ]
    : [];
  const hasRawMetadata = Boolean(result && Object.keys(result.raw).length > 0);

  return (
    <div className="space-y-5">
      <UploadField label={labels.file} onChange={setFile} />
      {error ? <ErrorPanel message={error} /> : null}
      {sourceDataUrl ? (
        <PreviewCard title={labels.imagePreview}>
          <img src={sourceDataUrl} alt={labels.imagePreview} className="max-h-80 rounded-3xl border border-white/10 bg-slate-950/50 object-contain" />
        </PreviewCard>
      ) : null}
      {result ? (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            {summaryRows.map((row) => (
              <MetricCard key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
          {result.gps ? (
            <PreviewCard title={labels.gpsLocation}>
              <div className="grid gap-3 md:grid-cols-2">
                <MetricCard label={labels.latitude} value={result.gps.latitude.toFixed(6)} />
                <MetricCard label={labels.longitude} value={result.gps.longitude.toFixed(6)} />
              </div>
              <ActionRow>
                <a
                  href={result.gps.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonClassName}
                >
                  {labels.openMap}
                </a>
              </ActionRow>
            </PreviewCard>
          ) : null}
          {!hasRawMetadata ? (
            <div className="rounded-[28px] border border-amber-400/25 bg-amber-400/10 p-5 text-sm text-amber-50">
              {labels.noMetadataFound}
            </div>
          ) : (
            <CodePanel
              title={labels.rawMetadata}
              content={JSON.stringify(result.raw, null, 2)}
              copied={copied}
              copyLabel={labels.copy}
              copiedLabel={labels.copied}
              onCopy={() =>
                void navigator.clipboard
                  .writeText(JSON.stringify(result.raw, null, 2))
                  .then(() => setCopied(true))
              }
            />
          )}
        </>
      ) : null}
    </div>
  );
}

type ImageResult = {
  dataUrl: string;
  bytes: number;
  width: number;
  height: number;
  fileName: string;
  originalBytes?: number;
  originalWidth?: number;
  originalHeight?: number;
};

function useFileDataUrl(
  file: File | null,
  setSourceDataUrl: (value: string) => void,
  setError: (value: string | null) => void
) {
  useEffect(() => {
    if (!file) {
      setSourceDataUrl("");
      return;
    }

    let active = true;
    void readFileAsDataUrl(file).then(
      (value) => {
        if (active) {
          setSourceDataUrl(value);
          setError(null);
        }
      },
      (reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Unable to read image.");
        }
      }
    );

    return () => {
      active = false;
    };
  }, [file, setError, setSourceDataUrl]);
}

function useImageMeta(
  sourceDataUrl: string,
  setSourceSize: (value: { width: number; height: number } | null) => void,
  setError: (value: string | null) => void
) {
  useEffect(() => {
    if (!sourceDataUrl) {
      setSourceSize(null);
      return;
    }

    let active = true;
    void loadImageFromDataUrl(sourceDataUrl).then(
      (loaded) => {
        if (active) {
          setSourceSize({ width: loaded.width, height: loaded.height });
          setError(null);
        }
      },
      (reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Unable to load image.");
        }
      }
    );

    return () => {
      active = false;
    };
  }, [setError, setSourceSize, sourceDataUrl]);
}

function UploadField({
  label,
  onChange
}: {
  label: string;
  onChange: (file: File | null) => void;
}) {
  return (
    <Field label={label}>
      <input type="file" accept="image/*" onChange={(event) => onChange(event.target.files?.[0] ?? null)} className={inputClassName} />
    </Field>
  );
}

function FormatField({
  format,
  setFormat,
  labels
}: {
  format: OutputImageFormat;
  setFormat: (value: OutputImageFormat) => void;
  labels: Record<string, string>;
}) {
  return (
    <Field label={labels.format}>
      <select value={format} onChange={(event) => setFormat(event.target.value as OutputImageFormat)} className={inputClassName}>
        <option value="png">PNG</option>
        <option value="jpeg">JPEG</option>
        <option value="webp">WebP</option>
      </select>
    </Field>
  );
}

function ImageOutput({
  labels,
  result,
  error
}: {
  labels: Record<string, string>;
  result: ImageResult | null;
  error: string | null;
}) {
  if (error) {
    return <ErrorPanel message={error} />;
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-4">
      <PreviewCard title={labels.result}>
        <img src={result.dataUrl} alt={labels.result} className="max-h-80 rounded-3xl border border-white/10 bg-slate-950/50 object-contain" />
      </PreviewCard>
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard label={labels.outputSize} value={`${result.width} x ${result.height}`} />
        <MetricCard label={labels.result} value={formatBytes(result.bytes)} />
        {result.originalBytes ? (
          <MetricCard label={labels.savedSize} value={formatBytes(Math.max(result.originalBytes - result.bytes, 0))} />
        ) : null}
      </div>
      <ActionRow>
        <button type="button" onClick={() => downloadDataUrl(result.dataUrl, result.fileName)} className={buttonClassName}>
          {labels.download}
        </button>
      </ActionRow>
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
  copyLabel = "Copy",
  copiedLabel = "Copied",
  onCopy
}: {
  title: string;
  content: string;
  copied: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  onCopy: () => void;
}) {
  return (
    <PreviewCard title={title}>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-slate-950/70 p-4 font-mono text-xs text-white/90">
        {content}
      </pre>
      <ActionRow>
        <button type="button" onClick={onCopy} className={buttonClassName}>
          {copied ? copiedLabel : copyLabel}
        </button>
      </ActionRow>
    </PreviewCard>
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

function useImageLabels(toolId: ImageToolId) {
  const locale = useLocale();
  return useToolUiLabels(toolId, imageUiLabels[locale as keyof typeof imageUiLabels]);
}

function downloadDataUrl(dataUrl: string, name: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = name;
  link.click();
}

function formatDateDisplay(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function safeRun<T>(fn: () => T, setError: (value: string | null) => void) {
  try {
    const result = fn();
    setError(null);
    return result;
  } catch (reason) {
    setError(reason instanceof Error ? reason.message : "Unable to process input.");
    return null;
  }
}

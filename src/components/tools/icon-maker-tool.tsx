"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  blobToDataUrl,
  canvasToBlob,
  formatBytes,
  loadImageFromDataUrl,
  readFileAsDataUrl,
  type OutputImageFormat
} from "@/lib/image-tools/core";
import { runIconMaker } from "@/tools/logic/icon-maker";

const labels = {
  en: {
    file: "Source image",
    size: "Icon size",
    padding: "Padding (%)",
    background: "Background",
    format: "Format",
    preview: "Preview",
    download: "Download icon"
  },
  pl: {
    file: "Obraz zrodlowy",
    size: "Rozmiar ikony",
    padding: "Margines (%)",
    background: "Tlo",
    format: "Format",
    preview: "Podglad",
    download: "Pobierz ikone"
  },
  de: {
    file: "Quellbild",
    size: "Icon-Groesse",
    padding: "Innenabstand (%)",
    background: "Hintergrund",
    format: "Format",
    preview: "Vorschau",
    download: "Icon herunterladen"
  }
} as const;

type IconResult = {
  dataUrl: string;
  bytes: number;
  fileName: string;
};

async function renderIcon({
  sourceDataUrl,
  size,
  padding,
  background,
  format
}: {
  sourceDataUrl: string;
  size: number;
  padding: number;
  background: string;
  format: OutputImageFormat;
}) {
  const loaded = await loadImageFromDataUrl(sourceDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available in this browser.");
  }

  context.fillStyle = background;
  context.fillRect(0, 0, size, size);

  const paddingPx = (size * padding) / 100;
  const targetSize = Math.max(1, size - paddingPx * 2);
  const scale = Math.min(targetSize / loaded.width, targetSize / loaded.height);
  const drawWidth = loaded.width * scale;
  const drawHeight = loaded.height * scale;
  const x = (size - drawWidth) / 2;
  const y = (size - drawHeight) / 2;

  context.drawImage(loaded.image, x, y, drawWidth, drawHeight);

  const blob = await canvasToBlob(canvas, format, 0.92);

  return {
    blob,
    dataUrl: await blobToDataUrl(blob),
    bytes: blob.size
  };
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export default function IconMakerTool() {
  const locale = (useLocale() as keyof typeof labels) || "en";
  const t = labels[locale] ?? labels.en;
  const [file, setFile] = useState<File | null>(null);
  const [sourceDataUrl, setSourceDataUrl] = useState("");
  const [size, setSize] = useState("512");
  const [padding, setPadding] = useState("10");
  const [background, setBackground] = useState("#0f172a");
  const [format, setFormat] = useState<OutputImageFormat>("png");
  const [result, setResult] = useState<IconResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const plan = useMemo(
    () =>
      file && sourceDataUrl
        ? runIconMaker({
            sourceName: file.name,
            sourceDataUrl,
            size: Number(size),
            padding: Number(padding),
            background,
            format
          })
        : null,
    [background, file, format, padding, size, sourceDataUrl]
  );

  useEffect(() => {
    if (!file) {
      setSourceDataUrl("");
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
    if (!plan) {
      return;
    }

    let active = true;
    void renderIcon({
      sourceDataUrl,
      size: plan.size,
      padding: plan.padding,
      background: plan.background,
      format: plan.format
    }).then(
      (value) => {
        if (active) {
          setResult({
            dataUrl: value.dataUrl,
            bytes: value.bytes,
            fileName: plan.downloadName
          });
          setError(null);
        }
      },
      (reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Unable to render icon.");
        }
      }
    );

    return () => {
      active = false;
    };
  }, [plan, sourceDataUrl]);

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-white/70" htmlFor="icon-maker-file">
          {t.file}
        </label>
        <input
          id="icon-maker-file"
          type="file"
          accept="image/*"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/50"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="icon-maker-size">
            {t.size}
          </label>
          <select
            id="icon-maker-size"
            value={size}
            onChange={(event) => setSize(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
          >
            {[128, 192, 256, 512, 1024].map((value) => (
              <option key={value} value={value}>
                {value}px
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="icon-maker-padding">
            {t.padding}
          </label>
          <input
            id="icon-maker-padding"
            type="range"
            min="0"
            max="40"
            step="1"
            value={padding}
            onChange={(event) => setPadding(event.target.value)}
            className="mt-3 w-full"
          />
          <p className="mt-2 text-sm text-white/55">{padding}%</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="icon-maker-background">
            {t.background}
          </label>
          <input
            id="icon-maker-background"
            type="color"
            value={background}
            onChange={(event) => setBackground(event.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/90 p-2"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-white/70" htmlFor="icon-maker-format">
            {t.format}
          </label>
          <select
            id="icon-maker-format"
            value={format}
            onChange={(event) => setFormat(event.target.value as OutputImageFormat)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="rounded-[24px] border border-rose-400/20 bg-rose-400/10 p-5 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">
              {t.preview}
            </p>
            <div className="mt-4 flex items-center justify-center rounded-3xl border border-white/10 bg-slate-950/60 p-6">
              <img
                src={result.dataUrl}
                alt="Generated icon preview"
                className="h-32 w-32 rounded-[28px]"
              />
            </div>
            <p className="mt-4 text-sm text-white/60">{formatBytes(result.bytes)}</p>
          </div>

          <button
            type="button"
            onClick={() => downloadDataUrl(result.dataUrl, result.fileName)}
            className="rounded-full border border-cyan-300/30 px-4 py-2 text-sm text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
          >
            {t.download}
          </button>
        </div>
      ) : null}
    </div>
  );
}

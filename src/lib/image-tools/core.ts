import exifr from "exifr";

export type OutputImageFormat = "png" | "jpeg" | "webp";

export type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImageMetadataSource = {
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  width: number;
  height: number;
  rawMetadata: Record<string, unknown>;
};

export type ImageMetadataSummary = ImageMetadataSource & {
  cameraMake?: string;
  cameraModel?: string;
  lensModel?: string;
  dateTaken?: string;
  iso?: number;
  exposureTime?: string;
  fNumber?: string;
  focalLength?: string;
  flash?: string;
  orientation?: string;
  gps?: {
    latitude: number;
    longitude: number;
    mapUrl: string;
  };
  raw: Record<string, unknown>;
};

export function clampQuality(value: number) {
  return Math.min(0.95, Math.max(0.1, value));
}

export function getOutputMimeType(format: OutputImageFormat) {
  return format === "jpeg"
    ? "image/jpeg"
    : format === "webp"
      ? "image/webp"
      : "image/png";
}

export function getOutputExtension(format: OutputImageFormat) {
  return format === "jpeg" ? "jpg" : format;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function calculateTargetDimensions({
  originalWidth,
  originalHeight,
  targetWidth,
  targetHeight,
  keepAspectRatio
}: {
  originalWidth: number;
  originalHeight: number;
  targetWidth: number;
  targetHeight: number;
  keepAspectRatio: boolean;
}) {
  if (!keepAspectRatio) {
    return {
      width: Math.max(1, Math.round(targetWidth)),
      height: Math.max(1, Math.round(targetHeight))
    };
  }

  const aspectRatio = originalWidth / originalHeight;
  const width = Math.max(1, Math.round(targetWidth));
  const height = Math.max(1, Math.round(targetHeight));

  if (width / height > aspectRatio) {
    return {
      width: Math.max(1, Math.round(height * aspectRatio)),
      height
    };
  }

  return {
    width,
    height: Math.max(1, Math.round(width / aspectRatio))
  };
}

export function normalizeCropRect({
  imageWidth,
  imageHeight,
  x,
  y,
  width,
  height
}: {
  imageWidth: number;
  imageHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  const safeX = Math.min(Math.max(0, Math.round(x)), Math.max(0, imageWidth - 1));
  const safeY = Math.min(Math.max(0, Math.round(y)), Math.max(0, imageHeight - 1));
  const safeWidth = Math.min(Math.max(1, Math.round(width)), imageWidth - safeX);
  const safeHeight = Math.min(Math.max(1, Math.round(height)), imageHeight - safeY);

  return {
    x: safeX,
    y: safeY,
    width: safeWidth,
    height: safeHeight
  } satisfies CropRect;
}

export function stripDataUrlPrefix(value: string) {
  return value.replace(/^data:[^;]+;base64,/, "").trim();
}

export function normalizeBase64ToDataUrl(value: string, format: OutputImageFormat = "png") {
  const trimmed = value.trim();

  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  return `data:${getOutputMimeType(format)};base64,${trimmed}`;
}

export function parseDataUrl(value: string) {
  const match = value.match(/^data:(.+?);base64,(.+)$/);

  if (!match) {
    throw new Error("Enter a valid Base64 image string or data URL.");
  }

  return {
    mimeType: match[1],
    base64: match[2]
  };
}

export function buildDownloadName(name: string, suffix: string, format: OutputImageFormat) {
  const safeBase = name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]+/gi, "-").toLowerCase() || "image";
  return `${safeBase}-${suffix}.${getOutputExtension(format)}`;
}

export async function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read the selected file."));
    reader.readAsDataURL(file);
  });
}

export async function readFileAsArrayBuffer(file: File) {
  return file.arrayBuffer();
}

export async function loadImageFromDataUrl(dataUrl: string) {
  return new Promise<{ image: HTMLImageElement; width: number; height: number }>(
    (resolve, reject) => {
      const image = new Image();
      image.onload = () =>
        resolve({
          image,
          width: image.naturalWidth,
          height: image.naturalHeight
        });
      image.onerror = () => reject(new Error("Unable to load image data."));
      image.src = dataUrl;
    }
  );
}

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: OutputImageFormat,
  quality?: number
) {
  const mimeType = getOutputMimeType(format);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to export the image."));
          return;
        }

        resolve(blob);
      },
      mimeType,
      format === "png" ? undefined : clampQuality(quality ?? 0.85)
    );
  });
}

export async function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to convert the image output."));
    reader.readAsDataURL(blob);
  });
}

export async function renderImageTransform({
  sourceDataUrl,
  width,
  height,
  format,
  quality,
  crop
}: {
  sourceDataUrl: string;
  width: number;
  height: number;
  format: OutputImageFormat;
  quality?: number;
  crop?: CropRect;
}) {
  const loaded = await loadImageFromDataUrl(sourceDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available in this browser.");
  }

  const sourceCrop = crop
    ? normalizeCropRect({
        imageWidth: loaded.width,
        imageHeight: loaded.height,
        x: crop.x,
        y: crop.y,
        width: crop.width,
        height: crop.height
      })
    : {
        x: 0,
        y: 0,
        width: loaded.width,
        height: loaded.height
      };

  context.drawImage(
    loaded.image,
    sourceCrop.x,
    sourceCrop.y,
    sourceCrop.width,
    sourceCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob = await canvasToBlob(canvas, format, quality);

  return {
    blob,
    dataUrl: await blobToDataUrl(blob),
    bytes: blob.size,
    width: canvas.width,
    height: canvas.height
  };
}

export async function generateFaviconVariants({
  sourceDataUrl,
  sizes,
  format
}: {
  sourceDataUrl: string;
  sizes: number[];
  format: OutputImageFormat;
}) {
  return Promise.all(
    sizes.map(async (size) => {
      const transformed = await renderImageTransform({
        sourceDataUrl,
        width: size,
        height: size,
        format,
        quality: 0.92
      });

      return {
        size,
        ...transformed
      };
    })
  );
}

export async function createPlaceholderImage({
  width,
  height,
  background,
  color,
  text,
  format
}: {
  width: number;
  height: number;
  background: string;
  color: string;
  text: string;
  format: OutputImageFormat;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available in this browser.");
  }

  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.font = `${Math.max(18, Math.round(Math.min(canvas.width, canvas.height) / 5))}px sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width - 32);

  const blob = await canvasToBlob(canvas, format, 0.92);

  return {
    blob,
    dataUrl: await blobToDataUrl(blob),
    bytes: blob.size,
    width: canvas.width,
    height: canvas.height
  };
}

export async function rasterizeSvgMarkup({
  svg,
  size,
  format
}: {
  svg: string;
  size: number;
  format: OutputImageFormat;
}) {
  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return renderImageTransform({
    sourceDataUrl: svgDataUrl,
    width: size,
    height: size,
    format,
    quality: 0.92
  });
}

export async function extractImageMetadata(file: File): Promise<ImageMetadataSource> {
  const [rawMetadata, sourceDataUrl] = await Promise.all([
    exifr.parse(file, {
      tiff: true,
      ifd0: {},
      ifd1: true,
      exif: true,
      gps: true,
      interop: true,
      xmp: true,
      iptc: true,
      makerNote: false,
      userComment: true,
      sanitize: true,
      mergeOutput: true
    }),
    readFileAsDataUrl(file)
  ]);
  const loaded = await loadImageFromDataUrl(sourceDataUrl);

  return {
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    fileSizeBytes: file.size,
    width: loaded.width,
    height: loaded.height,
    rawMetadata: toPlainRecord(rawMetadata)
  };
}

export function normalizeImageMetadata(source: ImageMetadataSource): ImageMetadataSummary {
  const raw = source.rawMetadata;
  const latitude = pickNumber(raw, ["latitude", "Latitude", "lat"]);
  const longitude = pickNumber(raw, ["longitude", "Longitude", "lng", "lon"]);

  return {
    ...source,
    cameraMake: pickString(raw, ["Make", "make"]),
    cameraModel: pickString(raw, ["Model", "model"]),
    lensModel: pickString(raw, ["LensModel", "lensModel"]),
    dateTaken: normalizeExifDate(raw.DateTimeOriginal ?? raw.CreateDate ?? raw.ModifyDate),
    iso: pickInteger(raw, ["ISO", "iso"]),
    exposureTime: formatExposureTime(raw.ExposureTime),
    fNumber: formatFNumber(raw.FNumber),
    focalLength: formatFocalLength(raw.FocalLength),
    flash: formatFlash(raw.Flash),
    orientation: formatOrientation(raw.Orientation),
    gps:
      latitude !== undefined && longitude !== undefined
        ? {
            latitude,
            longitude,
            mapUrl: buildMapUrl(latitude, longitude)
          }
        : undefined,
    raw
  };
}

export function buildMapUrl(latitude: number, longitude: number) {
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;
}

export function formatExposureTime(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }

  if (value >= 1) {
    return `${trimTrailingZeros(value.toFixed(1))} s`;
  }

  return `1/${Math.round(1 / value)} s`;
}

export function formatFNumber(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }

  return `f/${trimTrailingZeros(value.toFixed(1))}`;
}

export function formatFocalLength(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }

  return `${trimTrailingZeros(value.toFixed(1))} mm`;
}

export function formatFlash(value: unknown) {
  if (typeof value === "boolean") {
    return value ? "Used" : "Not used";
  }

  if (typeof value === "number") {
    return value === 0 ? "Not used" : "Used";
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return undefined;
}

export function formatOrientation(value: unknown) {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  const orientations: Record<number, string> = {
    1: "Top-left",
    2: "Top-right",
    3: "Bottom-right",
    4: "Bottom-left",
    5: "Left-top",
    6: "Right-top",
    7: "Right-bottom",
    8: "Left-bottom"
  };

  return orientations[value] ?? String(value);
}

export function normalizeExifDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  const normalized = value.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

function pickString(raw: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = raw[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function pickNumber(raw: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = raw[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return undefined;
}

function pickInteger(raw: Record<string, unknown>, keys: string[]) {
  const value = pickNumber(raw, keys);
  return value === undefined ? undefined : Math.round(value);
}

function toPlainRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object") {
    return {};
  }

  return JSON.parse(
    JSON.stringify(value, (_, nested) => {
      if (nested instanceof Date) {
        return nested.toISOString();
      }

      if (nested instanceof Uint8Array) {
        return Array.from(nested);
      }

      return nested;
    })
  ) as Record<string, unknown>;
}

function trimTrailingZeros(value: string) {
  return value.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

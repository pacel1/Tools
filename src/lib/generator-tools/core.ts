import QRCode from "qrcode";

export type QrCodeGeneratorInput = {
  text: string;
  size: number;
  margin: number;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  foreground: string;
  background: string;
};

export type GradientGeneratorInput = {
  gradientType: "linear" | "radial";
  angle: number;
  colorOne: string;
  colorTwo: string;
};

export type BoxShadowGeneratorInput = {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
};

export type MetaTagGeneratorInput = {
  title: string;
  description: string;
  canonicalUrl?: string;
  siteName?: string;
  ogImage?: string;
};

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function hexToRgba(hex: string, opacity: number) {
  const clean = hex.replace("#", "").trim();
  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${clampNumber(opacity, 0, 1)})`;
}

export async function generateQrCodeSvg(input: QrCodeGeneratorInput) {
  const text = input.text.trim();

  if (!text) {
    throw new Error("Enter text or a URL to generate a QR code.");
  }

  return QRCode.toString(text, {
    type: "svg",
    width: clampNumber(input.size, 128, 1024),
    margin: clampNumber(input.margin, 0, 8),
    errorCorrectionLevel: input.errorCorrectionLevel,
    color: {
      dark: input.foreground,
      light: input.background
    }
  });
}

export function buildGradientCss(input: GradientGeneratorInput) {
  const angle = clampNumber(input.angle, 0, 360);

  return input.gradientType === "radial"
    ? `background: radial-gradient(circle, ${input.colorOne} 0%, ${input.colorTwo} 100%);`
    : `background: linear-gradient(${angle}deg, ${input.colorOne} 0%, ${input.colorTwo} 100%);`;
}

export function buildBoxShadowCss(input: BoxShadowGeneratorInput) {
  const prefix = input.inset ? "inset " : "";
  const shadow = `${prefix}${input.offsetX}px ${input.offsetY}px ${input.blur}px ${input.spread}px ${hexToRgba(
    input.color,
    input.opacity
  )}`;

  return `box-shadow: ${shadow};`;
}

export function buildMetaTagSnippet(input: MetaTagGeneratorInput) {
  const title = input.title.trim();
  const description = input.description.trim();
  const canonicalUrl = input.canonicalUrl?.trim();
  const siteName = input.siteName?.trim();
  const ogImage = input.ogImage?.trim();

  const lines = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  ];

  if (canonicalUrl) {
    lines.push(`<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`);
    lines.push(`<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`);
  }

  if (siteName) {
    lines.push(`<meta property="og:site_name" content="${escapeHtml(siteName)}" />`);
  }

  if (ogImage) {
    lines.push(`<meta property="og:image" content="${escapeHtml(ogImage)}" />`);
    lines.push(`<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`);
  }

  lines.push(`<meta name="twitter:card" content="summary_large_image" />`);

  return lines.join("\n");
}

export function buildPlaceholderFilename(width: number, height: number, format: string) {
  return `placeholder-${width}x${height}.${format}`;
}

export function getFaviconSizes() {
  return [16, 32, 48, 64, 180];
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

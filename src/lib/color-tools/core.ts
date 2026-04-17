export type RgbColor = {
  red: number;
  green: number;
  blue: number;
};

export type HslColor = {
  hue: number;
  saturation: number;
  lightness: number;
};

export type ColorSnapshot = {
  hex: string;
  rgb: string;
  hsl: string;
  red: number;
  green: number;
  blue: number;
  hue: number;
  saturation: number;
  lightness: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeHex(value: string) {
  const clean = value.trim().replace(/^#/, "");
  const expanded =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : clean;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    throw new Error("Enter a valid HEX color.");
  }

  return `#${expanded.toUpperCase()}`;
}

export function hexToRgb(hex: string): RgbColor {
  const normalized = normalizeHex(hex).slice(1);

  return {
    red: Number.parseInt(normalized.slice(0, 2), 16),
    green: Number.parseInt(normalized.slice(2, 4), 16),
    blue: Number.parseInt(normalized.slice(4, 6), 16)
  };
}

export function rgbToHex({ red, green, blue }: RgbColor) {
  return `#${[red, green, blue]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

export function rgbToHsl({ red, green, blue }: RgbColor): HslColor {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;
  let hue = 0;

  if (delta !== 0) {
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
  }

  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return {
    hue: Math.round(((hue * 60 + 360) % 360) * 10) / 10,
    saturation: Math.round(saturation * 1000) / 10,
    lightness: Math.round(lightness * 1000) / 10
  };
}

export function hslToRgb({ hue, saturation, lightness }: HslColor): RgbColor {
  const h = ((hue % 360) + 360) % 360;
  const s = clamp(saturation, 0, 100) / 100;
  const l = clamp(lightness, 0, 100) / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const match = l - chroma / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = chroma;
    g = x;
  } else if (h < 120) {
    r = x;
    g = chroma;
  } else if (h < 180) {
    g = chroma;
    b = x;
  } else if (h < 240) {
    g = x;
    b = chroma;
  } else if (h < 300) {
    r = x;
    b = chroma;
  } else {
    r = chroma;
    b = x;
  }

  return {
    red: Math.round((r + match) * 255),
    green: Math.round((g + match) * 255),
    blue: Math.round((b + match) * 255)
  };
}

export function rgbString({ red, green, blue }: RgbColor) {
  return `rgb(${red}, ${green}, ${blue})`;
}

export function hslString({ hue, saturation, lightness }: HslColor) {
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function channelToLinear(channel: number) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(color: RgbColor) {
  return (
    0.2126 * channelToLinear(color.red) +
    0.7152 * channelToLinear(color.green) +
    0.0722 * channelToLinear(color.blue)
  );
}

export function getContrastRatio(foregroundHex: string, backgroundHex: string) {
  const foreground = hexToRgb(foregroundHex);
  const background = hexToRgb(backgroundHex);
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return Math.round((((lighter + 0.05) / (darker + 0.05)) * 100)) / 100;
}

export function createColorSnapshot(hex: string): ColorSnapshot {
  const normalizedHex = normalizeHex(hex);
  const rgb = hexToRgb(normalizedHex);
  const hsl = rgbToHsl(rgb);

  return {
    hex: normalizedHex,
    rgb: rgbString(rgb),
    hsl: hslString(hsl),
    red: rgb.red,
    green: rgb.green,
    blue: rgb.blue,
    hue: hsl.hue,
    saturation: hsl.saturation,
    lightness: hsl.lightness
  };
}

export function generatePalette(hex: string, count: number) {
  const snapshot = createColorSnapshot(hex);
  const safeCount = clamp(Math.round(count), 3, 8);
  const middle = (safeCount - 1) / 2;

  return Array.from({ length: safeCount }, (_, index) => {
    const distance = index - middle;
    const hueShift = distance * 4;
    const lightnessShift = distance * 10;
    const nextRgb = hslToRgb({
      hue: snapshot.hue + hueShift,
      saturation: clamp(snapshot.saturation + Math.abs(distance) * 1.5, 12, 96),
      lightness: clamp(snapshot.lightness + lightnessShift, 8, 92)
    });

    return rgbToHex(nextRgb);
  });
}

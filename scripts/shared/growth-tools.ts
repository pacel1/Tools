import { locales } from "@/lib/constants";
import {
  normalizeDefinition,
  toCamelCase,
  toPascalCase,
  type AddToolDefinition,
  type ToolCodeArtifacts
} from "./definitions";

type Seed = {
  id: string;
  title: string;
  shortDescription: string;
  type: AddToolDefinition["type"];
  category: AddToolDefinition["category"];
  seoPriority: number;
  relatedTools: string[];
  inputFields: Array<{
    name: string;
    label: string;
    type: "number" | "text" | "textarea" | "json";
    placeholder?: string;
    required?: boolean;
  }>;
  outputFields: Array<{
    name: string;
    label: string;
    type: "number" | "text" | "json";
  }>;
  promptContext: string;
};

const generatorSeeds: Seed[] = [
  seed("qr-code-generator", "QR Code Generator", "Create QR codes online from text, links, Wi-Fi credentials and short contact payloads.", "generator", "generators", 0.97, ["meta-tag-generator", "gradient-generator", "box-shadow-generator"], [{ name: "text", label: "Text", type: "textarea", required: true }], [{ name: "svg", label: "QR code SVG", type: "text" }], "Client-side QR code generator with SVG and PNG download, instant preview and localized UI labels."),
  seed("gradient-generator", "CSS Gradient Generator", "Generate clean CSS gradients with live preview, angle controls and ready-to-copy code.", "generator", "generators", 0.95, ["box-shadow-generator", "meta-tag-generator", "placeholder-image-generator"], [{ name: "colorOne", label: "Color one", type: "text", required: true }], [{ name: "css", label: "CSS code", type: "text" }], "Client-side CSS gradient generator for long-tail searches like css gradient generator and linear gradient generator."),
  seed("box-shadow-generator", "Box Shadow Generator", "Build CSS box shadows with offsets, blur, spread, opacity and copy-ready output.", "generator", "generators", 0.94, ["gradient-generator", "meta-tag-generator", "placeholder-image-generator"], [{ name: "offsetX", label: "Offset X", type: "number", required: true }], [{ name: "css", label: "CSS code", type: "text" }], "Client-side CSS box shadow generator with live preview and instant CSS output."),
  seed("favicon-generator", "Favicon Generator", "Generate favicon sizes from one image file directly in your browser with instant downloads.", "generator", "generators", 0.92, ["meta-tag-generator", "qr-code-generator", "placeholder-image-generator"], [{ name: "sourceDataUrl", label: "Image file", type: "text", required: true }], [{ name: "total", label: "Generated favicon sizes", type: "number" }], "Client-side favicon generator with multiple icon sizes and downloads."),
  seed("placeholder-image-generator", "Placeholder Image Generator", "Create placeholder images for UI mocks, blog covers, OG image drafts and design systems.", "generator", "generators", 0.9, ["gradient-generator", "favicon-generator", "box-shadow-generator"], [{ name: "width", label: "Width", type: "number", required: true }], [{ name: "filename", label: "Filename", type: "text" }], "Client-side placeholder image generator using canvas."),
  seed("meta-tag-generator", "Meta Tag Generator", "Generate HTML meta tags for title, description, canonical and Open Graph fields.", "generator", "generators", 0.93, ["qr-code-generator", "favicon-generator", "gradient-generator"], [{ name: "title", label: "Title", type: "text", required: true }], [{ name: "snippet", label: "Meta tag snippet", type: "text" }], "SEO-focused client-side meta tag generator for organic search intents.")
];

const imageSeeds: Seed[] = [
  seed("image-resizer", "Image Resizer", "Resize images online in your browser with custom dimensions and aspect ratio controls.", "image-tool", "image-tools", 0.98, ["image-compressor", "image-cropper", "image-format-converter"], [{ name: "sourceDataUrl", label: "Image file", type: "text", required: true }], [{ name: "width", label: "Width", type: "number" }], "Client-side image resizer with upload, preview and download."),
  seed("image-compressor", "Image Compressor", "Compress images online to reduce file size without sending files to a server.", "image-tool", "image-tools", 0.99, ["image-resizer", "image-format-converter", "image-cropper"], [{ name: "sourceDataUrl", label: "Image file", type: "text", required: true }], [{ name: "quality", label: "Quality", type: "number" }], "Client-side image compressor with quality slider and saved-size metrics."),
  seed("image-cropper", "Image Cropper", "Crop images online with custom coordinates and instant browser-side preview.", "image-tool", "image-tools", 0.96, ["image-resizer", "image-compressor", "image-format-converter"], [{ name: "sourceDataUrl", label: "Image file", type: "text", required: true }], [{ name: "width", label: "Crop width", type: "number" }], "Client-side image cropper with coordinate inputs."),
  seed("image-to-base64", "Image to Base64", "Convert image files to Base64 and data URLs instantly in your browser.", "image-tool", "image-tools", 0.88, ["base64-to-image", "image-format-converter", "image-resizer"], [{ name: "dataUrl", label: "Image data URL", type: "text", required: true }], [{ name: "base64", label: "Base64 output", type: "text" }], "Client-side image to base64 converter with copy-ready output."),
  seed("base64-to-image", "Base64 to Image", "Decode Base64 image strings and preview downloadable image output instantly.", "image-tool", "image-tools", 0.87, ["image-to-base64", "image-format-converter", "image-resizer"], [{ name: "value", label: "Base64 input", type: "textarea", required: true }], [{ name: "dataUrl", label: "Image output", type: "text" }], "Client-side base64 to image converter with preview and download."),
  seed("image-format-converter", "Image Format Converter", "Convert PNG, JPG and WebP images online with instant client-side output.", "image-tool", "image-tools", 0.95, ["image-resizer", "image-compressor", "image-cropper"], [{ name: "sourceDataUrl", label: "Image file", type: "text", required: true }], [{ name: "downloadName", label: "Output file name", type: "text" }], "Client-side image format converter for png to jpg, png to webp and related searches."),
  seed("image-metadata-reader", "Image Metadata Reader", "Read EXIF photo metadata online, including camera details, resolution, timestamps and GPS when available.", "image-tool", "image-tools", 0.91, ["image-resizer", "image-compressor", "image-format-converter", "image-cropper"], [{ name: "fileName", label: "File name", type: "text", required: true }], [{ name: "cameraModel", label: "Camera model", type: "text" }], "Client-side EXIF and photo metadata reader for camera info, GPS, resolution and image details.")
];

export const growthToolDefinitions: AddToolDefinition[] = [...generatorSeeds, ...imageSeeds].map(
  (seedItem) =>
    normalizeDefinition({
      ...seedItem,
      supportedLocales: [...locales]
    })
);

export function createGrowthToolCode(
  definitionInput: AddToolDefinition | unknown
): ToolCodeArtifacts | null {
  const definition = normalizeDefinition(definitionInput);
  const seedItem = [...generatorSeeds, ...imageSeeds].find((item) => item.id === definition.id);

  if (!seedItem) {
    return null;
  }

  return {
    schemaSource: createSchemaSource(definition),
    logicSource: createLogicSource(definition),
    componentSource: createComponentSource(definition),
    testSource: createTestSource(definition)
  };
}

function seed(
  id: string,
  title: string,
  shortDescription: string,
  type: AddToolDefinition["type"],
  category: AddToolDefinition["category"],
  seoPriority: number,
  relatedTools: string[],
  inputFields: Seed["inputFields"],
  outputFields: Seed["outputFields"],
  promptContext: string
): Seed {
  return {
    id,
    title,
    shortDescription,
    type,
    category,
    seoPriority,
    relatedTools,
    inputFields: inputFields.map((field) => ({
      ...field,
      placeholder: "",
      required: field.required ?? true
    })),
    outputFields,
    promptContext: `${promptContext} Generate localized slugs, titles, intro, useCases, FAQ and practical uiLabels for en, pl, es, de and fr.`
  };
}

function createComponentSource(definition: AddToolDefinition) {
  const clientName =
    definition.category === "generators" ? "GeneratorToolClient" : "ImageToolClient";

  return `"use client";

import { ${clientName} } from "@/components/tools/${definition.category === "generators" ? "generator-tool-client" : "image-tool-client"}";

export default function ${definition.componentName}() {
  return <${clientName} toolId="${definition.id}" />;
}
`;
}

function createSchemaSource(definition: AddToolDefinition) {
  const camel = toCamelCase(definition.id);
  const pascal = toPascalCase(definition.id);

  const map: Record<string, string> = {
    "qr-code-generator": `import { z } from "zod";

export const ${camel}InputSchema = z.object({
  text: z.string().min(1, "Enter text or a URL."),
  size: z.coerce.number().int().min(128).max(1024).default(320),
  margin: z.coerce.number().int().min(0).max(8).default(1),
  errorCorrectionLevel: z.enum(["L", "M", "Q", "H"]).default("M"),
  foreground: z.string().min(4).default("#111827"),
  background: z.string().min(4).default("#ffffff")
});

export const ${camel}OutputSchema = z.object({
  svg: z.string(),
  downloadName: z.string()
});
`,
    "gradient-generator": generatorSchema(camel, ["gradientType: z.enum([\"linear\", \"radial\"]).default(\"linear\")", "angle: z.coerce.number().int().min(0).max(360).default(135)", "colorOne: z.string().min(4).default(\"#0f172a\")", "colorTwo: z.string().min(4).default(\"#22d3ee\")"], ["css: z.string()"]),
    "box-shadow-generator": generatorSchema(camel, ["offsetX: z.coerce.number().int().min(-200).max(200).default(0)", "offsetY: z.coerce.number().int().min(-200).max(200).default(18)", "blur: z.coerce.number().int().min(0).max(200).default(36)", "spread: z.coerce.number().int().min(-200).max(200).default(0)", "color: z.string().min(4).default(\"#0f172a\")", "opacity: z.coerce.number().min(0).max(1).default(0.25)", "inset: z.boolean().default(false)"], ["css: z.string()"]),
    "favicon-generator": generatorSchema(camel, ["sourceName: z.string().min(1)", "sourceDataUrl: z.string().min(1)", "format: z.enum([\"png\", \"jpeg\", \"webp\"]).default(\"png\")"], ["sizes: z.array(z.number().int().positive())", "total: z.number().int().nonnegative()"]),
    "placeholder-image-generator": generatorSchema(camel, ["width: z.coerce.number().int().min(1).max(4000).default(1200)", "height: z.coerce.number().int().min(1).max(4000).default(630)", "background: z.string().min(4).default(\"#0f172a\")", "foreground: z.string().min(4).default(\"#f8fafc\")", "text: z.string().min(1).default(\"1200x630\")", "format: z.enum([\"png\", \"jpeg\", \"webp\"]).default(\"png\")"], ["filename: z.string()", "width: z.number().int().positive()", "height: z.number().int().positive()"]),
    "meta-tag-generator": generatorSchema(camel, ["title: z.string().min(1)", "description: z.string().min(1)", "canonicalUrl: z.string().optional()", "siteName: z.string().optional()", "ogImage: z.string().optional()"], ["snippet: z.string()"]),
    "image-resizer": generatorSchema(camel, ["sourceName: z.string().min(1)", "sourceDataUrl: z.string().min(1)", "originalWidth: z.coerce.number().int().min(1)", "originalHeight: z.coerce.number().int().min(1)", "targetWidth: z.coerce.number().int().min(1)", "targetHeight: z.coerce.number().int().min(1)", "keepAspectRatio: z.boolean().default(true)", "format: z.enum([\"png\", \"jpeg\", \"webp\"]).default(\"png\")"], ["width: z.number().int().positive()", "height: z.number().int().positive()", "originalWidth: z.number().int().positive()", "originalHeight: z.number().int().positive()", "downloadName: z.string()"]),
    "image-compressor": generatorSchema(camel, ["sourceName: z.string().min(1)", "sourceDataUrl: z.string().min(1)", "width: z.coerce.number().int().min(1)", "height: z.coerce.number().int().min(1)", "format: z.enum([\"png\", \"jpeg\", \"webp\"]).default(\"jpeg\")", "quality: z.coerce.number().min(0.1).max(0.95).default(0.75)", "originalBytes: z.coerce.number().int().min(0)"], ["width: z.number().int().positive()", "height: z.number().int().positive()", "quality: z.number()", "downloadName: z.string()", "originalBytes: z.number().int().min(0)"]),
    "image-cropper": generatorSchema(camel, ["sourceName: z.string().min(1)", "sourceDataUrl: z.string().min(1)", "imageWidth: z.coerce.number().int().min(1)", "imageHeight: z.coerce.number().int().min(1)", "x: z.coerce.number().int().min(0)", "y: z.coerce.number().int().min(0)", "width: z.coerce.number().int().min(1)", "height: z.coerce.number().int().min(1)", "format: z.enum([\"png\", \"jpeg\", \"webp\"]).default(\"png\")"], ["crop: z.object({ x: z.number().int(), y: z.number().int(), width: z.number().int(), height: z.number().int() })", "width: z.number().int().positive()", "height: z.number().int().positive()", "downloadName: z.string()"]),
    "image-to-base64": generatorSchema(camel, ["sourceName: z.string().min(1)", "dataUrl: z.string().min(1)"], ["base64: z.string()", "mimeType: z.string()", "dataUrl: z.string()"]),
    "base64-to-image": generatorSchema(camel, ["value: z.string().min(1)", "format: z.enum([\"png\", \"jpeg\", \"webp\"]).default(\"png\")"], ["dataUrl: z.string()", "mimeType: z.string()"]),
    "image-format-converter": generatorSchema(camel, ["sourceName: z.string().min(1)", "sourceDataUrl: z.string().min(1)", "width: z.coerce.number().int().min(1)", "height: z.coerce.number().int().min(1)", "targetFormat: z.enum([\"png\", \"jpeg\", \"webp\"]).default(\"webp\")", "quality: z.coerce.number().min(0.1).max(0.95).default(0.82)"], ["width: z.number().int().positive()", "height: z.number().int().positive()", "targetFormat: z.enum([\"png\", \"jpeg\", \"webp\"])", "quality: z.number()", "downloadName: z.string()"]),
    "image-metadata-reader": generatorSchema(camel, ["fileName: z.string().min(1)", "mimeType: z.string().min(1)", "fileSizeBytes: z.coerce.number().int().min(0)", "width: z.coerce.number().int().min(1)", "height: z.coerce.number().int().min(1)", "rawMetadata: z.record(z.string(), z.unknown()).default({})"], ["fileName: z.string()", "mimeType: z.string()", "fileSizeBytes: z.number().int().min(0)", "width: z.number().int().positive()", "height: z.number().int().positive()", "cameraMake: z.string().optional()", "cameraModel: z.string().optional()", "lensModel: z.string().optional()", "dateTaken: z.string().optional()", "iso: z.number().int().optional()", "exposureTime: z.string().optional()", "fNumber: z.string().optional()", "focalLength: z.string().optional()", "flash: z.string().optional()", "orientation: z.string().optional()", "gps: z.object({ latitude: z.number(), longitude: z.number(), mapUrl: z.string().url() }).optional()", "raw: z.record(z.string(), z.unknown())"])
  };

  return `${map[definition.id]}
export const toolInputSchema = ${camel}InputSchema;
export const toolOutputSchema = ${camel}OutputSchema;

export type ${pascal}Input = z.infer<typeof ${camel}InputSchema>;
export type ${pascal}Output = z.infer<typeof ${camel}OutputSchema>;
`;
}

function createLogicSource(definition: AddToolDefinition) {
  const camel = toCamelCase(definition.id);
  const pascal = toPascalCase(definition.id);

  const map: Record<string, string> = {
    "qr-code-generator": `import { generateQrCodeSvg } from "@/lib/generator-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input } from "@/tools/schema/${definition.id}";

export async function run${pascal}(input: ${pascal}Input) {
  const parsed = ${camel}InputSchema.parse(input);
  const svg = await generateQrCodeSvg(parsed);
  return ${camel}OutputSchema.parse({ svg, downloadName: "qr-code.svg" });
}
`,
    "gradient-generator": `import { buildGradientCss } from "@/lib/generator-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input) {
  const parsed = ${camel}InputSchema.parse(input);
  return ${camel}OutputSchema.parse({ css: buildGradientCss(parsed) });
}
`,
    "box-shadow-generator": `import { buildBoxShadowCss } from "@/lib/generator-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input) {
  const parsed = ${camel}InputSchema.parse(input);
  return ${camel}OutputSchema.parse({ css: buildBoxShadowCss(parsed) });
}
`,
    "favicon-generator": `import { getFaviconSizes } from "@/lib/generator-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input) {
  ${camel}InputSchema.parse(input);
  const sizes = getFaviconSizes();
  return ${camel}OutputSchema.parse({ sizes, total: sizes.length });
}
`,
    "placeholder-image-generator": `import { buildPlaceholderFilename } from "@/lib/generator-tools/core";
import { getOutputExtension } from "@/lib/image-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input) {
  const parsed = ${camel}InputSchema.parse(input);
  return ${camel}OutputSchema.parse({
    filename: buildPlaceholderFilename(parsed.width, parsed.height, getOutputExtension(parsed.format)),
    width: parsed.width,
    height: parsed.height
  });
}
`,
    "meta-tag-generator": `import { buildMetaTagSnippet } from "@/lib/generator-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input) {
  const parsed = ${camel}InputSchema.parse(input);
  return ${camel}OutputSchema.parse({ snippet: buildMetaTagSnippet(parsed) });
}
`,
    "image-resizer": `import { calculateTargetDimensions, buildDownloadName } from "@/lib/image-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input) {
  const parsed = ${camel}InputSchema.parse(input);
  const size = calculateTargetDimensions(parsed);
  return ${camel}OutputSchema.parse({
    ...size,
    originalWidth: parsed.originalWidth,
    originalHeight: parsed.originalHeight,
    downloadName: buildDownloadName(parsed.sourceName, "resized", parsed.format)
  });
}
`,
    "image-compressor": `import { buildDownloadName, clampQuality } from "@/lib/image-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input) {
  const parsed = ${camel}InputSchema.parse(input);
  return ${camel}OutputSchema.parse({
    width: parsed.width,
    height: parsed.height,
    quality: clampQuality(parsed.quality),
    originalBytes: parsed.originalBytes,
    downloadName: buildDownloadName(parsed.sourceName, "compressed", parsed.format)
  });
}
`,
    "image-cropper": `import { buildDownloadName, normalizeCropRect } from "@/lib/image-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input) {
  const parsed = ${camel}InputSchema.parse(input);
  const crop = normalizeCropRect(parsed);
  return ${camel}OutputSchema.parse({
    crop,
    width: crop.width,
    height: crop.height,
    downloadName: buildDownloadName(parsed.sourceName, "cropped", parsed.format)
  });
}
`,
    "image-to-base64": `import { parseDataUrl } from "@/lib/image-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input) {
  const parsed = ${camel}InputSchema.parse(input);
  const data = parseDataUrl(parsed.dataUrl);
  return ${camel}OutputSchema.parse({
    base64: data.base64,
    mimeType: data.mimeType,
    dataUrl: parsed.dataUrl
  });
}
`,
    "base64-to-image": `import { getOutputMimeType, normalizeBase64ToDataUrl, parseDataUrl } from "@/lib/image-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input) {
  const parsed = ${camel}InputSchema.parse(input);
  const dataUrl = normalizeBase64ToDataUrl(parsed.value, parsed.format);
  const data = parseDataUrl(dataUrl);
  return ${camel}OutputSchema.parse({
    dataUrl,
    mimeType: data.mimeType || getOutputMimeType(parsed.format)
  });
}
`,
    "image-format-converter": `import { buildDownloadName, clampQuality } from "@/lib/image-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input) {
  const parsed = ${camel}InputSchema.parse(input);
  return ${camel}OutputSchema.parse({
    width: parsed.width,
    height: parsed.height,
    targetFormat: parsed.targetFormat,
    quality: clampQuality(parsed.quality),
    downloadName: buildDownloadName(parsed.sourceName, "converted", parsed.targetFormat)
  });
}
`,
    "image-metadata-reader": `import { normalizeImageMetadata } from "@/lib/image-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input) {
  const parsed = ${camel}InputSchema.parse(input);
  return ${camel}OutputSchema.parse(normalizeImageMetadata(parsed));
}
`
  };

  return `${map[definition.id]}
export const toolLogic = run${pascal};
`;
}

function createTestSource(definition: AddToolDefinition) {
  const pascal = toPascalCase(definition.id);

  const map: Record<string, string> = {
    "qr-code-generator": `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("returns SVG output", async () => {
    const result = await run${pascal}({ text: "https://example.com", size: 256, margin: 1, errorCorrectionLevel: "M", foreground: "#111827", background: "#ffffff" });
    expect(result.svg).toContain("<svg");
  });
});
`,
    "gradient-generator": simpleExpect(definition.id, pascal, `{ gradientType: "linear", angle: 90, colorOne: "#000000", colorTwo: "#ffffff" }`, "result.css", "linear-gradient"),
    "box-shadow-generator": simpleExpect(definition.id, pascal, `{ offsetX: 2, offsetY: 8, blur: 20, spread: 0, color: "#000000", opacity: 0.4, inset: false }`, "result.css", "box-shadow"),
    "favicon-generator": simpleExpect(definition.id, pascal, `{ sourceName: "logo.png", sourceDataUrl: "data:image/png;base64,AA==", format: "png" }`, "String(result.total)", "5"),
    "placeholder-image-generator": simpleExpect(definition.id, pascal, `{ width: 1200, height: 630, background: "#000000", foreground: "#ffffff", text: "Demo", format: "png" }`, "result.filename", "placeholder-1200x630"),
    "meta-tag-generator": simpleExpect(definition.id, pascal, `{ title: "Demo title", description: "Demo description", canonicalUrl: "https://example.com", siteName: "Example", ogImage: "https://example.com/og.jpg" }`, "result.snippet", "<meta"),
    "image-resizer": simpleExpect(definition.id, pascal, `{ sourceName: "photo.png", sourceDataUrl: "data:image/png;base64,AA==", originalWidth: 2000, originalHeight: 1000, targetWidth: 1000, targetHeight: 1000, keepAspectRatio: true, format: "png" }`, "String(result.height)", "500"),
    "image-compressor": simpleExpect(definition.id, pascal, `{ sourceName: "photo.png", sourceDataUrl: "data:image/png;base64,AA==", width: 1600, height: 900, format: "jpeg", quality: 0.7, originalBytes: 500000 }`, "String(result.quality)", "0.7"),
    "image-cropper": simpleExpect(definition.id, pascal, `{ sourceName: "photo.png", sourceDataUrl: "data:image/png;base64,AA==", imageWidth: 1600, imageHeight: 900, x: 10, y: 20, width: 400, height: 300, format: "png" }`, "String(result.crop.width)", "400"),
    "image-to-base64": simpleExpect(definition.id, pascal, `{ sourceName: "photo.png", dataUrl: "data:image/png;base64,AA==" }`, "result.base64", "AA=="),
    "base64-to-image": simpleExpect(definition.id, pascal, `{ value: "AA==", format: "png" }`, "result.dataUrl", "data:image/png;base64"),
    "image-format-converter": simpleExpect(definition.id, pascal, `{ sourceName: "photo.png", sourceDataUrl: "data:image/png;base64,AA==", width: 1600, height: 900, targetFormat: "webp", quality: 0.8 }`, "result.downloadName", "converted.webp"),
    "image-metadata-reader": `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("normalizes EXIF metadata into a stable shape", () => {
    const result = run${pascal}({
      fileName: "photo.jpg",
      mimeType: "image/jpeg",
      fileSizeBytes: 2450000,
      width: 4032,
      height: 3024,
      rawMetadata: {
        Make: "Canon",
        Model: "EOS R6",
        LensModel: "RF24-70mm F2.8 L IS USM",
        ISO: 400,
        ExposureTime: 0.008,
        FNumber: 2.8,
        FocalLength: 50,
        Flash: 0,
        Orientation: 1,
        latitude: 52.2297,
        longitude: 21.0122
      }
    });

    expect(result.cameraModel).toBe("EOS R6");
    expect(result.gps?.mapUrl).toContain("openstreetmap");
    expect(result.exposureTime).toBe("1/125 s");
  });
});
`
  };

  return map[definition.id];
}

function generatorSchema(camel: string, inputs: string[], outputs: string[]) {
  return `import { z } from "zod";

export const ${camel}InputSchema = z.object({
  ${inputs.join(",\n  ")}
});

export const ${camel}OutputSchema = z.object({
  ${outputs.join(",\n  ")}
});
`;
}

function simpleExpect(id: string, pascal: string, input: string, expression: string, expected: string) {
  return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${id}";

describe("${id}", () => {
  it("returns the expected output shape", () => {
    const result = run${pascal}(${input});
    expect(${expression}).toContain(${JSON.stringify(expected)});
  });
});
`;
}

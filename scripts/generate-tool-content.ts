import path from "node:path";
import {
  normalizeDefinition,
  type AddToolDefinition,
  type ToolContentArtifacts
} from "./shared/definitions";
import { loadDefinitionFromFile, parseArgs } from "./shared/cli";
import { writeJson } from "./shared/filesystem";
import { canUseOpenAI, generateStructuredObject } from "./shared/openai";
import { createFallbackToolContent } from "./shared/templates";

const localizedContentSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    en: { $ref: "#/$defs/toolContent" },
    pl: { $ref: "#/$defs/toolContent" },
    es: { $ref: "#/$defs/toolContent" },
    de: { $ref: "#/$defs/toolContent" },
    fr: { $ref: "#/$defs/toolContent" }
  },
  required: ["en", "pl", "es", "de", "fr"],
  $defs: {
    toolContent: {
      type: "object",
      additionalProperties: false,
      properties: {
        toolId: { type: "string" },
        locale: { type: "string" },
        slug: { type: "string" },
        h1: { type: "string" },
        title: { type: "string" },
        shortDescription: { type: "string" },
        metaTitle: { type: "string" },
        metaDescription: { type: "string" },
        intro: { type: "string" },
        overview: { type: "string" },
        howItWorks: {
          type: "array",
          items: { type: "string" },
          minItems: 3
        },
        useCases: {
          type: "array",
          items: { type: "string" },
          minItems: 3
        },
        examples: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              input: { type: "string" },
              output: { type: "string" },
              description: { type: "string" }
            },
            required: ["title", "input", "output", "description"]
          },
          minItems: 2
        },
        faq: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              question: { type: "string" },
              answer: { type: "string" }
            },
            required: ["question", "answer"]
          },
          minItems: 2
        },
        uiLabels: {
          type: "object",
          additionalProperties: false,
          properties: {
            copy: { type: "string" },
            copied: { type: "string" },
            input: { type: "string" },
            output: { type: "string" },
            placeholder: { type: "string" },
            indent: { type: "string" },
            removeComments: { type: "string" },
            preview: { type: "string" },
            source: { type: "string" },
            sanitizedHtml: { type: "string" },
            plainText: { type: "string" },
            summary: { type: "string" },
            total: { type: "string" },
            links: { type: "string" },
            images: { type: "string" },
            errors: { type: "string" },
            warnings: { type: "string" },
            valid: { type: "string" },
            invalid: { type: "string" },
            href: { type: "string" },
            text: { type: "string" },
            rel: { type: "string" },
            target: { type: "string" },
            alt: { type: "string" },
            width: { type: "string" },
            height: { type: "string" },
            empty: { type: "string" },
            outputReady: { type: "string" },
            cleanedHtml: { type: "string" },
            formattedHtml: { type: "string" },
            minifiedHtml: { type: "string" },
            markdown: { type: "string" },
            extractedImages: { type: "string" },
            extractedLinks: { type: "string" },
            validationSummary: { type: "string" },
            prettyHtml: { type: "string" },
            encodedText: { type: "string" },
            file: { type: "string" },
            size: { type: "string" },
            format: { type: "string" },
            quality: { type: "string" },
            colorOne: { type: "string" },
            colorTwo: { type: "string" },
            background: { type: "string" },
            foreground: { type: "string" },
            angle: { type: "string" },
            margin: { type: "string" },
            level: { type: "string" },
            gradientType: { type: "string" },
            linear: { type: "string" },
            radial: { type: "string" },
            blur: { type: "string" },
            spread: { type: "string" },
            offsetX: { type: "string" },
            offsetY: { type: "string" },
            opacity: { type: "string" },
            inset: { type: "string" },
            cssCode: { type: "string" },
            snippet: { type: "string" },
            download: { type: "string" },
            downloadSvg: { type: "string" },
            downloadPng: { type: "string" },
            downloadAll: { type: "string" },
            upload: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            canonicalUrl: { type: "string" },
            siteName: { type: "string" },
            ogImage: { type: "string" },
            clear: { type: "string" },
            generatedQr: { type: "string" },
            placeholderImage: { type: "string" },
            faviconSet: { type: "string" },
            keepAspectRatio: { type: "string" },
            cropX: { type: "string" },
            cropY: { type: "string" },
            cropWidth: { type: "string" },
            cropHeight: { type: "string" },
            originalSize: { type: "string" },
            outputSize: { type: "string" },
            savedSize: { type: "string" },
            result: { type: "string" },
            base64: { type: "string" },
            mimeType: { type: "string" },
            resizedImage: { type: "string" },
            compressedImage: { type: "string" },
            croppedImage: { type: "string" },
            convertedImage: { type: "string" },
            decodedImage: { type: "string" },
            imagePreview: { type: "string" },
            camera: { type: "string" },
            lens: { type: "string" },
            dateTaken: { type: "string" },
            resolution: { type: "string" },
            fileSize: { type: "string" },
            iso: { type: "string" },
            exposure: { type: "string" },
            aperture: { type: "string" },
            focalLength: { type: "string" },
            flash: { type: "string" },
            orientation: { type: "string" },
            latitude: { type: "string" },
            longitude: { type: "string" },
            openMap: { type: "string" },
            rawMetadata: { type: "string" },
            noMetadataFound: { type: "string" },
            gpsLocation: { type: "string" },
            metadataSummary: { type: "string" }
          },
          required: [
            "copy",
            "copied",
            "input",
            "output",
            "placeholder",
            "indent",
            "removeComments",
            "preview",
            "source",
            "sanitizedHtml",
            "plainText",
            "summary",
            "total",
            "links",
            "images",
            "errors",
            "warnings",
            "valid",
            "invalid",
            "href",
            "text",
            "rel",
            "target",
            "alt",
            "width",
            "height",
            "empty",
            "outputReady",
            "cleanedHtml",
            "formattedHtml",
            "minifiedHtml",
            "markdown",
            "extractedImages",
            "extractedLinks",
            "validationSummary",
            "prettyHtml",
            "encodedText",
            "file",
            "size",
            "format",
            "quality",
            "colorOne",
            "colorTwo",
            "background",
            "foreground",
            "angle",
            "margin",
            "level",
            "gradientType",
            "linear",
            "radial",
            "blur",
            "spread",
            "offsetX",
            "offsetY",
            "opacity",
            "inset",
            "cssCode",
            "snippet",
            "download",
            "downloadSvg",
            "downloadPng",
            "downloadAll",
            "upload",
            "title",
            "description",
            "canonicalUrl",
            "siteName",
            "ogImage",
            "clear",
            "generatedQr",
            "placeholderImage",
            "faviconSet",
            "keepAspectRatio",
            "cropX",
            "cropY",
            "cropWidth",
            "cropHeight",
            "originalSize",
            "outputSize",
            "savedSize",
            "result",
            "base64",
            "mimeType",
            "resizedImage",
            "compressedImage",
            "croppedImage",
            "convertedImage",
            "decodedImage",
            "imagePreview",
            "camera",
            "lens",
            "dateTaken",
            "resolution",
            "fileSize",
            "iso",
            "exposure",
            "aperture",
            "focalLength",
            "flash",
            "orientation",
            "latitude",
            "longitude",
            "openMap",
            "rawMetadata",
            "noMetadataFound",
            "gpsLocation",
            "metadataSummary"
          ]
        },
        seo: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            keywords: {
              type: "array",
              items: { type: "string" },
              minItems: 3
            }
          },
          required: ["title", "description", "keywords"]
        }
      },
      required: [
        "toolId",
        "locale",
        "slug",
        "h1",
        "title",
        "shortDescription",
        "metaTitle",
        "metaDescription",
        "intro",
        "overview",
        "howItWorks",
        "useCases",
        "examples",
        "faq",
        "uiLabels",
        "seo"
      ]
    }
  }
};

async function createArtifacts(definition: AddToolDefinition): Promise<ToolContentArtifacts> {
  if (!canUseOpenAI()) {
    return createFallbackToolContent(definition);
  }

  return generateStructuredObject<ToolContentArtifacts>({
    name: "tool_content_bundle",
    schema: localizedContentSchema,
    system:
      "You generate localized SEO content JSON for an online tools portal. Return JSON only, no markdown. Keep toolId stable. Localize title, h1 and seo.title naturally for each language. For non-English locales, translate the tool name fully whenever a natural end-user translation exists. Generate locale-specific ASCII-only slugs in kebab-case and do not leave English slugs in pl, es, de or fr unless the term is globally standard. Keep category path segments in English outside of this content. Make all visible copy sound native, practical, concise and SEO-friendly for utility-tool searches. Provide optional metaTitle, metaDescription, intro, useCases and uiLabels whenever useful.",
    prompt: JSON.stringify({ definition }, null, 2)
  });
}

export async function generateToolContent(definitionInput: AddToolDefinition | unknown) {
  const definition = normalizeDefinition(definitionInput);
  const artifacts = await createArtifacts(definition);

  await Promise.all(
    Object.entries(artifacts).map(([locale, content]) =>
      writeJson(
        path.join(
          process.cwd(),
          "src",
          "data",
          "tools",
          "content",
          locale,
          `${definition.id}.json`
        ),
        content
      )
    )
  );

  return artifacts;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const file = args.get("file");

  if (!file) {
    throw new Error("Pass --file path/to/tool-definition.json");
  }

  const definition = await loadDefinitionFromFile(file);
  await generateToolContent(definition);
  console.log(`Generated localized content for ${definition.id}.`);
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

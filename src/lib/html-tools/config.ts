export const htmlToolIds = [
  "html-formatter",
  "html-minifier",
  "html-viewer",
  "html-to-text",
  "html-escape",
  "html-unescape",
  "html-to-markdown",
  "markdown-to-html",
  "html-cleaner",
  "html-tag-remover",
  "html-link-extractor",
  "html-image-extractor",
  "html-validator",
  "html-pretty-print",
  "html-entity-encoder"
] as const;

export type HtmlToolId = (typeof htmlToolIds)[number];

type HtmlToolMode =
  | "formatter"
  | "minifier"
  | "viewer"
  | "to-text"
  | "escape"
  | "unescape"
  | "to-markdown"
  | "to-html"
  | "cleaner"
  | "tag-remover"
  | "link-extractor"
  | "image-extractor"
  | "validator"
  | "pretty-print"
  | "entity-encoder";

type HtmlToolInputKind = "html" | "markdown" | "text";

export type HtmlToolConfig = {
  id: HtmlToolId;
  mode: HtmlToolMode;
  inputKind: HtmlToolInputKind;
  sampleInput: string;
  defaultIndent?: number;
};

const sampleHtml = `<div class="card">
  <h2>Utility Globe</h2>
  <p>Clean up <strong>HTML snippets</strong> fast.</p>
  <a href="https://example.com" target="_blank">Read more</a>
  <img src="/hero.jpg" alt="Portal hero image" width="640" height="360" />
</div>`;

const sampleUnsafeHtml = `<section onclick="alert('xss')">
  <h1>Preview</h1>
  <script>alert("blocked")</script>
  <a href="javascript:alert('bad')" target="_blank">Unsafe link</a>
  <p>Rendered output should stay safe.</p>
</section>`;

const sampleMarkdown = `# Utility Globe

- HTML to Markdown
- Markdown to HTML

[Open docs](https://example.com/docs)`;

const sampleText = `<article class="hero">Use "quoted" text & special characters like © and ✓.</article>`;

export const htmlToolConfigs: Record<HtmlToolId, HtmlToolConfig> = {
  "html-formatter": {
    id: "html-formatter",
    mode: "formatter",
    inputKind: "html",
    sampleInput: sampleHtml,
    defaultIndent: 2
  },
  "html-minifier": {
    id: "html-minifier",
    mode: "minifier",
    inputKind: "html",
    sampleInput: sampleHtml
  },
  "html-viewer": {
    id: "html-viewer",
    mode: "viewer",
    inputKind: "html",
    sampleInput: sampleUnsafeHtml
  },
  "html-to-text": {
    id: "html-to-text",
    mode: "to-text",
    inputKind: "html",
    sampleInput: sampleHtml
  },
  "html-escape": {
    id: "html-escape",
    mode: "escape",
    inputKind: "text",
    sampleInput: sampleText
  },
  "html-unescape": {
    id: "html-unescape",
    mode: "unescape",
    inputKind: "text",
    sampleInput:
      "&lt;article class=&quot;hero&quot;&gt;Safe &amp; readable HTML&lt;/article&gt;"
  },
  "html-to-markdown": {
    id: "html-to-markdown",
    mode: "to-markdown",
    inputKind: "html",
    sampleInput: sampleHtml
  },
  "markdown-to-html": {
    id: "markdown-to-html",
    mode: "to-html",
    inputKind: "markdown",
    sampleInput: sampleMarkdown
  },
  "html-cleaner": {
    id: "html-cleaner",
    mode: "cleaner",
    inputKind: "html",
    sampleInput: sampleUnsafeHtml,
    defaultIndent: 2
  },
  "html-tag-remover": {
    id: "html-tag-remover",
    mode: "tag-remover",
    inputKind: "html",
    sampleInput: sampleHtml
  },
  "html-link-extractor": {
    id: "html-link-extractor",
    mode: "link-extractor",
    inputKind: "html",
    sampleInput: sampleHtml
  },
  "html-image-extractor": {
    id: "html-image-extractor",
    mode: "image-extractor",
    inputKind: "html",
    sampleInput: sampleHtml
  },
  "html-validator": {
    id: "html-validator",
    mode: "validator",
    inputKind: "html",
    sampleInput: sampleUnsafeHtml
  },
  "html-pretty-print": {
    id: "html-pretty-print",
    mode: "pretty-print",
    inputKind: "html",
    sampleInput: sampleHtml,
    defaultIndent: 2
  },
  "html-entity-encoder": {
    id: "html-entity-encoder",
    mode: "entity-encoder",
    inputKind: "text",
    sampleInput: sampleText
  }
};

export const htmlToolBaseLabels = {
  copy: "Copy result",
  copied: "Copied",
  input: "Input",
  output: "Output",
  placeholder: "Paste source here",
  indent: "Indent size",
  removeComments: "Remove comments",
  preview: "Preview",
  source: "Source",
  sanitizedHtml: "Sanitized HTML",
  plainText: "Plain text",
  summary: "Summary",
  total: "Total",
  links: "Links",
  images: "Images",
  errors: "Errors",
  warnings: "Warnings",
  valid: "HTML looks valid",
  invalid: "HTML needs attention",
  href: "Href",
  text: "Text",
  rel: "Rel",
  target: "Target",
  alt: "Alt",
  width: "Width",
  height: "Height",
  empty: "No items found for this input.",
  outputReady: "Result",
  cleanedHtml: "Cleaned HTML",
  formattedHtml: "Formatted HTML",
  minifiedHtml: "Minified HTML",
  markdown: "Markdown output",
  extractedImages: "Extracted images",
  extractedLinks: "Extracted links",
  validationSummary: "Validation summary",
  prettyHtml: "Pretty printed HTML",
  encodedText: "Encoded output"
} as const;

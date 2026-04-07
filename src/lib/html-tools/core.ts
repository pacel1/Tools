import { html as beautifyHtml } from "js-beautify";
import { marked } from "marked";
import {
  parse,
  parseFragment,
  serialize,
  type DefaultTreeAdapterTypes,
  type ParserError
} from "parse5";
import TurndownService from "turndown";

export type HtmlLinkRecord = {
  href: string;
  text: string;
  rel: string;
  target: string;
};

export type HtmlImageRecord = {
  src: string;
  alt: string;
  width: string;
  height: string;
};

export type HtmlValidationIssue = {
  severity: "error" | "warning";
  message: string;
  context?: string;
  suggestion?: string;
};

type HtmlNode = DefaultTreeAdapterTypes.Node;
type HtmlParentNode = DefaultTreeAdapterTypes.ParentNode;
type HtmlElement = DefaultTreeAdapterTypes.Element;
type HtmlTextNode = DefaultTreeAdapterTypes.TextNode;
type HtmlCommentNode = DefaultTreeAdapterTypes.CommentNode;

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced"
});

const blockLikeTags = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "br",
  "div",
  "dl",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul"
]);

const unsafeTags = new Set([
  "script",
  "iframe",
  "object",
  "embed",
  "noscript",
  "template"
]);

const urlAttributes = new Set(["href", "src", "xlink:href"]);

function isParentNode(node: HtmlNode): node is HtmlParentNode {
  return Array.isArray((node as HtmlParentNode).childNodes);
}

function isElementNode(node: HtmlNode): node is HtmlElement {
  return typeof (node as HtmlElement).tagName === "string";
}

function isTextNode(node: HtmlNode): node is HtmlTextNode {
  return node.nodeName === "#text";
}

function isCommentNode(node: HtmlNode): node is HtmlCommentNode {
  return node.nodeName === "#comment";
}

function getAttr(element: HtmlElement, name: string) {
  return element.attrs.find((attribute) => attribute.name === name)?.value ?? "";
}

function setAttr(element: HtmlElement, name: string, value: string) {
  const existing = element.attrs.find((attribute) => attribute.name === name);

  if (existing) {
    existing.value = value;
    return;
  }

  element.attrs.push({ name, value });
}

function walk(node: HtmlNode, visit: (current: HtmlNode) => void) {
  visit(node);

  if (!isParentNode(node)) {
    return;
  }

  for (const child of node.childNodes) {
    walk(child, visit);
  }
}

function normalizeWhitespace(value: string) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isUnsafeUrl(value: string) {
  const normalized = value.trim().toLowerCase();
  return (
    normalized.startsWith("javascript:") ||
    normalized.startsWith("vbscript:") ||
    normalized.startsWith("data:text/html")
  );
}

function sanitizeParent(parent: HtmlParentNode, removeComments = true) {
  const nextChildren: DefaultTreeAdapterTypes.ChildNode[] = [];

  for (const child of parent.childNodes) {
    if (isCommentNode(child) && removeComments) {
      continue;
    }

    if (!isElementNode(child)) {
      nextChildren.push(child);
      continue;
    }

    const tagName = child.tagName.toLowerCase();

    if (unsafeTags.has(tagName)) {
      continue;
    }

    child.attrs = child.attrs.filter((attribute) => {
      if (attribute.name === "srcdoc") {
        return false;
      }

      if (attribute.name.startsWith("on")) {
        return false;
      }

      if (urlAttributes.has(attribute.name) && isUnsafeUrl(attribute.value)) {
        return false;
      }

      return true;
    });

    if (tagName === "a" && getAttr(child, "target") === "_blank") {
      const rel = getAttr(child, "rel");

      if (!/\bnoopener\b/i.test(rel) || !/\bnoreferrer\b/i.test(rel)) {
        setAttr(child, "rel", rel ? `${rel} noopener noreferrer`.trim() : "noopener noreferrer");
      }
    }

    if (isParentNode(child)) {
      sanitizeParent(child, removeComments);
    }

    nextChildren.push(child);
  }

  parent.childNodes = nextChildren;
}

function collectText(node: HtmlNode, parts: string[]) {
  if (isTextNode(node)) {
    parts.push(node.value);
    return;
  }

  if (!isElementNode(node)) {
    return;
  }

  const tagName = node.tagName.toLowerCase();

  if (tagName === "br") {
    parts.push("\n");
    return;
  }

  if (blockLikeTags.has(tagName)) {
    parts.push("\n");
  }

  if (isParentNode(node)) {
    for (const child of node.childNodes) {
      collectText(child, parts);
    }
  }

  if (blockLikeTags.has(tagName)) {
    parts.push("\n");
  }
}

function collectParseErrors(markup: string) {
  const issues: ParserError[] = [];
  parse(markup, {
    sourceCodeLocationInfo: true,
    onParseError: (error) => {
      issues.push(error);
    }
  });
  return issues;
}

function createContext(line?: number, col?: number) {
  if (!line || !col) {
    return undefined;
  }

  return `Line ${line}, column ${col}`;
}

export function formatHtmlDocument(markup: string, indentSize = 2) {
  const preparedMarkup = markup.replace(/>\s*</g, ">\n<");

  return beautifyHtml(preparedMarkup, {
    indent_size: indentSize,
    wrap_line_length: 0,
    preserve_newlines: true,
    end_with_newline: false
  }).trim();
}

export function prettyPrintHtmlDocument(markup: string) {
  return formatHtmlDocument(markup, 2);
}

export function sanitizeHtmlMarkup(markup: string, removeComments = true) {
  const fragment = parseFragment(markup) as DefaultTreeAdapterTypes.DocumentFragment;
  sanitizeParent(fragment, removeComments);
  return serialize(fragment).trim();
}

export function cleanHtmlMarkup(markup: string, indentSize = 2, removeComments = true) {
  const sanitized = sanitizeHtmlMarkup(markup, removeComments);
  return formatHtmlDocument(sanitized, indentSize);
}

export async function minifyHtmlDocument(markup: string) {
  const safeMarkup = sanitizeHtmlMarkup(markup, true);
  return safeMarkup
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/\n+/g, "")
    .trim();
}

export function htmlToText(markup: string) {
  const fragment = parseFragment(markup) as DefaultTreeAdapterTypes.DocumentFragment;
  const parts: string[] = [];

  for (const child of fragment.childNodes) {
    collectText(child, parts);
  }

  return normalizeWhitespace(parts.join(" "));
}

export function stripHtmlTags(markup: string) {
  return htmlToText(markup);
}

export function escapeHtmlText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function unescapeHtmlText(value: string) {
  const entityMap: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: "\""
  };

  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    const normalized = String(entity).toLowerCase();

    if (normalized.startsWith("#x")) {
      const codePoint = Number.parseInt(normalized.slice(2), 16);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    if (normalized.startsWith("#")) {
      const codePoint = Number.parseInt(normalized.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    return entityMap[normalized] ?? match;
  });
}

export function encodeHtmlEntities(value: string) {
  const namedMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  };

  return Array.from(value)
    .map((character) => {
      if (namedMap[character]) {
        return namedMap[character];
      }

      if (/^[a-z0-9\s]$/i.test(character)) {
        return character;
      }

      return `&#${character.codePointAt(0) ?? 0};`;
    })
    .join("");
}

export function convertHtmlToMarkdown(markup: string) {
  return turndown.turndown(markup).trim();
}

export function convertMarkdownToHtml(markdown: string) {
  const rawHtml = marked.parse(markdown, {
    breaks: true,
    gfm: true
  }) as string;

  return cleanHtmlMarkup(rawHtml, 2, true);
}

export function extractHtmlLinks(markup: string): HtmlLinkRecord[] {
  const fragment = parseFragment(markup) as DefaultTreeAdapterTypes.DocumentFragment;
  const records: HtmlLinkRecord[] = [];

  walk(fragment, (node) => {
    if (!isElementNode(node) || node.tagName.toLowerCase() !== "a") {
      return;
    }

    const textParts: string[] = [];
    if (isParentNode(node)) {
      for (const child of node.childNodes) {
        collectText(child, textParts);
      }
    }

    records.push({
      href: getAttr(node, "href"),
      text: normalizeWhitespace(textParts.join(" ")) || "(no anchor text)",
      rel: getAttr(node, "rel"),
      target: getAttr(node, "target")
    });
  });

  return records;
}

export function extractHtmlImages(markup: string): HtmlImageRecord[] {
  const fragment = parseFragment(markup) as DefaultTreeAdapterTypes.DocumentFragment;
  const records: HtmlImageRecord[] = [];

  walk(fragment, (node) => {
    if (!isElementNode(node) || node.tagName.toLowerCase() !== "img") {
      return;
    }

    records.push({
      src: getAttr(node, "src"),
      alt: getAttr(node, "alt"),
      width: getAttr(node, "width"),
      height: getAttr(node, "height")
    });
  });

  return records;
}

export function validateHtmlMarkup(markup: string) {
  const issues: HtmlValidationIssue[] = [];
  const parserIssues = collectParseErrors(markup);
  const fragment = parseFragment(markup) as DefaultTreeAdapterTypes.DocumentFragment;
  const seenIds = new Map<string, number>();

  for (const issue of parserIssues) {
    issues.push({
      severity: "error",
      message: `Parser reported ${issue.code.replace(/-/g, " ")}.`,
      context: createContext(issue.startLine, issue.startCol),
      suggestion: "Review the reported area and close or reorder tags as needed."
    });
  }

  walk(fragment, (node) => {
    if (!isElementNode(node)) {
      return;
    }

    const tagName = node.tagName.toLowerCase();
    const id = getAttr(node, "id");

    if (unsafeTags.has(tagName)) {
      issues.push({
        severity: "error",
        message: `Unsafe <${tagName}> tag detected.`,
        suggestion: "Remove executable or embedded content before publishing."
      });
    }

    if (id) {
      const count = seenIds.get(id) ?? 0;
      seenIds.set(id, count + 1);
      if (count >= 1) {
        issues.push({
          severity: "warning",
          message: `Duplicate id "${id}" found.`,
          suggestion: "Use unique id values to avoid broken labels, CSS and anchors."
        });
      }
    }

    if (tagName === "img" && !getAttr(node, "alt")) {
      issues.push({
        severity: "warning",
        message: "Image is missing alt text.",
        suggestion: "Add a descriptive alt attribute for accessibility and SEO."
      });
    }

    if (tagName === "a" && getAttr(node, "target") === "_blank") {
      const rel = getAttr(node, "rel");
      if (!/\bnoopener\b/i.test(rel) || !/\bnoreferrer\b/i.test(rel)) {
        issues.push({
          severity: "warning",
          message: 'Link opens in a new tab without rel="noopener noreferrer".',
          suggestion: "Add rel=\"noopener noreferrer\" for security."
        });
      }
    }

    for (const attribute of node.attrs) {
      if (attribute.name.startsWith("on")) {
        issues.push({
          severity: "error",
          message: `Inline event handler "${attribute.name}" detected.`,
          suggestion: "Remove inline JavaScript handlers from the markup."
        });
      }

      if (urlAttributes.has(attribute.name) && isUnsafeUrl(attribute.value)) {
        issues.push({
          severity: "error",
          message: `Unsafe URL detected in "${attribute.name}".`,
          suggestion: "Use safe http, https, mailto or relative URLs instead."
        });
      }
    }
  });

  const deduped = Array.from(
    new Map(
      issues.map((issue) => [
        `${issue.severity}:${issue.message}:${issue.context ?? ""}`,
        issue
      ])
    ).values()
  );

  const errorCount = deduped.filter((issue) => issue.severity === "error").length;
  const warningCount = deduped.filter((issue) => issue.severity === "warning").length;

  return {
    isValid: errorCount === 0,
    issues: deduped,
    errorCount,
    warningCount
  };
}

# Utility Globe Starter

SEO-first starter for a global tools portal built with Next.js 15, TypeScript, Tailwind CSS, App Router and `next-intl`.

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- App Router
- `next-intl`
- Zod
- Vitest
- ESLint + Prettier
- OpenAI Responses API only in `scripts/` and `src/lib/server/`

## Key ideas

- No PostgreSQL and no classic database.
- Tool definitions, registry and localized content live in the repo as JSON and TypeScript.
- Every tool page is static-friendly and SEO-ready.
- New tools can be scaffolded from a single JSON definition or an interactive prompt.
- OpenAI is used only to generate code and localized content, never from client bundles.

## Install

```bash
pnpm install
pnpm dev
```

Copy the example env first:

```bash
cp env.example .env
```

Required variables:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.4-mini
SITE_URL=https://example.com
```

## Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm add-tool
pnpm add-tool -- --file examples/base64-encoder.tool.json
pnpm generate:tool-code -- --file examples/base64-encoder.tool.json
pnpm generate:tool-content -- --file examples/base64-encoder.tool.json
pnpm generate:localized-content
pnpm validate:registry
```

## How to add a new tool

### Option 1: interactive

```bash
pnpm add-tool
```

The CLI asks for:

- `id`
- `title`
- `shortDescription`
- `type`
- `category`
- `promptContext`
- `seoPriority`

### Option 2: one JSON definition

```bash
pnpm add-tool -- --file examples/base64-encoder.tool.json
```

The command will:

1. create the source tool definition JSON
2. generate `logic.ts`, `component.tsx`, `schema.ts` and `test.ts`
3. generate localized content for `en/pl/es/de/fr`
4. update registry manifests
5. update category indexes
6. recalculate related tools

## Where to edit the registry

- Source records: `src/data/tools/definitions/*.json`
- Generated registry manifest: `src/lib/tools/tool-registry.generated.ts`
- Generated runtime manifest: `src/lib/tools/tool-runtime.generated.ts`
- Generated category index: `src/data/categories/generated.json`
- Generated content manifest: `src/lib/tools/tool-content.generated.ts`

## Where generated files go

- Tool definition: `src/data/tools/definitions/<tool-id>.json`
- Localized content: `src/data/tools/content/<locale>/<tool-id>.json`
- Logic: `src/tools/logic/<tool-id>.ts`
- Schema: `src/tools/schema/<tool-id>.ts`
- Component: `src/components/tools/<tool-id>-tool.tsx`
- Test: `src/tools/tests/<tool-id>.test.ts`

## How to add a new language

1. Add the locale to `src/lib/constants.ts`.
2. Add the locale to `src/lib/i18n/routing.ts`.
3. Create `src/messages/<locale>.json`.
4. Create `src/data/tools/content/<locale>/`.
5. Update generators in `scripts/generate-tool-content.ts` if you want OpenAI to scaffold that locale automatically.
6. Run `pnpm validate:registry`.

## Refresh localized names and slugs

If you want to relocalize existing tool titles, H1 headings and slugs for all active languages, run:

```bash
pnpm generate:localized-content
```

## Important directories

```text
src/
  app/
  components/
  data/
    categories/
    tools/
      definitions/
      content/
  lib/
    i18n/
    seo/
    server/
    tools/
  messages/
  tools/
    logic/
    schema/
    tests/
scripts/
  shared/
examples/
```

## Example dynamic route

- `src/app/[locale]/[category]/[slug]/page.tsx`

This route renders:

- H1
- tool UI above the fold
- short description
- how it works
- examples
- FAQ
- related tools
- breadcrumbs
- canonical
- hreflang alternates
- metadata

## Example starter tools

- kg to lbs converter
- word counter
- json formatter

## Notes

- If `OPENAI_API_KEY` is missing, the generators fall back to deterministic local templates so the workflow still completes.
- The live site does not need a database for the included architecture.
- The project is organized to scale to 150+ tools through generated manifests rather than ad hoc manual imports.

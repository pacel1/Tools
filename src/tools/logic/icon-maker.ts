import { buildDownloadName } from "@/lib/image-tools/core";
import {
  iconMakerInputSchema,
  iconMakerOutputSchema,
  type IconMakerInput,
  type IconMakerOutput
} from "@/tools/schema/icon-maker";

export function runIconMaker(input: IconMakerInput): IconMakerOutput {
  const parsed = iconMakerInputSchema.parse(input);

  return iconMakerOutputSchema.parse({
    size: parsed.size,
    padding: parsed.padding,
    background: parsed.background,
    format: parsed.format,
    downloadName: buildDownloadName(parsed.sourceName, "icon", parsed.format)
  });
}

export const toolLogic = runIconMaker;

import { z } from "zod";

export const imageMetadataReaderInputSchema = z.object({
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  fileSizeBytes: z.coerce.number().int().min(0),
  width: z.coerce.number().int().min(1),
  height: z.coerce.number().int().min(1),
  rawMetadata: z.record(z.string(), z.unknown()).default({})
});

export const imageMetadataReaderOutputSchema = z.object({
  fileName: z.string(),
  mimeType: z.string(),
  fileSizeBytes: z.number().int().min(0),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  cameraMake: z.string().optional(),
  cameraModel: z.string().optional(),
  lensModel: z.string().optional(),
  dateTaken: z.string().optional(),
  iso: z.number().int().optional(),
  exposureTime: z.string().optional(),
  fNumber: z.string().optional(),
  focalLength: z.string().optional(),
  flash: z.string().optional(),
  orientation: z.string().optional(),
  gps: z.object({ latitude: z.number(), longitude: z.number(), mapUrl: z.string().url() }).optional(),
  raw: z.record(z.string(), z.unknown())
});

export const toolInputSchema = imageMetadataReaderInputSchema;
export const toolOutputSchema = imageMetadataReaderOutputSchema;

export type ImageMetadataReaderInput = z.infer<typeof imageMetadataReaderInputSchema>;
export type ImageMetadataReaderOutput = z.infer<typeof imageMetadataReaderOutputSchema>;

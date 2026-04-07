import { describe, expect, it } from "vitest";
import { runImageMetadataReader } from "@/tools/logic/image-metadata-reader";

describe("image-metadata-reader", () => {
  it("normalizes EXIF metadata into a stable shape", () => {
    const result = runImageMetadataReader({
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

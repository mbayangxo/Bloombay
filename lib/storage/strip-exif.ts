/** Strip EXIF and other metadata from raster images before storage. */

const STRIPPABLE = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function stripExif(buffer: Buffer, mimeType?: string): Promise<Buffer> {
  if (mimeType && !STRIPPABLE.has(mimeType)) return buffer;
  if (!mimeType) {
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
    const isPng = buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    if (!isJpeg && !isPng) return buffer;
  }

  try {
    const sharp = (await import("sharp")).default;
    const pipeline = sharp(buffer, { failOn: "none" }).rotate();
    if (mimeType === "image/png") {
      return pipeline.png({ force: true }).toBuffer();
    }
    if (mimeType === "image/webp") {
      return pipeline.webp({ force: true }).toBuffer();
    }
    return pipeline.jpeg({ quality: 90, mozjpeg: true }).toBuffer();
  } catch {
    return buffer;
  }
}

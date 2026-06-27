/** Convert client base64 data URLs to Buffer — never persist base64 in DB. */

const DATA_URL_RE = /^data:([^;]+);base64,(.+)$/;

export function parseBase64DataUrl(dataUrl: string): { mime: string; buffer: Buffer } | null {
  const match = DATA_URL_RE.exec(dataUrl.trim());
  if (!match) return null;
  try {
    return { mime: match[1], buffer: Buffer.from(match[2], "base64") };
  } catch {
    return null;
  }
}

export function isBase64DataUrl(value: string): boolean {
  return DATA_URL_RE.test(value.trim());
}

export async function toBuffer(input: Buffer | Blob): Promise<Buffer> {
  if (Buffer.isBuffer(input)) return input;
  const ab = await input.arrayBuffer();
  return Buffer.from(ab);
}

// Compresses an image File/Blob before upload
// Returns a WebP Blob at the target quality
export async function compressImage(
  file: File,
  options: { maxWidthPx?: number; qualityPct?: number; maxSizeKB?: number } = {}
): Promise<Blob> {
  const { maxWidthPx = 1200, qualityPct = 0.78, maxSizeKB = 250 } = options;

  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // Scale down if wider than maxWidthPx
      if (width > maxWidthPx) {
        height = Math.round((height * maxWidthPx) / width);
        width = maxWidthPx;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas context")); return; }
      ctx.drawImage(img, 0, 0, width, height);

      // Try WebP first, fall back to JPEG
      canvas.toBlob(
        blob => {
          if (!blob) { reject(new Error("Canvas toBlob failed")); return; }
          // If still too large, recurse with lower quality
          if (blob.size > maxSizeKB * 1024 && qualityPct > 0.4) {
            compressImage(file, { maxWidthPx, qualityPct: qualityPct - 0.1, maxSizeKB })
              .then(resolve)
              .catch(reject);
            return;
          }
          resolve(blob);
        },
        "image/webp",
        qualityPct
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}

// Convert a Blob to a File with a given name
export function blobToFile(blob: Blob, name: string): File {
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const baseName = name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.${ext}`, { type: blob.type });
}

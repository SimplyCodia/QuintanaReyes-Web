/**
 * Convert a base64 string returned by the backend into a value usable as an
 * <img> src attribute. Handles three cases:
 *   - empty/null/undefined → fallback placeholder
 *   - already a data URI (starts with "data:image") → return as-is
 *   - raw base64 → wrap with the provided MIME type (default image/webp)
 */
export function getBase64ImageSrc(
  base64String: string | null | undefined,
  mimeType?: string | null,
): string {
  if (!base64String) return '/images/placeholder-blog.webp';
  if (base64String.startsWith('data:image')) return base64String;
  const mime = mimeType || 'image/webp';
  return `data:${mime};base64,${base64String}`;
}

/**
 * Read a File and return only its base64 payload (no data URI prefix), so
 * the backend can pair it with the validated MIME type from the file metadata.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const commaIdx = result.indexOf(',');
      resolve(commaIdx === -1 ? result : result.slice(commaIdx + 1));
    };
    reader.onerror = () => reject(reader.error || new Error('Error leyendo archivo.'));
    reader.readAsDataURL(file);
  });
}

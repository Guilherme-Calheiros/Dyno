export const allowedContentTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export const allowedContentTypesMessage =
  "Formato não suportado. Use JPEG, PNG ou WebP.";

export type AllowedContentType = keyof typeof allowedContentTypes;

export function resolveImageExtension(
  contentType: unknown
): string | null {
  if (typeof contentType !== "string") return null;

  if (!(contentType in allowedContentTypes)) return null;

  return allowedContentTypes[contentType as AllowedContentType];
}
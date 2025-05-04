// src/utils/url.ts
export const formatMediaUrl = (url: string | null): string | null => {
  if (!url) return null;

  // If we're in development, keep the full URL
  if (import.meta.env.DEV) {
    return url;
  }

  // In production, proxy the media URL through our Vercel rewrites
  return url.replace('http://34.101.148.210:9000/media', '/media');
};

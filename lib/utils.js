import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves the full URL for an image/media file.
 * Priority:
 * 1. NEXT_PUBLIC_UPLOAD_URL (CDN or specific media host)
 * 2. NEXT_PUBLIC_API_URL (stripped of /api suffix)
 * 3. Default localhost:5001
 */
export function resolveImageUrl(path) {
  if (!path) return "/Ecell-logo.png";
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;
  
  const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL;
  if (uploadUrl) {
    return `${uploadUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  }

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/api$/, '');
  return `${apiUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

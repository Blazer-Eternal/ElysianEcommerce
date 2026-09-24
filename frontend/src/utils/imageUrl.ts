/**
 * Returns a width-constrained Cloudinary delivery URL for `url`.
 *
 * Cloudinary applies transform segments placed right after `/image/upload/`
 * (e.g. `/image/upload/w_800,q_auto,f_auto/v123/folder/img.jpg`), so we inject
 * `w_<width>,q_auto,f_auto` there exactly once: the CDN then returns an
 * appropriately sized variant in the best modern format (WebP/AVIF) instead of
 * the full-size original.
 *
 * Anything that is not a plain res.cloudinary.com upload URL — other CDNs,
 * local files, or a URL that already carries a transform segment — is returned
 * untouched, so this is always safe to call with any product image URL.
 */
export function cloudinaryImg(url: string, width: number): string {
  if (!url || !/^https?:\/\/res\.cloudinary\.com\//.test(url)) return url;

  const marker = "/image/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const rest = url.slice(idx + marker.length);
  const segEnd = rest.indexOf("/");
  const firstSeg = segEnd === -1 ? rest : rest.slice(0, segEnd);

  // Already transformed (`w_256,...`, `c_fill,...`), empty, or an exotic
  // segment containing `$` / `!` -> leave the URL exactly as given.
  if (
    firstSeg === "" ||
    firstSeg.includes("$") ||
    firstSeg.includes("!") ||
    /^[a-z]{1,3}_/.test(firstSeg)
  ) {
    return url;
  }

  return `${url.slice(0, idx + marker.length)}w_${width},q_auto,f_auto/${rest}`;
}

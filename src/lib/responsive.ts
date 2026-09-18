/* Delivery-time image optimisation helpers.
   Everything here is pure URL rewriting — no build step, no extra requests —
   so the site can serve small, modern, exactly-sized bytes on slow networks
   while keeping the original asset one click away. */

const UNSPLASH_HOST = 'images.unsplash.com'

/** Rewrites an Unsplash URL to a given width/quality and returns a `srcset`
    across `widths`. Returns undefined for local or non-Unsplash sources. */
export function unsplashSrcSet(
  url: string,
  widths: number[],
  q?: number,
): string | undefined {
  if (!url.includes(UNSPLASH_HOST)) return undefined
  return widths
    .map((w) => {
      let next = url.replace(/([?&])w=\d+/, `$1w=${w}`)
      if (q) next = next.replace(/([?&])q=\d+/, `$1q=${q}`)
      return `${next} ${w}w`
    })
    .join(', ')
}

/* Cloudinary delivery: f_auto picks AVIF/WebP for the browser, q_auto:good is
   perceptual quality that holds up on poster type, c_limit never upscales or
   crops. Only the `w_` changes per srcset entry. */
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/
const CLOUDINARY_OPTS = 'f_auto,q_auto:good,c_limit'

export function cloudinaryUrl(
  url: string,
  width: number,
  opts: string = CLOUDINARY_OPTS,
): string {
  const match = url.match(CLOUDINARY_UPLOAD)
  if (!match) return url
  return `${match[1]}${opts},w_${width}/${match[2]}`
}

export function cloudinarySrcSet(
  url: string,
  widths: number[],
  opts: string = CLOUDINARY_OPTS,
): string | undefined {
  if (!CLOUDINARY_UPLOAD.test(url)) return undefined
  return widths.map((w) => `${cloudinaryUrl(url, w, opts)} ${w}w`).join(', ')
}

/** Builds a `srcset` from pre-generated local assets named `base-{width}.ext`. */
export function localSrcSet(base: string, widths: number[], ext = 'webp'): string {
  return widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ')
}

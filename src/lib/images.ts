/**
 * Image helpers on top of astro:assets. Every page image comes from
 * src/assets/images and is served as AVIF and WebP at the widths it is really
 * shown at, with a JPEG (or PNG, for transparent images) fallback.
 *
 * Images that need a stable public URL (Open Graph, JSON-LD) also keep a
 * small copy in public/images; pages never load those copies.
 */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export type ImageKind = 'photo' | 'graphic';

/**
 * Width and height without marking the original file as used. Reading any
 * property of an imported image makes Astro copy the full-size original into
 * the build; its private `clone` does not (getImage reads it the same way).
 */
export function dims(src: ImageMetadata): { width: number; height: number } {
  const meta = (src as ImageMetadata & { clone?: ImageMetadata }).clone ?? src;
  return { width: meta.width, height: meta.height };
}

/** width / height of an imported image. */
export const aspect = (src: ImageMetadata) => {
  const { width, height } = dims(src);
  return width / height;
};

/** Photos at about JPEG 80; graphics with lettering a step higher so text stays crisp. */
const QUALITY: Record<ImageKind, { avif: number; webp: number; jpg: number }> = {
  photo: { avif: 56, webp: 78, jpg: 80 },
  graphic: { avif: 64, webp: 84, jpg: 85 },
};

export interface PictureData {
  avif: string;
  webp: string;
  fallback: string;
  width: number;
  height: number;
}

const clampWidths = (src: ImageMetadata, widths: number[]) =>
  [...new Set(widths.map((w) => Math.min(Math.round(w), dims(src).width)))].sort((a, b) => a - b);

/**
 * Width-descriptor sources for an image whose CSS box sets its width
 * (w-full, absolute inset-0 ...). Never upscales: widths above the original
 * are dropped in favour of the original width. width/height are the
 * original's, so layout and aspect ratio match a plain <img> of the file.
 */
export async function responsiveSources(
  src: ImageMetadata,
  widths: number[],
  kind: ImageKind = 'photo',
  alpha = false,
): Promise<PictureData> {
  const q = QUALITY[kind];
  const ws = clampWidths(src, widths);
  const largest = ws[ws.length - 1];
  const [avif, webp, fallback] = await Promise.all([
    getImage({ src, width: largest, widths: ws, format: 'avif', quality: q.avif }),
    getImage({ src, width: largest, widths: ws, format: 'webp', quality: q.webp }),
    getImage({ src, width: largest, format: alpha ? 'png' : 'jpg', quality: alpha ? 90 : q.jpg }),
  ]);
  return {
    avif: avif.srcSet.attribute,
    webp: webp.srcSet.attribute,
    fallback: fallback.src,
    ...dims(src),
  };
}

/**
 * 1x and 2x sources for an image shown at one CSS width (logos, fixed-width
 * art). cssWidth must be the largest width it is shown at, so the intrinsic
 * size the browser uses is never smaller than the box it fills.
 */
export async function densitySources(
  src: ImageMetadata,
  cssWidth: number,
  kind: ImageKind = 'graphic',
  alpha = false,
): Promise<PictureData> {
  const q = QUALITY[kind];
  const { width, height } = dims(src);
  const w1 = Math.min(Math.round(cssWidth), width);
  const w2 = Math.min(Math.round(cssWidth * 2), width);
  const set = async (format: 'avif' | 'webp', quality: number) => {
    const one = await getImage({ src, width: w1, format, quality });
    if (w2 <= w1) return `${one.src} 1x`;
    const two = await getImage({ src, width: w2, format, quality });
    return `${one.src} 1x, ${two.src} ${Number((w2 / w1).toFixed(3))}x`;
  };
  const [avif, webp, fallback] = await Promise.all([
    set('avif', q.avif),
    set('webp', q.webp),
    getImage({ src, width: w1, format: alpha ? 'png' : 'jpg', quality: alpha ? 90 : q.jpg }),
  ]);
  return { avif, webp, fallback: fallback.src, width: w1, height: Math.round((w1 * height) / width) };
}

/** Full-size WebP for the click-to-enlarge lightboxes (shown at up to 90vw x 90vh). */
export async function lightboxSrc(src: ImageMetadata): Promise<string> {
  const { width: w, height: h } = dims(src);
  const width = Math.min(w, 2000, Math.round((1700 * w) / h));
  return (await getImage({ src, width, format: 'webp', quality: QUALITY.graphic.webp })).src;
}

/** One WebP at the original width, for <video poster>, which takes no srcset. */
export async function posterSrc(src: ImageMetadata): Promise<string> {
  return (await getImage({ src, width: dims(src).width, format: 'webp', quality: QUALITY.photo.webp })).src;
}

export const HERO_WIDTHS = [640, 960, 1280, 1600, 1920, 2200, 2560];

/**
 * sizes for the full-bleed object-cover heroes. A cover image is drawn wider
 * than the viewport whenever the box is taller than the image's shape, so on
 * phones the hero is about three screens wide.
 *
 * home: the homepage hero, at least 760px tall (900px from md) and usually
 *   taller than that from its content, so about 1250px wide on phones.
 * page: PageHero, 70vh tall, so 70vh x the image's aspect ratio wide.
 */
export function heroSizes(src: ImageMetadata, variant: 'home' | 'page'): string {
  if (variant === 'home') return '(max-width: 767px) 1250px, (max-width: 1550px) 1550px, 100vw';
  const ratio = aspect(src);
  return `(max-aspect-ratio: ${Math.round(700 * ratio)}/1000) ${Math.round(70 * ratio)}vh, 100vw`;
}

/** The preload hint for a hero, with the same URLs the hero <picture> uses. */
export async function heroPreload(src: ImageMetadata, variant: 'home' | 'page') {
  const s = await responsiveSources(src, HERO_WIDTHS, 'photo');
  return { srcset: s.avif, sizes: heroSizes(src, variant) };
}

/**
 * sizes for an object-cover image in a box of the given aspect ratio
 * (width / height) whose width is given by `boxSizes` entries.
 * When the image is wider than the box, cover draws it wider than the box.
 */
export function coverSizes(src: ImageMetadata, boxRatio: number, boxSizes: [string, number, 'px' | 'vw'][]): string {
  const f = Math.max(1, aspect(src) / boxRatio);
  return boxSizes
    .map(([media, n, unit]) => `${media ? media + ' ' : ''}${Math.round(n * f)}${unit}`)
    .join(', ');
}

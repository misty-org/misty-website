import { useState } from "react";
import { fallbackImage, homeMedia, type HomeMediaSlot } from "./homeMedia";

/** A missing replacement falls back to a shipped capture, without changing size. */
export function ProductImage({ slot, eager = false }: { slot: HomeMediaSlot; eager?: boolean }) {
  const media = homeMedia[slot];
  const [failedSrc, setFailedSrc] = useState<string>();
  const useFallback = !media.src || failedSrc === media.src;
  const { src, alt } = useFallback ? fallbackImage : media;

  return (
    <div className="mist-product-image" data-image-slot={slot} data-fallback={useFallback}>
      <img
        src={src}
        alt={alt}
        width={1600}
        height={1000}
        loading={eager ? "eager" : "lazy"}
        onError={() => { if (!useFallback) setFailedSrc(src); }}
      />
    </div>
  );
}

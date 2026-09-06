import { useRef, useState, type ReactNode } from "react";
import { Expand, X, ZoomIn, ZoomOut } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { productScreenshotSlots, type ProductScreenshotSlotId } from "@/content/productScreenshotSlots";

/** Keep the image in place while giving touch users a readable, pannable view. */
export function MobileScreenshotPreview({ slot, children }: { slot: ProductScreenshotSlotId; children: ReactNode }) {
  const screenshot = productScreenshotSlots[slot];
  const [zoomed, setZoomed] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  if (!screenshot.src) return children;

  return (
    <Dialog onOpenChange={() => setZoomed(false)}>
      <div className="mobile-screenshot-preview">
        {children}
        <DialogTrigger className="mobile-screenshot-trigger" aria-label={`Enlarge screenshot: ${screenshot.alt}`}>
          <span><Expand size={14} aria-hidden="true" /> Expand</span>
        </DialogTrigger>
      </div>
      <DialogContent className="mobile-screenshot-dialog" showCloseButton={false}>
        <div className="mobile-screenshot-toolbar">
          <DialogTitle>Take a closer look</DialogTitle>
          <DialogClose aria-label="Close screenshot"><X size={20} aria-hidden="true" /></DialogClose>
        </div>
        <DialogDescription>{zoomed ? "Swipe across the image to explore the details." : "Zoom in to explore the screenshot."}</DialogDescription>
        <div ref={scrollerRef} className="mobile-screenshot-canvas" tabIndex={0} role="region" aria-label="Screenshot" data-zoomed={zoomed}>
          <img src={screenshot.src} alt={screenshot.alt} width={screenshot.width} height={screenshot.height} />
        </div>
        <button type="button" className="mobile-screenshot-zoom" aria-pressed={zoomed} onClick={() => {
          setZoomed(value => !value);
          scrollerRef.current?.scrollTo({ left: 0, top: 0, behavior: "instant" });
        }}>
          {zoomed ? <ZoomOut size={18} aria-hidden="true" /> : <ZoomIn size={18} aria-hidden="true" />}
          {zoomed ? "Fit to screen" : "Zoom in"}
        </button>
      </DialogContent>
    </Dialog>
  );
}

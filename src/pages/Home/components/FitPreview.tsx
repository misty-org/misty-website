import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

export function FitPreview({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setScale(Math.min(element.clientWidth / 720, element.clientHeight / 480));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="relative h-full overflow-hidden">
    <div className="absolute left-1/2 top-1/2 h-[480px] w-[720px] origin-center" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>{children}</div>
  </div>;
}


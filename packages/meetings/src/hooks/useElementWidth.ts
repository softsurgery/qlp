import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * Live width of an element. The meetings UI sits next to the app sidebar, so layout
 * decisions follow the space it actually has rather than the screen width.
 */
export function useElementWidth<T extends HTMLElement>(ref: RefObject<T>): number {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    setWidth(element.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

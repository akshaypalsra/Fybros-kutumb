import { useCallback, useEffect, useRef, useState } from "react";

export const useInfiniteScrollTrigger = (onIntersect: () => void, enabled: boolean) => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const onIntersectRef = useRef(onIntersect);
  const enabledRef = useRef(enabled);

  onIntersectRef.current = onIntersect;
  enabledRef.current = enabled;

  const sentinelRef = useCallback((el: HTMLDivElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && enabledRef.current) {
          onIntersectRef.current();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node]); // re-runs only when the actual DOM node changes (mounts/unmounts)

  return sentinelRef;
};
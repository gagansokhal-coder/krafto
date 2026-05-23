import { useEffect, useRef, useState } from 'react';

interface UseIntersectionOptions extends IntersectionObserverInit {
  /** Once true, stop observing (default: true) */
  once?: boolean;
}

/**
 * Returns a ref to attach to a DOM element and a boolean indicating
 * whether that element is currently intersecting the viewport.
 * Useful for scroll-triggered animations.
 */
export function useIntersection<T extends Element = HTMLDivElement>(
  options: UseIntersectionOptions = {}
): [React.RefObject<T>, boolean] {
  const { once = true, threshold = 0.1, rootMargin = '0px', root = null } = options;
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsIntersecting(false);
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin, root]);

  return [ref, isIntersecting];
}

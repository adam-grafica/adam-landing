import { useEffect, useRef, type RefObject } from 'react';

interface UseRevealGroupOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Hook para revelar un grupo de hijos con stagger CSS.
 * Observa el contenedor padre y cuando entra al viewport,
 * agrega clase 'revealed' al padre. Los hijos usan
 * CSS transition-delay via nth-child para el efecto cascada.
 */
export function useRevealGroup<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealGroupOptions = {}
): RefObject<T | null> {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px' } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('revealed');
      return;
    }

    el.style.willChange = 'transform, opacity';

    const observer = new IntersectionObserver(
      (entries) => {
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              entry.target.addEventListener('transitionend', () => {
                (entry.target as HTMLElement).style.willChange = 'auto';
              }, { once: true });
              observer.unobserve(entry.target);
            }
          });
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      el.style.willChange = 'auto';
    };
  }, [threshold, rootMargin]);

  return ref;
}

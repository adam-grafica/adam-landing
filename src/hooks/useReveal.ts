import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Hook que usa IntersectionObserver para detectar cuando un elemento
 * entra al viewport. Reemplaza ScrollTrigger para animaciones de reveal.
 * 
 * - RAF-batched: sincroniza con el frame del compositor
 * - will-change lifecycle: activa GPU solo durante la transición
 * - once: desconecta el observer después del primer reveal
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.08, rootMargin = '0px 0px 0px 0px', once = true } = options;
  const ref = useRef<T>(null);
  // El estado inicial ya refleja prefers-reduced-motion: si el usuario pide
  // menos movimiento, el reveal nace activo y el efecto no necesita setState.
  const [isRevealed, setIsRevealed] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respetar prefers-reduced-motion (ya inicializado en useState)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('revealed');
      return;
    }

    // Preparar GPU para la transición
    el.style.willChange = 'transform, opacity';

    const observer = new IntersectionObserver(
      (entries) => {
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsRevealed(true);
              entry.target.classList.add('revealed');

              // Limpiar will-change después de la transición
              entry.target.addEventListener('transitionend', () => {
                (entry.target as HTMLElement).style.willChange = 'auto';
              }, { once: true });

              if (once) observer.unobserve(entry.target);
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
  }, [threshold, rootMargin, once]);

  return [ref, isRevealed];
}

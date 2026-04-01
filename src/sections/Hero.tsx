import { useEffect, useRef } from 'react';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right'
import Play from 'lucide-react/dist/esm/icons/play';
import { trackCTAClick } from '../utils/analytics';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Si el usuario prefiere movimiento reducido, el CSS ya los muestra visibles
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // gsap se declara fuera del import() para poder llamar ctx?.revert() en cleanup
    let cleanupFn: (() => void) | undefined;

    // Carga lazy: GSAP no bloquea el primer render del browser
    import('gsap').then(({ default: gsap }) => {
      const ctx = gsap.context(() => {
        // Estado inicial ya está en CSS (opacity: 0 en .hero-*)
        // fromTo() lee el estado CSS y anima hacia el estado final
        const tl = gsap.timeline({ delay: 0 });

        tl.fromTo('.hero-mesh',
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out' }
          )
          .fromTo('.hero-eyebrow',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out' },
            '-=0.9'
          )
          // H1 — reveal with transform y to avoid hiding the LCP element
          .fromTo('.hero-headline span',
            { y: 30, immediateRender: false },
            { y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' },
            '-=0.9'
          )
          .fromTo('.hero-subheadline',
            { opacity: 0, y: 24, immediateRender: false },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
            '-=0.3'
          )
          .fromTo('.hero-ctas',
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out' },
            '-=0.25'
          )
          .fromTo('.hero-social-proof',
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
            '-=0.2'
          );
      }, heroRef);

      cleanupFn = () => ctx.revert();
    });

    return () => cleanupFn?.();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ag-bg-primary"
      aria-label="Hero Section"
    >
      {/* Static dot grid */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Static blue grid */}
      <div className="absolute inset-0 grid-pattern-animated" />

      {/* Animated Mesh Orb — CSS float only (GPU composited) */}
      <div className="hero-mesh absolute right-0 top-1/2 -translate-y-1/2 w-[560px] h-[560px] lg:w-[750px] lg:h-[750px] pointer-events-none">
        {/* Outer glow — CSS float, no rotation */}
        <div className="absolute inset-0 bg-gradient-to-br from-ag-blue/25 via-ag-blue-light/15 to-transparent rounded-full blur-[90px] animate-float" />
        <div className="absolute inset-12 bg-gradient-to-tr from-ag-blue/15 to-ag-blue-light/8 rounded-full blur-[70px] animate-float" style={{ animationDelay: '-3.5s' }} />

        {/* Mesh Lines SVG — static, no GSAP */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 400" aria-hidden="true">
          <defs>
            <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#0066FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00AAFF" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <g>
            {[...Array(7)].map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={56 + i * 48} x2="400" y2={56 + i * 48}
                stroke="url(#meshGradient)" strokeWidth="0.5" />
            ))}
            {[...Array(7)].map((_, i) => (
              <line key={`v-${i}`} x1={56 + i * 48} y1="0" x2={56 + i * 48} y2="400"
                stroke="url(#meshGradient)" strokeWidth="0.5" />
            ))}
            {[...Array(9)].map((_, i) => (
              <circle key={`n-${i}`} cx={100 + (i % 3) * 100} cy={100 + Math.floor(i / 3) * 100}
                r="3" fill="#0066FF" opacity="0.6" className="animate-pulse-glow"
                style={{ animationDelay: `${i * 0.28}s` }} />
            ))}
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <div className="hero-eyebrow mb-6">
            <span className="eyebrow">
              <span className="w-1.5 h-1.5 bg-ag-blue rounded-full animate-pulse" />
              AGENCIA DIGITAL · CHILE · 95% IA
            </span>
          </div>

          {/* Headline — LCP element: siempre visible, solo anima en Y */}
          <h1 className="hero-headline lcp-element font-display text-4xl sm:text-5xl lg:text-display-1 mb-8 leading-[1.08]">
            <span className="block text-white">Tu negocio merece</span>
            <span className="block gradient-text">verse tan poderoso</span>
            <span className="block text-white">como realmente es.</span>
          </h1>

          {/* Subheadline */}
          <p className="hero-subheadline text-lg lg:text-xl text-ag-text-gray max-w-2xl mb-10 leading-relaxed">
            Identidad de marca, sitio web de alto rendimiento y automatizaciones
            construidas con IA — en 4 semanas, no en 6 meses.
          </p>

          {/* CTAs */}
          <div className="hero-ctas flex flex-col sm:flex-row gap-4 mb-12">
            <a href="#contact" className="btn-primary group" aria-label="Agendar diagnóstico gratuito desde la sección de inicio" onClick={() => trackCTAClick('Quiero mi Imperio Digital', 'Hero')}>
              <span>Quiero mi Imperio Digital</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#services" className="btn-ghost group" aria-label="Ver cómo funciona nuestro proceso" onClick={() => trackCTAClick('Ver cómo funciona', 'Hero')}>
              <Play className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Ver cómo funciona</span>
            </a>
          </div>

          {/* Social Proof */}
          <div className="hero-social-proof pt-8 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm text-ag-text-gray">
              {[
                { icon: '✦', text: '+30 PYMEs transformadas desde 2018' },
                { icon: '📍', text: 'Agencia 100% Remota' },
                { icon: '⚡', text: 'Respuesta en 24h' },
                { icon: '🤖', text: 'Operación 95% IA' },
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="text-ag-blue">{item.icon}</span>
                  <span>{item.text}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ag-bg-primary to-transparent pointer-events-none" />
    </section>
  );
}

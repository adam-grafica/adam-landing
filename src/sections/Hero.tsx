import { useEffect, useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set('.hero-eyebrow', { opacity: 0, y: 20 });
      gsap.set('.hero-headline span', { opacity: 0, y: 60, rotateX: -30 });
      gsap.set('.hero-subheadline', { opacity: 0, y: 30 });
      gsap.set('.hero-ctas', { opacity: 0, y: 20 });
      gsap.set('.hero-social-proof', { opacity: 0, y: 20 });
      gsap.set('.hero-mesh', { opacity: 0, scale: 0.8 });

      // Animation timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to('.hero-mesh', {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'expo.out',
      });

      tl.to('.hero-eyebrow', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'expo.out',
      }, '-=1');

      tl.to('.hero-headline span', {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'expo.out',
      }, '-=0.4');

      tl.to('.hero-subheadline', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.4');

      tl.to('.hero-ctas', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'expo.out',
      }, '-=0.3');

      tl.to('.hero-social-proof', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.2');

      // Mesh floating animation
      gsap.to('.hero-mesh', {
        y: -30,
        x: 20,
        rotation: 5,
        duration: 8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // Particle animation
      gsap.to('.particle', {
        y: '-=50',
        opacity: 0,
        duration: 3,
        stagger: {
          each: 0.5,
          repeat: -1,
        },
        ease: 'power1.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ag-bg-primary"
      aria-label="Hero Section"
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Animated Grid Lines */}
      <div className="absolute inset-0 grid-pattern-animated opacity-30" />

      {/* Animated Mesh/Orbe */}
      <div 
        ref={meshRef}
        className="hero-mesh absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-ag-blue/30 via-ag-blue-light/20 to-transparent rounded-full blur-[100px] animate-float" />
        <div 
          className="absolute inset-10 bg-gradient-to-tr from-ag-blue/20 to-ag-blue-light/10 rounded-full blur-[80px] breathe"
        />
        
        {/* Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-ag-blue rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
        
        {/* Mesh Lines SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 400" aria-hidden="true">
          <defs>
            <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0066FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00AAFF" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Animated connection lines */}
          <g filter="url(#glow)">
            {[...Array(8)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={50 + i * 40}
                x2="400"
                y2={50 + i * 40}
                stroke="url(#meshGradient)"
                strokeWidth="0.5"
                className="line-draw"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={50 + i * 40}
                y1="0"
                x2={50 + i * 40}
                y2="400"
                stroke="url(#meshGradient)"
                strokeWidth="0.5"
                className="line-draw"
                style={{ animationDelay: `${i * 0.1 + 0.5}s` }}
              />
            ))}
          </g>
          
          {/* Glowing nodes */}
          {[...Array(12)].map((_, i) => (
            <circle
              key={`node-${i}`}
              cx={80 + (i % 4) * 80}
              cy={80 + Math.floor(i / 4) * 80}
              r="4"
              fill="#0066FF"
              className="animate-pulse-glow"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32">
        <div className="max-w-3xl">
          {/* Eyebrow Tag - Futuristic */}
          <div className="hero-eyebrow mb-6">
            <span className="eyebrow">
              <span className="w-1.5 h-1.5 bg-ag-blue rounded-full animate-pulse" />
              AGENCIA DIGITAL · CHILE · 95% IA
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline font-display text-4xl sm:text-5xl lg:text-display-1 mb-8 leading-[1.1]">
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
            <a
              href="#contact"
              className="btn-primary group"
              aria-label="Agendar diagnóstico gratuito"
            >
              <span>Quiero mi Imperio Digital</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#process"
              className="btn-ghost group"
              aria-label="Ver cómo funciona nuestro proceso"
            >
              <Play className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Ver cómo funciona</span>
            </a>
          </div>

          {/* Social Proof Bar */}
          <div className="hero-social-proof pt-8 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm text-ag-text-gray">
              {[
                { icon: '✦', text: '+30 proyectos entregados' },
                { icon: '📍', text: 'Valparaíso, Chile' },
                { icon: '⚡', text: 'Respuesta en 24h' },
                { icon: '🤖', text: 'Operación 95% IA' },
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-2 group">
                  <span className="text-ag-blue transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                  <span>{item.text}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ag-bg-primary to-transparent pointer-events-none" />
    </section>
  );
}

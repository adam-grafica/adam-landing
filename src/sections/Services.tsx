import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight, Lock, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const packages = [
  {
    name: 'GÉNESIS',
    badge: 'Para empezar fuerte',
    badgeType: 'gray',
    price: '$400.000',
    features: [
      'Identidad visual completa',
      'Logo profesional + variantes',
      'Brand system básico (colores, tipografía, guía)',
      'Archivos editables entregados',
    ],
    time: '1–2 semanas',
    cta: 'Empezar con Génesis',
    ctaType: 'ghost-blue',
    highlighted: false,
  },
  {
    name: 'IMPERIO DIGITAL',
    badge: 'MÁS VENDIDO',
    badgeType: 'green',
    price: '$600.000',
    features: [
      'Todo lo de Génesis',
      'Website profesional de alto rendimiento',
      'Estrategia de contenido (3 meses de plan)',
      'Templates de contenido para RRSS',
      'Automatizaciones básicas (WhatsApp + formularios)',
      'Training para usar el sistema',
    ],
    time: '4–6 semanas',
    cta: 'Quiero mi Imperio Digital',
    ctaType: 'primary',
    highlighted: false,
  },
  {
    name: 'SISTEMA COMPLETO',
    badge: 'ENTERPRISE / PREMIUM',
    badgeType: 'premium',
    price: '$1.500.000',
    features: [
      'Todo lo de Imperio Digital',
      'Funnel de ventas completo',
      'CRM avanzado configurado',
      'Automatizaciones avanzadas con n8n/Make',
      'Integración con WhatsApp Business API',
      'Soporte/Optimización prioritaria',
      'Reportes de resultados detallados',
    ],
    time: '8–12 semanas',
    cta: 'Agendar consultoria estratégica',
    ctaType: 'primary',
    highlighted: true,
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.services-eyebrow', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'expo.out',
      });

      gsap.from('.services-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: 'expo.out',
      });

      gsap.from('.service-card', {
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 80%',
        },
        opacity: 0,
        y: 60,
        rotateX: -10,
        duration: 0.7,
        stagger: 0.15,
        ease: 'expo.out',
      });


    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 lg:py-32 bg-ag-bg-tertiary"
      aria-labelledby="services-title"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-ag-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-ag-blue-light/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="services-eyebrow eyebrow mb-4 inline-flex">
            <Sparkles className="w-3 h-3 text-ag-blue" />
            ELIGE TU NIVEL DE TRANSFORMACIÓN
          </span>
          <h2 id="services-title" className="services-title font-display text-display-3 lg:text-display-2 text-white">
            Construimos tu presencia digital completa.
            <br />
            <span className="text-ag-text-gray">No a pedazos — completa.</span>
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="services-grid grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`service-card relative rounded-3xl p-8 transition-all duration-500 overflow-hidden ${
                pkg.highlighted
                  ? 'bg-gradient-to-br from-ag-blue/15 via-ag-blue/5 to-transparent border-2 border-ag-blue scale-[1.03] shadow-[0_0_50px_rgba(0,102,255,0.3)] z-10'
                  : 'glass-card border border-white/5 shadow-none'
              }`}
            >
              {/* Shimmer for premium */}
              {pkg.highlighted && (
                <div className="absolute inset-0 shimmer-fast opacity-10 pointer-events-none" />
              )}
              {/* Recommended Badge for highlighted */}
              {pkg.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-ag-blue text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-ag-blue/50 tracking-widest uppercase">
                    <Sparkles className="w-3 h-3" />
                    RECOMENDADO ENTERPRISE
                  </span>
                </div>
              )}

              {/* Badge */}
              <div className="mb-6">
                {pkg.badgeType === 'green' && (
                  <span className="badge-green flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {pkg.badge}
                  </span>
                )}
                {pkg.badgeType === 'premium' && (
                  <span className="bg-ag-blue/20 text-ag-blue border border-ag-blue/30 text-[10px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 uppercase tracking-wider">
                    <Lock className="w-3 h-3" />
                    {pkg.badge}
                  </span>
                )}
                {pkg.badgeType === 'blue' && (
                  <span className="badge-blue">{pkg.badge}</span>
                )}
                {pkg.badgeType === 'gray' && (
                  <span className="badge-gray">{pkg.badge}</span>
                )}
              </div>

              {/* Name */}
              <h3 className="font-display text-2xl lg:text-3xl text-white mb-2">
                {pkg.name}
              </h3>

              {/* Price */}
              <p className="price-tag text-ag-blue text-lg font-medium mb-6">
                {pkg.price}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3 group">
                    <Check className="w-5 h-5 text-ag-green flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-ag-text-gray text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Time */}
              <p className="text-ag-text-muted text-sm mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-ag-blue rounded-full" />
                Tiempo: <span className="text-white">{pkg.time}</span>
              </p>

              {/* CTA */}
              {pkg.ctaType === 'primary' ? (
                <a
                  href="#contact"
                  className="w-full btn-primary group"
                >
                  <span>{pkg.cta}</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              ) : (
                <a
                  href="#contact"
                  className="w-full btn-ghost-blue"
                >
                  <span>{pkg.cta}</span>
                </a>
              )}

              {/* Limited spots tag */}
              {pkg.highlighted && (
                <p className="text-center text-ag-text-muted text-xs mt-4 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  Cupos limitados por mes
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

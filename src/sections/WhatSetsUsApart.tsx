import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, Palette, Shield, CheckCircle, Headphones, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: 1,
    title: 'ENTREGAMOS EN 4 SEMANAS, NO EN 6 MESES',
    description: 'Proceso probado, sin idas y vueltas infinitas. Tú apruebas, nosotros ejecutamos — con velocidad de startup y calidad de agencia premium.',
    icon: Rocket,
  },
  {
    id: 2,
    title: 'IA EN EL NÚCLEO DE TODO',
    description: 'Operamos 95% con IA — no como moda, como ventaja real. Producimos más rápido, con mejor calidad y a menor costo que una agencia tradicional.',
    icon: Sparkles,
  },
  {
    id: 3,
    title: 'NADA ES PLANTILLA',
    description: 'Cada identidad, cada web, cada automatización es construida desde cero para tu negocio. No compras una plantilla con tu nombre encima.',
    icon: Palette,
  },
  {
    id: 4,
    title: 'INFRAESTRUCTURA PROPIA EN ORACLE CLOUD',
    description: 'Tu web vive en servidores propios administrados por nosotros — no en hosting compartido. Velocidad, seguridad y control total.',
    icon: Shield,
  },
  {
    id: 5,
    title: 'UN SOCIO, NO UN PROVEEDOR',
    description: 'No desaparecemos al entregar. Te entrenamos para usar lo que construimos y te acompañamos en la evolución de tu negocio digital.',
    icon: CheckCircle,
  },
  {
    id: 6,
    title: 'COMUNICACIÓN REAL, SIN BUROCRACIA',
    description: 'Hablas directamente con quien hace el trabajo. Sin cuentas ejecutivas, sin tickets. Respuesta en menos de 24h, siempre.',
    icon: Headphones,
  },
];

export default function WhatSetsUsApart() {
  const [activeFeature, setActiveFeature] = useState(4);
  const sectionRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline animation
      gsap.from('.apart-headline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: 'expo.out',
      });

      // Badge
      gsap.from('.apart-badge', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        scale: 0,
        rotate: -10,
        opacity: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)',
      });

      // Description
      gsap.from('.apart-desc', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      });

      // CTA
      gsap.from('.apart-cta', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
        x: -30,
        opacity: 0,
        duration: 0.4,
        ease: 'expo.out',
      });

      // Icon container
      gsap.from(iconRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
      });

      // Feature items
      gsap.from('.feature-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
        x: 50,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'expo.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const ActiveIcon = features.find((f) => f.id === activeFeature)?.icon || Shield;

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #E6F2FF 0%, #FFFFFF 100%)',
        borderRadius: '40px 40px 0 0',
        marginTop: '-40px',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Icon & Header */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="apart-headline font-display text-display-2 md:text-[60px] text-black leading-none">
                  ¿QUÉ NOS
                  <br />
                  DIFERENCIA?
                </h2>
                <span className="apart-badge px-4 py-2 bg-black text-white text-sm font-medium rounded-full">
                  6 Razones
                </span>
              </div>
            </div>

            <p className="apart-desc text-lg text-black/70 max-w-md leading-relaxed">
              AdamGráfica es más que una agencia de diseño—somos un socio tecnológico
              comprometido con tu éxito a largo plazo. Con una plataforma galardonada y
              orientación experta, te ayudamos a lanzar más rápido, escalar más
              inteligentemente y mantenerte a la vanguardia.
            </p>

            <a
              href="#contact"
              className="apart-cta inline-flex items-center gap-2 px-6 py-3 border border-black/20 text-black rounded-full font-medium transition-all duration-300 hover:bg-black hover:text-white group"
            >
              <Sparkles className="w-4 h-4" />
              <span>Convierte tus ambiciones en realidad</span>
            </a>

            {/* Icon Display */}
            <div
              ref={iconRef}
              className="relative w-80 h-80 mx-auto lg:mx-0 mt-12"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-ag-blue to-ag-blue-light rounded-full opacity-20 blur-3xl" />
              <div className="relative w-full h-full bg-gradient-to-br from-ag-blue to-ag-blue-light rounded-3xl flex items-center justify-center transition-all duration-600 ease-expo-out">
                <ActiveIcon className="w-32 h-32 text-white transition-all duration-600" />
              </div>
            </div>
          </div>

          {/* Right Column - Feature List */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`feature-item group cursor-pointer transition-all duration-300 ${
                  activeFeature === feature.id
                    ? 'bg-gradient-to-r from-ag-blue/20 to-transparent border-l-[3px] border-ag-blue'
                    : 'hover:bg-black/5 border-l-[3px] border-transparent'
                } rounded-r-xl p-5`}
                onClick={() => setActiveFeature(feature.id)}
              >
                <div className="flex items-center justify-between">
                  <h4
                    className={`font-display text-lg transition-colors duration-300 ${
                      activeFeature === feature.id
                        ? 'text-ag-blue'
                        : 'text-black group-hover:text-ag-blue'
                    }`}
                  >
                    {feature.title}
                  </h4>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      activeFeature === feature.id
                        ? 'text-ag-blue'
                        : 'text-black/40'
                    }`}
                  >
                    ({String(index + 1).padStart(2, '0')})
                  </span>
                </div>

                {/* Description - Only show for active */}
                {activeFeature === feature.id && (
                  <p className="mt-3 text-black/60 text-sm leading-relaxed animate-slide-up">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

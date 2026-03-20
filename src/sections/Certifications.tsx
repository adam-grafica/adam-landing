import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const certifications = [
  {
    title: 'Google Partner Premier',
    subtitle: 'Certificación oficial',
    code: 'GOO-2026',
  },
  {
    title: 'Meta Business Partner',
    subtitle: 'Certificación oficial',
    code: 'META-2026',
  },
  {
    title: 'HubSpot Certified',
    subtitle: 'Partner autorizado',
    code: 'HUB-2026',
  },
  {
    title: 'ISO 27001:2022',
    subtitle: 'Seguridad informática',
    code: 'ISO-27001',
  },
  {
    title: 'AWS Partner',
    subtitle: 'Cloud solutions',
    code: 'AWS-2026',
  },
  {
    title: 'Shopify Partner',
    subtitle: 'E-commerce expert',
    code: 'SHO-2026',
  },
];

export default function Certifications() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline
      gsap.from('.cert-headline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
      });

      // Cards
      gsap.from('.cert-card', {
        scrollTrigger: {
          trigger: '.cert-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'expo.out',
      });

      // Floating animation for cards
      gsap.to('.cert-card', {
        y: -8,
        duration: 4,
        ease: 'sine.inOut',
        stagger: {
          each: 0.5,
          repeat: -1,
          yoyo: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h2 className="cert-headline font-display text-display-2 md:text-[60px] text-white leading-none mb-4">
            CERTIFICACIONES
          </h2>
          <p className="cert-headline text-white/50 text-lg">
            Confirmando la confiabilidad de nuestra plataforma
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="cert-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
          {certifications.map((cert, index) => (
            <div
              key={cert.title}
              className={`cert-card group relative preserve-3d transition-all duration-500 ease-expo-out hover:translate-z-[30px] ${
                index % 2 === 0
                  ? 'bg-gradient-to-br from-blue-pale/90 to-white/80'
                  : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20'
              } rounded-3xl p-8 overflow-hidden`}
              style={{
                transform: `rotateY(${index % 2 === 0 ? '-3' : '3'}deg)`,
              }}
            >
              {/* Barcode decoration */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-32 opacity-30">
                <div
                  className={`w-full h-full ${
                    index % 2 === 0 ? 'bg-black' : 'bg-white'
                  }`}
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      90deg,
                      transparent,
                      transparent 2px,
                      ${index % 2 === 0 ? '#000' : '#fff'} 2px,
                      ${index % 2 === 0 ? '#000' : '#fff'} 4px
                    )`,
                  }}
                />
              </div>

              {/* Hole punch */}
              <div
                className={`absolute top-6 left-6 w-3 h-3 rounded-full ${
                  index % 2 === 0 ? 'bg-black/20' : 'bg-white/20'
                }`}
              />

              {/* Content */}
              <div className="relative z-10">
                <p
                  className={`text-xs uppercase tracking-wider mb-2 ${
                    index % 2 === 0 ? 'text-black/50' : 'text-white/50'
                  }`}
                >
                  {cert.subtitle}
                </p>
                <h3
                  className={`font-display text-2xl mb-4 ${
                    index % 2 === 0 ? 'text-black' : 'text-white'
                  }`}
                >
                  {cert.title}
                </h3>
                <p
                  className={`text-sm font-mono ${
                    index % 2 === 0 ? 'text-black/40' : 'text-white/40'
                  }`}
                >
                  *{cert.code}
                </p>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-primary/20 to-cyan/20 rounded-3xl" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-white/50 mb-4">
            Elige AdamGráfica, donde tu visión se convierte en liderazgo de mercado
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium transition-all duration-300 hover:shadow-glow-lg hover:scale-105"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </section>
  );
}

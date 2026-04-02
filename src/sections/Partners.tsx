import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

gsap.registerPlugin(ScrollTrigger);

const partners = [
  { name: 'Google', col: 1, row: 1 },
  { name: 'Meta', col: 2, row: 1 },
  { name: 'Shopify', col: 3, row: 1 },
  { name: 'HubSpot', col: 4, row: 1 },
  { name: 'AWS', col: 5, row: 1 },
  { name: 'Adobe', col: 6, row: 1 },
  { name: 'Figma', col: 1, row: 2 },
  { name: 'Webflow', col: 2, row: 2 },
  { name: 'WordPress', col: 3, row: 2 },
  { name: 'Klaviyo', col: 4, row: 2 },
  { name: 'Mailchimp', col: 5, row: 2 },
  { name: 'Canva', col: 6, row: 2 },
];

export default function Partners() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline
      gsap.from('.partners-headline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          // @ts-ignore
          lazy: false,
        },
        x: -50,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
      });

      // Description
      gsap.from('.partners-desc', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
          // @ts-ignore
          lazy: false,
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      });

      // CTA
      gsap.from('.partners-cta', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
          // @ts-ignore
          lazy: false,
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)',
      });

      // Partner logos
      gsap.from('.partner-logo', {
        scrollTrigger: {
          trigger: '.partners-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          // @ts-ignore
          lazy: false,
        },
        scale: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'expo.out',
      });

      // Breathing animation for logos
      gsap.to('.partner-logo', {
        opacity: 0.6,
        duration: 2,
        ease: 'sine.inOut',
        stagger: {
          each: 0.2,
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
      {/* Background Gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-primary/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <h2 className="partners-headline font-display text-display-2 md:text-[60px] text-white leading-none">
              LÍDERES
              <br />
              <span className="text-gradient">TRABAJAN CON</span>
              <br />
              LÍDERES
            </h2>

            <p className="partners-desc text-lg text-white/80 leading-relaxed max-w-md">
              Nuestros partners vienen por tecnología flexible y se quedan por resultados
              probados. Trabajamos codo a codo con empresas líderes para resolver
              desafíos reales y avanzar rápido.
            </p>

            <a
              href="#contact"
              className="partners-cta inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-medium transition-all duration-300 hover:shadow-glow-lg hover:scale-105 group"
            >
              <span>Conviértete en partner</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
            </a>
          </div>

          {/* Right Column - Partners Grid */}
          <div className="partners-grid grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-4">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className="partner-logo aspect-square bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-blue-primary/50 hover:scale-105 cursor-pointer group"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <span className="font-display text-white/80 text-sm group-hover:text-white transition-colors">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee Text */}
      <div className="mt-20 overflow-hidden py-8 border-y border-white/10">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="mx-8 text-white/20 font-display text-2xl uppercase tracking-wider"
            >
              Nuestras alianzas se basan en confianza mutua y compromiso compartido con el éxito
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

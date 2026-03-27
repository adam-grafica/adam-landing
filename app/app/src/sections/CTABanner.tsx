import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CTABanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Banner reveal
      gsap.from('.cta-banner', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
      });

      // Player image
      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        x: -100,
        rotateY: 30,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
      });

      // Headline words
      gsap.from('.cta-headline span', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
        scale: 0.5,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'elastic.out(1, 0.5)',
      });

      // Subheadline
      gsap.from('.cta-subheadline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      });

      // CTA Button
      gsap.from('.cta-button', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 55%',
          toggleActions: 'play none none reverse',
        },
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
      });

      // Parallax on scroll
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        y: -30,
        rotateY: 5,
        ease: 'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="relative py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="cta-banner relative overflow-hidden rounded-[40px]"
          style={{
            background: 'linear-gradient(135deg, #0066FF 0%, #00D9FF 100%)',
          }}
        >
          <div className="grid lg:grid-cols-2 items-center">
            {/* CSS-based Glowing Orbe (Featherweight replacement for heavy image) */}
            <div ref={imageRef} className="relative perspective-1000 flex items-center justify-center py-10">
              <div className="relative w-64 h-64 lg:w-80 lg:h-80 preserve-3d">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-[60px] animate-pulse" />
                <div className="absolute inset-10 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ArrowRight className="w-20 h-20 text-white opacity-40 -rotate-45" />
                </div>
                {/* Floating particles */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-white/30 rounded-full blur-sm animate-float" />
                <div className="absolute bottom-10 left-0 w-6 h-6 bg-white/20 rounded-full blur-md animate-float-delayed" />
              </div>
            </div>

            {/* Content */}
            <div className="p-12 lg:p-16 text-center lg:text-left">
              <h2 className="cta-headline font-display text-display-2 md:text-[50px] text-white leading-none mb-6">
                <span className="inline-block">¿LISTO PARA</span>
                <br />
                <span className="inline-block">HABLAR DE</span>
                <br />
                <span className="inline-block">RESULTADOS?</span>
              </h2>

              <p className="cta-subheadline text-lg text-white/80 mb-8">
                Construyamos, escalemos y evolucionemos—juntos.
              </p>

              <a
                href="mailto:hola@adamgrafica.com"
                className="cta-button inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-primary rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 group"
              >
                <span>Contáctanos</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
              </a>
            </div>
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-10 left-1/2 w-32 h-32 bg-cyan/20 rounded-full blur-2xl" />
        </div>
      </div>
    </section>
  );
}

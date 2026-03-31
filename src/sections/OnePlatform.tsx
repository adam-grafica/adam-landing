import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function OnePlatform() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animations
      gsap.from('.platform-headline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          // @ts-ignore
          lazy: false,
        },
        x: -80,
        rotateY: -45,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'expo.out',
      });

      gsap.from('.platform-desc', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
          // @ts-ignore
          lazy: false,
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      });

      gsap.from('.platform-feature', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
          // @ts-ignore
          lazy: false,
        },
        x: -60,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: 'expo.out',
      });

      gsap.from('.platform-divider', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 55%',
          toggleActions: 'play none none reverse',
          // @ts-ignore
          lazy: false,
        },
        scaleX: 0,
        duration: 0.4,
        ease: 'expo.out',
      });

      // Car image animation
      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          // @ts-ignore
          lazy: false,
        },
        x: 200,
        rotateY: 30,
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
      });

      // Parallax effect on scroll
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          // @ts-ignore
          lazy: false,
        },
        y: -50,
        rotateY: 5,
        ease: 'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0066FF 0%, #00D9FF 100%)',
        clipPath: 'polygon(0 0, 100% 3%, 100% 97%, 0 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh]">
          {/* Content */}
          <div ref={contentRef} className="space-y-8">
            <h2 className="font-display text-display-2 md:text-[70px] text-white leading-none">
              <span className="platform-headline block">UNA AGENCIA.</span>
              <span className="platform-headline block">INFINITAS</span>
              <span className="platform-headline block">POSIBILIDADES.</span>
            </h2>

            <p className="platform-desc text-lg text-white/90 max-w-lg font-light leading-relaxed">
              AdamGráfica es el socio creativo detrás de las marcas más innovadoras.
              Combinamos diseño, tecnología y estrategia para crear experiencias que
              destacan.
            </p>

            <div className="space-y-6 pt-4">
              <div className="platform-feature">
                <p className="text-white/80 text-sm leading-relaxed">
                  ¿Lanzando una nueva marca? ¿Escalando tu presencia digital? Nuestra
                  tecnología se adapta a tus objetivos de negocio.{' '}
                  <span className="text-white font-medium">
                    Entregamos todo lo que necesitas para lanzar, operar y hacer crecer
                    tu negocio digital.
                  </span>
                </p>
              </div>

              <div className="platform-divider h-px bg-white/30 w-full origin-left" />

              <div className="platform-feature">
                <p className="text-white/80 text-sm leading-relaxed">
                  Nuestra plataforma integral potencia tu marca con soluciones de
                  branding, web, contenido y automatización.
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div
            ref={imageRef}
            className="relative perspective-1000"
          >
            <div className="relative preserve-3d">
              <img
                src="/sports-car.jpg"
                alt="Futuristic Sports Car"
                className="w-full h-auto rounded-3xl shadow-2xl"
                style={{
                  transform: 'rotateY(-5deg)',
                  boxShadow: '0 50px 100px rgba(0, 0, 0, 0.4)',
                }}
              />
              
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-primary/30 to-cyan/30 rounded-3xl blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Lock, Zap, MapPin, Cpu } from 'lucide-react';

const trustSignals = [
  { icon: Lock, text: 'Sin compromiso' },
  { icon: Zap, text: 'Respuesta en 24h' },
  { icon: MapPin, text: 'Agencia chilena' },
  { icon: Cpu, text: 'Potenciado por IA' },
];

export default function CTAFinal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'expo.out',
      });

      gsap.from('.cta-subtitle', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
      });

      gsap.from('.cta-button', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: 'back.out(1.7)',
      });

      gsap.from('.trust-signal', {
        scrollTrigger: {
          trigger: '.trust-signals',
          start: 'top 90%',
        },
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.1,
        ease: 'expo.out',
      });

      // Glow pulse animation
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.3,
          opacity: 0.2,
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 lg:py-32 bg-ag-bg-primary overflow-hidden"
      aria-labelledby="cta-title"
    >
      {/* Background Glow */}
      <div 
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-ag-blue/20 rounded-full blur-[150px] pointer-events-none" 
      />
      
      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-ag-blue rounded-full animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <h2 id="cta-title" className="cta-title font-display text-display-2 lg:text-display-1 text-white mb-6">
          Tu negocio puede
          <br />
          <span className="gradient-text">cambiar en 4 semanas.</span>
        </h2>
        
        {/* Subtitle */}
        <p className="cta-subtitle text-lg lg:text-xl text-ag-text-gray max-w-2xl mx-auto mb-10">
          Agenda una llamada gratuita hoy. Sin compromiso. Sin burocracia.
          Solo 30 minutos que pueden cambiar el rumbo de tu negocio.
        </p>
        
        {/* CTA Button */}
        <a
          href="mailto:hola@adamgrafica.cl?subject=Quiero%20agendar%20mi%20diagnóstico%20gratuito"
          className="cta-button inline-flex items-center gap-3 px-10 py-5 bg-ag-blue text-white text-lg font-medium rounded-full transition-colors duration-300 hover:shadow-glow-blue-lg hover:scale-105 group relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <span className="absolute inset-0 shimmer opacity-30" />
          <span className="relative z-10">Agendar mi diagnóstico gratuito</span>
          <ArrowRight className="relative z-10 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
        
        {/* Trust Signals */}
        <div className="trust-signals flex flex-wrap justify-center gap-6 mt-12">
          {trustSignals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <div
                key={index}
                className="trust-signal inline-flex items-center gap-2 text-ag-text-gray hover:text-white transition-colors"
              >
                <Icon className="w-4 h-4 text-ag-blue" />
                <span className="text-sm">{signal.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReveal } from '../hooks/useReveal';
import { ArrowRight, Calendar, Sparkles, Zap, ShieldCheck, Clock } from 'lucide-react';

const trustSignals = [
  { icon: ShieldCheck, text: 'Sin compromiso' },
  { icon: Clock,       text: '30 min diagnósitico' },
  { icon: Zap,         text: 'Respuesta en 24h' },
  { icon: Sparkles,    text: 'Potenciado por IA' },
];

export default function CTAFinal() {
  const [sectionRef] = useReveal<HTMLDivElement>();
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Very slow pulsating core for the energy orb
      if (pulseRef.current) {
        gsap.to(pulseRef.current, {
          scale: 1.15,
          opacity: 0.8,
          duration: 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 lg:py-40 bg-black overflow-hidden"
      aria-labelledby="cta-title"
    >
      {/* ── BACKGROUND DNA ── */}
      {/* Large logo watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden opacity-[0.03]">
        <img 
          src="/favicon.svg" 
          alt="" 
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rotate-[15deg] animate-float opacity-50" 
        />
        <img 
          src="/favicon.svg" 
          alt="" 
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rotate-[-12deg] animate-float opacity-40" 
          style={{ animationDelay: '-4s' }}
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* ── CENTRAL VISUAL — ENERGY ORB ── */}
      <div className="relative z-10 flex flex-col items-center mb-16 reveal-scale">
        <div className="relative w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center">
          {/* Outer glow rings */}
          <div className="absolute inset-0 bg-ag-blue/20 rounded-full blur-[60px] animate-pulse-glow" />
          <div className="absolute inset-4 bg-ag-blue/15 rounded-full blur-[40px] animate-float" />
          
          {/* The Orb Core */}
          <div 
            ref={pulseRef}
            className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-ag-blue to-ag-blue-light shadow-[0_0_30px_rgba(0,102,255,0.6)] flex items-center justify-center z-20"
          >
            <Calendar className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
          </div>

          {/* Orbiting particles */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-ag-blue-light rounded-full blur-[1px]"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: `${50 + (i + 1) * 20}px 0`,
                animation: `rotate ${6 + i * 2}s linear infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <h2 id="cta-title" className="font-display text-4xl sm:text-5xl lg:text-display-1 text-white mb-8 leading-tight reveal-up">
          ¿Listo para dominar
          <br />
          <span className="gradient-text italic">tu imperio digital?</span>
        </h2>
        
        {/* Subtitle */}
        <p className="text-lg lg:text-xl text-ag-text-gray max-w-2xl mx-auto mb-12 leading-relaxed reveal-up">
          Agenda hoy una sesión de diagnóstico gratuita de 30 minutos. 
          Te decimos exactamente qué necesita tu negocio para escalar — y cuánto cuesta. 
          <span className="block mt-2 font-medium text-white/40">Sin vueltas, sin burocracia.</span>
        </p>
        
        {/* CTA Button — Ultra Premium */}
        <div className="flex flex-col items-center gap-6 reveal-scale">
          <a
            href="mailto:hola@adamgrafica.online?subject=Quiero%20mi%20Diagnóstico%20Digital"
            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-ag-blue text-white text-xl font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ boxShadow: '0 20px 40px -10px rgba(0, 102, 255, 0.5)' }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-ag-blue via-ag-blue-light to-ag-blue bg-[length:200%_100%] transition-all duration-500 group-hover:bg-right" />
            
            <span className="relative z-10">Agendar Diagnóstico Gratuito</span>
            <ArrowRight className="relative z-10 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1.5" />
          </a>
          
          <div className="flex items-center gap-2 text-ag-blue/60 text-sm font-mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-ag-blue animate-pulse" />
            Cupos limitados por semana
          </div>
        </div>
        
        {/* Trust Signals */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-20 pt-12 border-t border-white/10 reveal-group">
          {trustSignals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-center gap-3 text-ag-text-gray/70 hover:text-ag-blue transition-colors reveal-child"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-ag-blue" />
                </div>
                <span className="text-sm font-medium whitespace-nowrap">{signal.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}} />
    </section>
  );
}

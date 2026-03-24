import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Search, FileText, Cpu, Zap } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Diagnóstico gratuito',
    description: '30 minutos de llamada. Entendemos tu negocio, tus objetivos y dónde estás parado hoy.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Propuesta en 48h',
    description: 'Te enviamos el plan exacto: qué vamos a construir, cómo, en cuánto tiempo y a qué precio.',
    icon: FileText,
  },
  {
    number: '03',
    title: 'Construcción con IA',
    description: 'Nuestros agentes trabajan en paralelo — diseño, web y contenido al mismo tiempo. Sin esperas.',
    icon: Cpu,
  },
  {
    number: '04',
    title: 'Entrega y activación',
    description: 'Tu sistema completo, funcional y listo para atraer clientes. Tú a vender, nosotros te dejamos todo andando.',
    icon: Zap,
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRefH = useRef<HTMLDivElement>(null);
  const lineRefV = useRef<HTMLDivElement>(null);
  const pulseRefH = useRef<HTMLDivElement>(null);
  const pulseRefV = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Desktop Animation (Horizontal Line Growth)
      if (lineRefH.current) {
        gsap.fromTo(lineRefH.current, 
          { scaleX: 0 }, 
          { 
            scaleX: 1, 
            ease: 'none',
            scrollTrigger: {
              trigger: '.process-steps',
              start: 'top 60%',
              end: 'bottom 80%',
              scrub: 1,
            }
          }
        );
      }

      // Desktop Looping Pulse (Horizontal)
      if (pulseRefH.current) {
        gsap.set(pulseRefH.current, { xPercent: -50, yPercent: -50 });
        gsap.fromTo(pulseRefH.current, 
          { left: '0%', opacity: 0 }, 
          { 
            left: '100%', 
            opacity: 1, 
            duration: 3, 
            repeat: -1, 
            ease: 'power1.inOut',
            repeatDelay: 0.5,
          }
        );
      }

      // Mobile Animation (Vertical Line Growth)
      if (lineRefV.current) {
        gsap.fromTo(lineRefV.current, 
          { scaleY: 0 }, 
          { 
            scaleY: 1, 
            ease: 'none',
            scrollTrigger: {
              trigger: '.process-steps',
              start: 'top 70%',
              end: 'bottom 90%',
              scrub: 1,
            }
          }
        );
      }

      // Mobile Looping Pulse (Vertical)
      if (pulseRefV.current) {
        gsap.set(pulseRefV.current, { xPercent: -50, yPercent: -50 });
        gsap.fromTo(pulseRefV.current, 
          { top: '0%', opacity: 0 }, 
          { 
            top: '100%', 
            opacity: 1, 
            duration: 3, 
            repeat: -1, 
            ease: 'power1.inOut',
            repeatDelay: 0.5,
          }
        );
      }

      // Step nodes pop-in
      gsap.from('.step-node', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        opacity: 0,
        scale: 0.8,
        stagger: 0.1,
        duration: 0.5,
        ease: 'back.out(1.7)',
      });

      // Cards slide-in
      gsap.from('.step-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'expo.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative py-24 lg:py-40 bg-ag-bg-primary overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-32">
          <span className="process-eyebrow eyebrow mb-6 inline-flex uppercase tracking-[0.3em] bg-ag-blue/10 border-ag-blue/20">
            <Zap className="w-4 h-4 text-ag-blue fill-ag-blue/20" />
            EL PROCESO
          </span>
          <h2 className="process-title font-display text-5xl lg:text-8xl text-white tracking-tighter">
            Así de simple es trabajar
            <br />
            <span className="text-ag-text-gray italic">con nosotros.</span>
          </h2>
        </div>

        {/* Journey Container */}
        <div className="process-steps relative">
          
          {/* DESKTOP PATH (Horizontal) */}
          <div className="hidden lg:block absolute top-[40px] left-[12.5%] right-[12.5%] h-1 bg-white/[0.03] rounded-full">
            {/* Background Path Line */}
            <div 
              ref={lineRefH}
              className="absolute inset-0 origin-left bg-ag-blue/40 shadow-[0_0_15px_rgba(0,102,255,0.3)]"
            />
            {/* Looping Light Ray H */}
            <div 
              ref={pulseRefH}
              className="absolute top-1/2 z-50 pointer-events-none"
              style={{ opacity: 0 }}
            >
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-ag-blue to-transparent shadow-[0_0_20px_#0066FF,0_0_40px_#00AAFF] rounded-full blur-[2px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[6px] shadow-[0_0_30px_#0066FF]" />
            </div>
          </div>

          {/* MOBILE PATH (Vertical) */}
          <div className="lg:hidden absolute top-[40px] bottom-[40px] left-[32px] w-1 bg-white/[0.03] rounded-full">
            {/* Background Path Line */}
            <div 
              ref={lineRefV}
              className="absolute inset-0 origin-top bg-ag-blue/40 shadow-[0_0_15px_rgba(0,102,255,0.3)]"
            />
            {/* Looping Light Ray V */}
            <div 
              ref={pulseRefV}
              className="absolute left-1/2 z-50 pointer-events-none"
              style={{ opacity: 0 }}
            >
              <div className="w-1 h-24 bg-gradient-to-b from-transparent via-ag-blue to-transparent shadow-[0_0_20px_#0066FF,0_0_40px_#00AAFF] rounded-full blur-[2px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[6px] shadow-[0_0_30px_#0066FF]" />
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="process-step group flex flex-col items-start lg:items-center">
                  
                  {/* Station Node - Minimalist circle */}
                  <div className="step-node relative z-20 mb-12 flex items-center justify-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-ag-bg-secondary border-2 border-ag-blue/20 flex items-center justify-center shadow-xl transition-all duration-500 group-hover:border-ag-blue/60 group-hover:shadow-[0_0_40px_rgba(0,102,255,0.4)] relative overflow-hidden">
                      <div className="absolute inset-0 bg-ag-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-ag-blue relative z-10" />
                    </div>
                    {/* Number Tag */}
                    <span className="absolute -top-1 -right-1 w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-ag-blue text-white flex items-center justify-center font-mono text-[10px] lg:text-xs font-black shadow-lg z-30 transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
                      {step.number}
                    </span>
                  </div>

                  {/* Card content */}
                  <div className="step-card glass-card p-8 lg:p-10 border border-white/5 transition-all duration-500 group-hover:border-ag-blue/20 bg-white/[0.02] ml-[56px] lg:ml-0 hover:bg-white/[0.04] shadow-2xl">
                    <h3 className="font-display text-2xl lg:text-3xl text-white mb-4 group-hover:text-ag-blue transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-ag-text-gray text-base lg:text-lg leading-relaxed opacity-80">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

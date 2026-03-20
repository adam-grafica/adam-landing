import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, FileText, Cpu, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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
    icon: Rocket,
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-eyebrow', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'expo.out',
      });

      gsap.from('.process-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: 'expo.out',
      });

      gsap.from('.process-step', {
        scrollTrigger: {
          trigger: '.process-steps',
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.15,
        ease: 'expo.out',
      });

      // Line draw animation
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: '.process-steps',
              start: 'top 70%',
            },
          }
        );
      }

      // Icon animations
      gsap.from('.step-icon', {
        scrollTrigger: {
          trigger: '.process-steps',
          start: 'top 70%',
        },
        scale: 0,
        rotation: -180,
        duration: 0.6,
        stagger: 0.2,
        ease: 'back.out(1.7)',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative py-24 lg:py-32 bg-ag-bg-primary"
      aria-labelledby="process-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="process-eyebrow eyebrow mb-4 inline-flex">
            <Rocket className="w-3 h-3 text-ag-blue" />
            EL PROCESO
          </span>
          <h2 id="process-title" className="process-title font-display text-display-3 lg:text-display-2 text-white">
            Así de simple es trabajar
            <br />
            <span className="text-ag-text-gray">con nosotros.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="process-steps relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 origin-left">
            <div 
              ref={lineRef}
              className="w-full h-full"
              style={{ 
                background: 'repeating-linear-gradient(90deg, #0066FF 0px, #0066FF 12px, transparent 12px, transparent 20px)',
              }} 
            />
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="process-step relative group">
                  {/* Step Number & Icon */}
                  <div className="relative z-10 mb-6 flex items-center gap-4">
                    <div className="step-icon w-14 h-14 rounded-2xl bg-ag-blue/10 border border-ag-blue/30 flex items-center justify-center group-hover:bg-ag-blue/20 group-hover:scale-110 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-ag-blue" />
                    </div>
                    <span className="font-mono text-3xl lg:text-4xl font-bold text-ag-blue/50">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="glass-card p-6 lg:p-8 group-hover:border-ag-blue/30 transition-colors">
                    <h3 className="font-display text-xl text-white mb-3 group-hover:text-ag-blue transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-ag-text-gray text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Arrow indicator (except last) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-16 text-ag-blue/30">
                      <Rocket className="w-6 h-6 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

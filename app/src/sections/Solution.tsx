import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Target, TrendingUp, Layers, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const bullets = [
  {
    icon: Zap,
    text: 'Entregamos en 4 semanas lo que otros hacen en 3 meses',
  },
  {
    icon: Target,
    text: 'Cada área tiene un agente experto — sin mediocridades',
  },
  {
    icon: TrendingUp,
    text: 'Operación lean = margen alto = precios que tienen sentido',
  },
  {
    icon: Layers,
    text: 'Escalamos de 3 a 10 proyectos simultáneos sin caos',
  },
];

export default function Solution() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.solution-eyebrow', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'expo.out',
      });

      gsap.from('.solution-headline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: 'expo.out',
      });

      gsap.from('.solution-paragraph', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: 'power2.out',
      });

      gsap.from('.solution-bullet', {
        scrollTrigger: {
          trigger: '.solution-bullets',
          start: 'top 80%',
        },
        opacity: 0,
        x: 30,
        duration: 0.5,
        stagger: 0.1,
        ease: 'expo.out',
      });

      // Icon pulse animation
      gsap.to('.bullet-icon', {
        scale: 1.1,
        duration: 1,
        stagger: {
          each: 0.3,
          repeat: -1,
          yoyo: true,
        },
        ease: 'sine.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 lg:py-32 bg-ag-bg-primary"
      aria-labelledby="solution-title"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-ag-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-ag-blue-light/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text */}
          <div>
            <span className="solution-eyebrow eyebrow mb-4 inline-flex">
              <Cpu className="w-3 h-3 text-ag-blue" />
              QUÉ ES ADAMGRÁFICA
            </span>
            
            <h2 id="solution-title" className="solution-headline font-display text-display-3 lg:text-display-2 text-white mb-6">
              La primera agencia digital
              <span className="gradient-text"> 95% operada por IA</span> en Chile.
            </h2>
            
            <p className="solution-paragraph text-lg text-ag-text-gray leading-relaxed">
              No somos una agencia tradicional con equipo grande, reuniones eternas
              y presupuestos inflados. Somos un sistema de agentes IA especializados,
              coordinados por Nash Adam, que trabajan en paralelo para entregar más
              rápido, mejor y con margen para ti.
            </p>
          </div>

          {/* Right Column - Bullets */}
          <div className="solution-bullets space-y-4">
            {bullets.map((bullet, index) => {
              const Icon = bullet.icon;
              return (
                <div
                  key={index}
                  className="solution-bullet flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] transition-colors duration-300 hover:bg-white/[0.05] hover:border-ag-blue/30 group"
                >
                  <div className="bullet-icon w-10 h-10 rounded-xl bg-ag-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-ag-blue/20 transition-colors">
                    <Icon className="w-5 h-5 text-ag-blue" />
                  </div>
                  <p className="text-white text-base leading-relaxed pt-1.5 group-hover:text-ag-text-gray transition-colors">
                    {bullet.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

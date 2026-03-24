import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { EyeOff, Monitor, TrendingDown } from 'lucide-react';

const painPoints = [
  {
    icon: EyeOff,
    title: 'Nadie te encuentra',
    description: 'Tienes un negocio real, pero en Google no existes. Tus competidores aparecen primero — aunque sean peores que tú.',
  },
  {
    icon: Monitor,
    title: 'Tu web no convierte',
    description: 'Tienes página web, pero no llegan clientes por ahí. Solo es un gasto mensual de hosting que no da retorno.',
  },
  {
    icon: TrendingDown,
    title: 'Te ven más pequeño de lo que eres',
    description: 'Tu imagen no transmite lo que realmente vales. Pierdes clientes antes de que te den la oportunidad de hablar.',
  },
];

export default function PainAgitation() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pain-eyebrow', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'expo.out',
      });

      gsap.from('.pain-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: 'expo.out',
      });

      gsap.from('.pain-card', {
        scrollTrigger: {
          trigger: '.pain-cards',
          start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        duration: 0.7,
        stagger: 0.15,
        ease: 'expo.out',
      });

      gsap.from('.pain-closing', {
        scrollTrigger: {
          trigger: '.pain-closing',
          start: 'top 90%',
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'expo.out',
      });

      // Icon animations
      gsap.to('.pain-icon', {
        scrollTrigger: {
          trigger: '.pain-cards',
          start: 'top 70%',
        },
        scale: 1,
        duration: 0.5,
        stagger: 0.2,
        ease: 'back.out(1.7)',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-ag-bg-secondary"
      aria-labelledby="pain-title"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="pain-eyebrow eyebrow mb-4 inline-flex">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            EL PROBLEMA
          </span>
          <h2 id="pain-title" className="pain-title font-display text-display-3 lg:text-display-2 text-white">
            ¿Te identificas con alguno de estos?
          </h2>
        </div>

        {/* Cards - Forced stretch alignment and hover illumination */}
        <div className="pain-cards grid md:grid-cols-3 gap-6 lg:gap-8 mb-16 items-stretch">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="pain-card glass-card p-8 lg:p-10 group border border-red-500/20 flex flex-col items-center text-center h-full transition-all duration-500 hover:border-red-500/40 hover:bg-red-500/[0.04] hover:shadow-[0_0_50px_rgba(220,38,38,0.15)] relative overflow-hidden"
              >
                {/* Subtle red background glow on hover */}
                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/[0.02] transition-colors duration-500 pointer-events-none" />

                {/* Icon with animation */}
                <div className="pain-icon w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600/20 to-red-500/10 border border-red-600/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-red-600/50 transition-all duration-300">
                  <Icon className="w-7 h-7 text-red-500" />
                </div>

                {/* Title */}
                <h3 className="font-display text-xl lg:text-2xl text-white mb-4 group-hover:text-red-500 transition-colors duration-300">
                  {point.title}
                </h3>

                {/* Description */}
                <p className="text-ag-text-gray leading-relaxed text-sm lg:text-base flex-grow">
                  {point.description}
                </p>
                
                {/* Decorative line */}
                <div className="mt-8 h-0.5 bg-gradient-to-r from-red-600 to-transparent w-0 group-hover:w-full transition-all duration-700 mx-auto" />
              </div>
            );
          })}
        </div>

        {/* Closing Line */}
        <div className="pain-closing text-center">
          <p className="font-display text-2xl lg:text-3xl text-white">
            Nosotros lo resolvemos.{' '}
            <span className="gradient-text font-bold">Completamente.</span>{' '}
            <span className="text-ag-blue">En 4 semanas.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

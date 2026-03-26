import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mainStats = [
  { value: 30, suffix: '+', label: 'Proyectos entregados' },
  { value: 8, suffix: ' años', label: 'De experiencia real' },
  { value: 4, suffix: ' sem', label: 'Tiempo promedio entrega' },
  { value: 95, suffix: '%', label: 'Operación potenciada con IA' },
];

function AnimatedCounter({
  value,
  suffix,
  isVisible,
}: {
  value: number;
  suffix: string;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = value > 1000 ? 2500 : 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(value * eased);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isVisible]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M';
    if (num >= 1000) return num.toLocaleString();
    return num.toString();
  };

  return (
    <span className="tabular-nums">
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stats-headline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
      });

      gsap.from('.stats-subheadline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        filter: 'blur(10px)',
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      });

      gsap.from('.main-stat', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
          onEnter: () => setIsVisible(true),
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'expo.out',
      });

      gsap.from('.mega-year', {
        scrollTrigger: {
          trigger: '.mega-year',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        scale: 0.5,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative py-32 bg-black overflow-hidden"
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 102, 255, 0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 102, 255, 0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20">
          <h2 className="stats-headline font-display text-display-2 md:text-[60px] text-white leading-none mb-6">
            RAZONES PARA
            <br />
            <span className="gradient-text">CREERNOS</span>
          </h2>
          <p className="stats-subheadline text-lg text-white/60 max-w-lg">
            Sin promesas infladas. Solo números reales de 8 años construyendo
            presencias digitales que funcionan.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {mainStats.map((stat) => (
            <div key={stat.label} className="main-stat text-center">
              <div className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-3 rounded-lg py-4">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                />
              </div>
              <div className="h-1 w-16 bg-gradient-to-r from-ag-blue to-ag-blue-light mx-auto mb-3 rounded-full" />
              <p className="text-white/60 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mega Year — founding story */}
        <div className="mega-year text-center py-12 border-y border-white/10">
          <div className="font-display text-7xl md:text-8xl lg:text-9xl text-white/10 mb-4 select-none">
            2018
          </div>
          <p className="text-white font-display text-2xl md:text-3xl -mt-16 relative z-10">
            El año que empezamos a{' '}
            <span className="gradient-text">construir imperios.</span>
          </p>
          <p className="text-white/40 text-sm mt-4 uppercase tracking-widest">
            Quilpué, Valparaíso · Chile
          </p>
        </div>
      </div>
    </section>
  );
}

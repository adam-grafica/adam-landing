import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useRevealGroup } from '../hooks/useRevealGroup';

const mainStats = [
  { value: 30,  suffix: '+',    label: 'Proyectos entregados' },
  { value: 8,   suffix: ' años',label: 'De experiencia real' },
  { value: 4,   suffix: ' sem', label: 'Tiempo promedio entrega' },
  { value: 95,  suffix: '%',    label: 'Operación potenciada con IA' },
];

function AnimatedCounter({ value, suffix, isVisible }: { value: number; suffix: string; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(value * eased));
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value, isVisible]);

  return <span className="tabular-nums">{count.toLocaleString()}{suffix}</span>;
}

export default function Stats() {
  const [sectionRef] = useReveal<HTMLDivElement>();
  const gridRef = useRevealGroup<HTMLDivElement>();
  const [isVisible, setIsVisible] = useState(false);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  // Single IntersectionObserver to trigger count animation
  useEffect(() => {
    const el = observerTargetRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative py-32 bg-black overflow-hidden"
    >
      {/* Static grid bg */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,102,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,102,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20 reveal-up">
          <h2 className="font-display text-display-2 md:text-[60px] text-white leading-none mb-6">
            RAZONES PARA
            <br />
            <span className="gradient-text">CREERNOS</span>
          </h2>
          <p className="text-lg text-white/55 max-w-lg">
            Sin promesas infladas. Solo números reales de 8 años construyendo
            presencias digitales que funcionan.
          </p>
        </div>

        {/* Stats Grid */}
        <div ref={(el) => { (gridRef as any).current = el; (observerTargetRef as any).current = el; }} className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 reveal-group">
          {mainStats.map((stat) => (
            <div key={stat.label} className="main-stat text-center reveal-child">
              <div className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-3 py-4">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
              </div>
              <div className="h-1 w-14 bg-gradient-to-r from-ag-blue to-ag-blue-light mx-auto mb-3 rounded-full" />
              <p className="text-white/55 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mega Year */}
        <div className="text-center py-12 border-y border-white/10 reveal-up">
          <div className="font-display text-7xl md:text-8xl lg:text-9xl text-white/[0.07] mb-4 select-none">
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

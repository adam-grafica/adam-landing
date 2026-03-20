import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, X, Cpu, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const comparisonData = [
  {
    feature: 'Tiempo de entrega',
    traditional: '3–6 meses',
    adamgrafica: '4 semanas',
  },
  {
    feature: 'Equipo',
    traditional: '5–10 personas',
    adamgrafica: 'Agentes IA especializados',
  },
  {
    feature: 'Comunicación',
    traditional: 'Lenta, burocrática',
    adamgrafica: 'Directa, diaria',
  },
  {
    feature: 'Costo',
    traditional: 'Alto, impredecible',
    adamgrafica: 'Competitivo, fijo',
  },
  {
    feature: 'Escalabilidad',
    traditional: 'Limitada por headcount',
    adamgrafica: 'Ilimitada',
  },
  {
    feature: 'Disponibilidad',
    traditional: 'Horario de oficina',
    adamgrafica: '24/7',
  },
];

export default function Comparison() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.comparison-eyebrow', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'expo.out',
      });

      gsap.from('.comparison-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: 'expo.out',
      });

      gsap.from('.comparison-row', {
        scrollTrigger: {
          trigger: '.comparison-table',
          start: 'top 80%',
        },
        opacity: 0,
        x: -30,
        duration: 0.5,
        stagger: 0.08,
        ease: 'expo.out',
      });

      gsap.from('.comparison-visual', {
        scrollTrigger: {
          trigger: '.comparison-visual',
          start: 'top 80%',
        },
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'expo.out',
      });

      // Pulse animation for nodes
      gsap.to('.network-node', {
        scale: 1.2,
        duration: 1,
        stagger: {
          each: 0.2,
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
      className="relative py-24 lg:py-32 bg-ag-bg-primary"
      aria-labelledby="comparison-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="comparison-eyebrow eyebrow mb-4 inline-flex">
            <Zap className="w-3 h-3 text-ag-blue" />
            LA VENTAJA IA
          </span>
          <h2 id="comparison-title" className="comparison-title font-display text-display-3 lg:text-display-2 text-white">
            IA no es el futuro.
            <br />
            <span className="gradient-text">Es nuestra operación diaria.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Comparison Table */}
          <div className="comparison-table">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b border-white/10">
              <div className="text-ag-text-muted text-sm">Característica</div>
              <div className="text-ag-text-muted text-sm text-center">Agencia Tradicional</div>
              <div className="text-ag-blue text-sm text-center font-medium flex items-center justify-center gap-1">
                <Cpu className="w-4 h-4" />
                AdamGráfica IA
              </div>
            </div>

            {/* Table Rows */}
            <div className="space-y-2">
              {comparisonData.map((row, index) => (
                <div
                  key={index}
                  className="comparison-row grid grid-cols-3 gap-4 py-4 px-4 rounded-xl transition-colors duration-300 hover:bg-white/[0.03]"
                >
                  <div className="text-white text-sm font-medium flex items-center">
                    {row.feature}
                  </div>
                  <div className="text-ag-text-gray text-sm text-center flex items-center justify-center gap-2">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    {row.traditional}
                  </div>
                  <div className="text-ag-green text-sm text-center flex items-center justify-center gap-2 bg-ag-green/5 rounded-lg py-2">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    {row.adamgrafica}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual - Network of Nodes */}
          <div className="comparison-visual relative aspect-square max-w-md mx-auto">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-ag-blue/20 to-ag-blue-light/10 rounded-full blur-3xl animate-pulse" />
            
            {/* SVG Network */}
            <svg className="relative w-full h-full" viewBox="0 0 400 400" aria-hidden="true">
              <defs>
                <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0066FF" />
                  <stop offset="100%" stopColor="#00AAFF" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Connection Lines */}
              <g opacity="0.4" filter="url(#glow)">
                {/* Central node connections */}
                <line x1="200" y1="200" x2="100" y2="100" stroke="#0066FF" strokeWidth="1" className="line-draw" />
                <line x1="200" y1="200" x2="300" y2="100" stroke="#0066FF" strokeWidth="1" />
                <line x1="200" y1="200" x2="100" y2="300" stroke="#0066FF" strokeWidth="1" />
                <line x1="200" y1="200" x2="300" y2="300" stroke="#0066FF" strokeWidth="1" />
                <line x1="200" y1="200" x2="200" y2="80" stroke="#00AAFF" strokeWidth="1" />
                <line x1="200" y1="200" x2="200" y2="320" stroke="#00AAFF" strokeWidth="1" />
                <line x1="200" y1="200" x2="80" y2="200" stroke="#00AAFF" strokeWidth="1" />
                <line x1="200" y1="200" x2="320" y2="200" stroke="#00AAFF" strokeWidth="1" />
                
                {/* Outer connections */}
                <line x1="100" y1="100" x2="200" y2="80" stroke="#00AAFF" strokeWidth="0.5" opacity="0.5" />
                <line x1="300" y1="100" x2="200" y2="80" stroke="#00AAFF" strokeWidth="0.5" opacity="0.5" />
                <line x1="100" y1="300" x2="200" y2="320" stroke="#00AAFF" strokeWidth="0.5" opacity="0.5" />
                <line x1="300" y1="300" x2="200" y2="320" stroke="#00AAFF" strokeWidth="0.5" opacity="0.5" />
              </g>
              
              {/* Nodes */}
              {/* Central Node */}
              <circle cx="200" cy="200" r="24" fill="url(#nodeGradient)" filter="url(#glow)" className="network-node" />
              <circle cx="200" cy="200" r="36" fill="url(#nodeGradient)" opacity="0.2" className="animate-pulse" />
              
              {/* Outer Nodes */}
              <circle cx="100" cy="100" r="14" fill="#0066FF" opacity="0.9" className="network-node" />
              <circle cx="300" cy="100" r="14" fill="#0066FF" opacity="0.9" className="network-node" />
              <circle cx="100" cy="300" r="14" fill="#0066FF" opacity="0.9" className="network-node" />
              <circle cx="300" cy="300" r="14" fill="#0066FF" opacity="0.9" className="network-node" />
              <circle cx="200" cy="80" r="12" fill="#00AAFF" opacity="0.9" className="network-node" />
              <circle cx="200" cy="320" r="12" fill="#00AAFF" opacity="0.9" className="network-node" />
              <circle cx="80" cy="200" r="12" fill="#00AAFF" opacity="0.9" className="network-node" />
              <circle cx="320" cy="200" r="12" fill="#00AAFF" opacity="0.9" className="network-node" />
              
              {/* Small orbiting nodes */}
              <circle cx="150" cy="150" r="8" fill="#0066FF" opacity="0.7" className="network-node" />
              <circle cx="250" cy="150" r="8" fill="#0066FF" opacity="0.7" className="network-node" />
              <circle cx="150" cy="250" r="8" fill="#0066FF" opacity="0.7" className="network-node" />
              <circle cx="250" cy="250" r="8" fill="#0066FF" opacity="0.7" className="network-node" />
            </svg>
            
            {/* Label */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="font-mono text-xs text-ag-text-gray">
                Agentes IA trabajando en paralelo
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

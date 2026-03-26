import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useRevealGroup } from '../hooks/useRevealGroup';
import { Check, ArrowRight, Zap } from 'lucide-react';

const packages = [
  {
    id: 'genesis',
    name: 'GÉNESIS',
    tagline: 'Para empezar fuerte',
    prices: {
      CLP: { main: '400.000', installments: '200.000' },
      USD: { main: '450', installments: '225' },
    },
    features: [
      'Identidad visual completa',
      'Logo profesional + variantes',
      'Brand system básico (colores, tipografía, guía)',
      'Archivos editables entregados',
    ],
    time: '2 semanas',
    highlighted: false,
  },
  {
    id: 'imperio',
    name: 'IMPERIO DIGITAL',
    tagline: 'Uno de los más vendidos',
    prices: {
      CLP: { main: '600.000', installments: '300.000' },
      USD: { main: '650', installments: '325' },
    },
    features: [
      'Todo lo de Génesis',
      'Website profesional de alto rendimiento',
      'Estrategia de contenido (3 meses de plan)',
      'Templates de contenido para RRSS',
      'Automatizaciones básicas (WhatsApp + formularios)',
      'Training para usar el sistema',
    ],
    time: '4 semanas',
    highlighted: false,
    specialBorder: 'green',
  },
  {
    id: 'completo',
    name: 'SISTEMA COMPLETO',
    tagline: 'ENTERPRISE / PREMIUM',
    prices: {
      CLP: { main: '1.500.000', installments: '750.000' },
      USD: { main: '1.600', installments: '800' },
    },
    features: [
      'Todo lo de Imperio Digital',
      'Funnel de ventas completo',
      'CRM avanzado configurado',
      'Automatizaciones avanzadas con n8n/Make',
      'Integración con WhatsApp Business API',
      'Soporte/Optimización prioritaria',
      'Reportes de resultados detallados',
    ],
    time: '6 semanas',
    highlighted: true,
  },
];

export default function Services() {
  const [currency, setCurrency] = useState<'CLP' | 'USD'>('CLP');
  const [sectionRef] = useReveal<HTMLElement>();
  const gridRef = useRevealGroup<HTMLDivElement>();

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 lg:py-32 bg-ag-bg-tertiary"
      aria-labelledby="services-title"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-ag-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-ag-blue-light/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="services-eyebrow eyebrow mb-4 inline-flex reveal-fade">
            <Zap className="w-3 h-3 text-ag-blue" />
            ELIGE TU NIVEL DE TRANSFORMACIÓN
          </span>
          <h2 id="services-title" className="services-title font-display text-display-3 lg:text-display-2 text-white reveal-up">
            Construimos tu presencia digital completa.
            <br />
            <span className="text-ag-text-gray">No a pedazos — completa.</span>
          </h2>
        </div>

        {/* Pricing Switcher - Premium Pill Design simplified (no icons) */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center p-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
            {[
              { id: 'CLP', label: 'CLP' },
              { id: 'USD', label: 'USD' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setCurrency(option.id as any)}
                className={`px-10 py-2.5 rounded-full text-sm font-bold tracking-widest transition-all duration-500 ${currency === option.id
                  ? 'bg-ag-blue text-white shadow-glow-blue'
                  : 'text-ag-text-gray hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Grid */}
        <div ref={gridRef} className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch reveal-group">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`service-card relative rounded-[32px] p-8 lg:p-10 transition-all duration-700 flex flex-col reveal-child ${pkg.highlighted
                ? 'bg-white/[0.04] border-2 border-ag-blue shadow-none z-10'
                : pkg.specialBorder === 'green'
                  ? 'glass-card border border-green-500/30'
                  : 'glass-card border border-white/10'
              }`}
            >
              {/* Tagline Badge */}
              <div className="mb-4 relative z-10">
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${pkg.specialBorder === 'green'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-white/5 border-white/10 text-ag-text-gray'
                }`}>
                  {pkg.tagline}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-4xl lg:text-5xl text-white mb-4 tracking-tighter leading-none">
                {pkg.name}
              </h3>

              {/* Price Section */}
              <div className="mb-8 relative z-10">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-ag-blue text-2xl font-light">$</span>
                  <span className="font-sans text-5xl lg:text-6xl font-normal text-ag-blue tracking-tighter transition-all duration-500">
                    {pkg.prices[currency].main}
                  </span>
                  {currency === 'USD' && <span className="text-ag-blue/60 text-sm font-bold ml-1">USD</span>}
                </div>
                {/* Installment Info */}
                <div className="mt-2 flex flex-col">
                  <span className="text-ag-text-muted text-sm font-medium">
                    2 cuotas de ${pkg.prices[currency].installments}
                  </span>
                  <span className="text-ag-text-muted/60 text-[10px] uppercase tracking-widest font-extrabold mt-0.5">
                    (PAGO ÚNICO)
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-10 flex-grow relative z-10">
                {pkg.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-4 group/item">
                    <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${pkg.highlighted ? 'bg-ag-blue/20 text-ag-blue' : 'bg-white/5 text-ag-text-gray group-hover/item:text-white'
                    }`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-ag-text-gray group-hover/item:text-white transition-colors duration-300 text-[14px] leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Delivery Time - Normal text, smaller */}
              <div className="flex items-center justify-center gap-3 mb-8 pt-6 relative z-10">
                <span className="text-white/60 font-normal text-xs">Tiempo de entrega:</span>
                <span className="text-white font-sans text-xs uppercase tracking-tight bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  {pkg.time}
                </span>
              </div>

              {/* CTA Button - Primary for highlighted, ghost for others */}
              <a
                href="#contact"
                className={`group/btn relative w-full py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 font-black tracking-widest uppercase text-xs overflow-hidden ${pkg.highlighted
                  ? 'bg-ag-blue text-white shadow-glow-blue hover:scale-[1.02] active:scale-95'
                  : 'bg-white/5 text-white border border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <span>{pkg.id === 'completo' ? 'Agendar Consultoría' : `Empezar con ${pkg.name.toLowerCase().split(' ')[0]}`}</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-500" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

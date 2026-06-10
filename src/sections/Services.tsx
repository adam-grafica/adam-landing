import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useRevealGroup } from '../hooks/useRevealGroup';
import Check from 'lucide-react/dist/esm/icons/check'
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right'
import Zap from 'lucide-react/dist/esm/icons/zap';
import { trackServiceView } from '../utils/analytics';

// 5 servicios oficiales - cada uno = 1 pipeline independiente
// Datos sincronizados desde Notion: ADAMGRÁFICA HQ - BRAND BIBLE 2026
const services = [
  {
    id: 'branding',
    name: 'Branding + Identidad',
    description: 'Logo, paleta de colores, tipografía y manual de marca. Identidad que comunica tu esencia.',
    price: '$250.000',
    time: '48-72 hrs',
    popular: false,
    features: [
      'Logo principal + variaciones',
      'Paleta de colores completa',
      'Sistema tipográfico',
      'Manual de marca PDF',
      'Assets para digital y print',
    ],
  },
  {
    id: 'smartweb',
    name: 'SmartWeb',
    description: 'Landing o sitio web de alto impacto. Diseño premium, código limpio, optimizado para conversión.',
    price: '$350.000',
    time: '5-7 días',
    popular: true,
    features: [
      'Diseño personalizado',
      'Responsive total',
      'SEO optimizado',
      'Formulario de contacto',
      'SSL y rendimiento >90',
    ],
  },
  {
    id: 'contenido',
    name: 'Contenido Redes',
    description: 'Posts, historias y reels que conectan. Contenido estratégico para cada plataforma.',
    price: '$300.000/mes',
    time: 'Semanal',
    popular: false,
    features: [
      '12 posts/mes',
      'Stories diarias',
      'Reels 2/mes',
      'Copywriting incluido',
      'Calendario editorial',
    ],
  },
  {
    id: 'agente',
    name: 'Agente Atención + Ventas',
    description: 'IA que atiende, califica y cierra leads por ti. Disponible 24/7, responde al instante.',
    price: '$400.000 + $150K/mes',
    time: '3-5 días setup',
    popular: false,
    features: [
      'Atención 24/7',
      'Calificación de leads',
      'Integración WhatsApp/Web',
      'CRM conectado',
      'Reportes semanales',
    ],
  },
  {
    id: 'empleado',
    name: 'Empleado IA',
    description: 'Tu mejor colaborador digital. Hace el trabajo de un equipo entero sin descanso.',
    price: '$600.000 + $200K/mes',
    time: '5-7 días setup',
    popular: false,
    features: [
      'Tareas personalizadas',
      'Integraciones completas',
      'Base de conocimiento',
      'Reportes avanzados',
      'Escalabilidad ilimitada',
    ],
  },
];

// 4 combos oficiales - cada uno es una mezcla de los 5 servicios
const combos = [
  {
    id: 'despegar',
    name: 'Despegar',
    services: 'Branding + SmartWeb',
    price: '$550.000',
    savings: 'Ahorras $50.000',
  },
  {
    id: 'crecer',
    name: 'Crecer',
    services: 'Branding + SmartWeb + Contenido',
    price: '$800.000',
    savings: 'Ahorras $100.000',
  },
  {
    id: 'dominar',
    name: 'Dominar',
    services: 'Branding + SmartWeb + Contenido + Agente',
    price: '$1.100.000',
    savings: 'Ahorras $200.000',
  },
  {
    id: 'imperio',
    name: 'Imperio Total',
    services: 'Los 5 servicios',
    price: '$1.900.000',
    savings: 'Ahorras $400.000',
    highlight: true,
  },
];

export default function Services() {
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
            5 SERVICIOS + 4 COMBOS
          </span>
          <h2 id="services-title" className="services-title font-display text-display-3 lg:text-display-2 text-white reveal-up">
            Construimos tu presencia digital completa.
            <br />
            <span className="text-ag-text-gray">No a pedazos — completa.</span>
          </h2>
        </div>

        {/* 5 Servicios Grid */}
        <div ref={gridRef} className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch reveal-group">
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-card relative rounded-[32px] p-8 lg:p-10 transition-all duration-700 flex flex-col reveal-child ${service.popular
                ? 'bg-white/[0.04] border-2 border-ag-blue shadow-none z-10'
                : 'glass-card border border-white/10'
                }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-ag-blue text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  Popular
                </div>
              )}

              {/* Title */}
              <h3 className="font-display text-2xl lg:text-3xl text-white mb-3 tracking-tighter leading-tight">
                {service.name}
              </h3>

              {/* Description */}
              <p className="text-ag-text-gray text-sm mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Price Section */}
              <div className="mb-6 relative z-10">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-ag-blue text-xl font-light">$</span>
                  <span className="font-sans text-3xl lg:text-4xl font-normal text-ag-blue tracking-tighter">
                    {service.price.replace('$', '')}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold">
                    Entrega:
                  </span>
                  <span className="text-white/80 text-xs font-medium">
                    {service.time}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-grow relative z-10">
                {service.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3 group/item">
                    <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300 ${service.popular ? 'bg-ag-blue/20 text-ag-blue' : 'bg-white/5 text-ag-text-gray group-hover/item:text-white'
                      }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-ag-text-gray group-hover/item:text-white transition-colors duration-300 text-[13px] leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href="#contact"
                data-open-modal="contact"
                onClick={() => trackServiceView(service.name)}
                className={`group/btn relative w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-500 font-bold uppercase text-xs overflow-hidden ${service.popular
                  ? 'bg-ag-blue text-white shadow-glow-blue hover:scale-[1.02] active:scale-95'
                  : 'bg-white/5 text-white border border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
              >
                <span>Solicitar</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          ))}
        </div>

        {/* Combos Section */}
        <div id="combos" className="mt-20 reveal-up">
          <div className="text-center mb-10">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              Combos Recomendados
            </span>
            <h3 className="font-display text-3xl lg:text-4xl text-white">
              Más servicios, menor inversión
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {combos.map((combo) => (
              <div
                key={combo.id}
                className={`relative rounded-2xl p-6 transition-all duration-500 ${combo.highlight
                  ? 'bg-gradient-to-br from-ag-blue/15 to-ag-blue-light/5 border-2 border-ag-blue'
                  : 'glass-card border border-white/10'
                  }`}
              >
                {combo.highlight && (
                  <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-ag-blue text-white text-[9px] font-black uppercase tracking-widest">
                    Recomendado
                  </div>
                )}
                <h4 className="font-display text-xl text-white mb-1">{combo.name}</h4>
                <p className="text-ag-text-gray text-xs mb-4">{combo.services}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-ag-blue text-lg">$</span>
                  <span className="font-sans text-2xl font-bold text-ag-blue">
                    {combo.price.replace('$', '')}
                  </span>
                </div>
                <p className="text-green-400 text-xs font-medium">{combo.savings}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

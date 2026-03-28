import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useRevealGroup } from '../hooks/useRevealGroup';
import { Rocket, Palette, Shield, CheckCircle, Headphones, Sparkles } from 'lucide-react';

const features = [
  {
    id: 1,
    title: 'ENTREGAMOS EN 4 SEMANAS, NO EN 6 MESES',
    description: 'Proceso probado, sin idas y vueltas infinitas. Tú apruebas, nosotros ejecutamos — con velocidad de startup y calidad de agencia premium.',
    icon: Rocket,
  },
  {
    id: 2,
    title: 'IA EN EL NÚCLEO DE TODO',
    description: 'Operamos 95% con IA — no como moda, como ventaja real. Producimos más rápido, con mejor calidad y a menor costo que una agencia tradicional.',
    icon: Sparkles,
  },
  {
    id: 3,
    title: 'NADA ES PLANTILLA',
    description: 'Cada identidad, cada web, cada automatización es construida desde cero para tu negocio. No compras una plantilla con tu nombre encima.',
    icon: Palette,
  },
  {
    id: 4,
    title: 'INFRAESTRUCTURA PROPIA EN ORACLE CLOUD',
    description: 'Tu web vive en servidores propios administrados por nosotros — no en hosting compartido. Velocidad, seguridad y control total.',
    icon: Shield,
  },
  {
    id: 5,
    title: 'UN SOCIO, NO UN PROVEEDOR',
    description: 'No desaparecemos al entregar. Te entrenamos para usar lo que construimos y te acompañamos en la evolución de tu negocio digital.',
    icon: CheckCircle,
  },
  {
    id: 6,
    title: 'COMUNICACIÓN REAL, SIN BUROCRACIA',
    description: 'Hablas directamente con quien hace el trabajo. Sin cuentas ejecutivas, sin tickets. Respuesta en menos de 24h, siempre.',
    icon: Headphones,
  },
];

export default function WhatSetsUsApart() {
  const [activeFeature, setActiveFeature] = useState(4);
  const [sectionRef] = useReveal<HTMLDivElement>();
  const listRef = useRevealGroup<HTMLDivElement>();

  const ActiveIcon = features.find((f) => f.id === activeFeature)?.icon || Shield;

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden reveal-fade"
      style={{
        background: 'linear-gradient(180deg, #E6F2FF 0%, #FFFFFF 100%)',
        borderRadius: '40px 40px 0 0',
        marginTop: '-40px',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="font-display text-display-2 md:text-[60px] text-black leading-none reveal-up">
                  ¿QUÉ NOS
                  <br />
                  DIFERENCIA?
                </h2>
                <span className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full reveal-scale">
                  6 Razones
                </span>
              </div>
            </div>

            <p className="text-lg text-black/70 max-w-md leading-relaxed reveal-up">
              AdamGráfica es más que una agencia de diseño—somos un socio tecnológico
              comprometido con tu éxito a largo plazo. Con una plataforma galardonada y
              orientación experta, te ayudamos a lanzar más rápido, escalar más
              inteligentemente y mantenerte a la vanguardia.
            </p>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-black/20 text-black rounded-full font-medium transition-all duration-300 hover:bg-black hover:text-white reveal-up"
            >
              <Sparkles className="w-4 h-4" />
              <span>Convierte tus ambiciones en realidad</span>
            </a>

            {/* Icon Display */}
            <div className="relative w-72 h-72 mx-auto lg:mx-0 mt-10 reveal-scale">
              <div className="absolute inset-0 bg-gradient-to-br from-ag-blue to-ag-blue-light rounded-full opacity-15 blur-3xl" />
              <div className="relative w-full h-full bg-gradient-to-br from-ag-blue to-ag-blue-light rounded-3xl flex items-center justify-center transition-all duration-500">
                <ActiveIcon className="w-28 h-28 text-white" />
              </div>
            </div>
          </div>

          {/* Right Column — Feature List */}
          <div ref={listRef} className="space-y-3 reveal-group">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`reveal-child group cursor-pointer transition-all duration-250 ${
                  activeFeature === feature.id
                    ? 'bg-gradient-to-r from-ag-blue/15 to-transparent border-l-[3px] border-ag-blue'
                    : 'hover:bg-black/5 border-l-[3px] border-transparent'
                } rounded-r-xl p-5`}
                onClick={() => setActiveFeature(feature.id)}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-display text-lg transition-colors duration-200 ${
                      activeFeature === feature.id
                        ? 'text-ag-blue'
                        : 'text-black group-hover:text-ag-blue'
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <span
                    className={`text-sm font-medium transition-colors duration-200 ${
                      activeFeature === feature.id ? 'text-ag-blue' : 'text-black/40'
                    }`}
                  >
                    ({String(index + 1).padStart(2, '0')})
                  </span>
                </div>

                {activeFeature === feature.id && (
                  <p className="mt-3 text-black/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

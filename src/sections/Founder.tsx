import { useEffect } from 'react';
import gsap from 'gsap';
import { useReveal } from '../hooks/useReveal';
import { Calendar, MapPin, Rocket, Cpu, User } from 'lucide-react';

const badges = [
  { icon: Calendar, text: 'Desde 2018' },
  { icon: MapPin, text: 'Valparaíso, Chile' },
  { icon: Rocket, text: '+30 proyectos' },
  { icon: Cpu, text: 'Pionero IA' },
];

export default function Founder() {
  const [sectionRef] = useReveal<HTMLDivElement>();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation for image
      gsap.to('.founder-image-inner', {
        y: -15,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-ag-bg-secondary"
      aria-labelledby="founder-title"
    >
      {/* Background elements */}
      <div className="absolute top-10 left-10 w-60 h-60 bg-ag-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-ag-blue-light/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Image */}
          <div className="founder-image relative reveal-left">
            <div className="founder-image-inner relative aspect-[3/4] max-w-md mx-auto rounded-3xl overflow-hidden">
              {/* Founder Photo */}
              <img 
                src="/nash-adam.jpg" 
                alt="Nash Adam - CEO AdamGráfica" 
                width="448"
                height="597"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-luminosity opacity-80 transition-all duration-700 hover:scale-105 hover:grayscale-0 hover:mix-blend-normal hover:opacity-100"
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-ag-bg-secondary via-transparent to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-br from-ag-blue/20 via-transparent to-transparent mix-blend-overlay" />
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-ag-blue/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-ag-blue-light/20 rounded-full blur-3xl pointer-events-none" />
              
              {/* Blue light effect */}
              <div className="absolute top-1/4 -right-4 w-2 h-48 bg-ag-blue blur-xl opacity-60 animate-pulse" />
              
              {/* Border glow */}
              <div className="absolute inset-0 rounded-3xl border border-ag-blue/20" />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="founder-content reveal-right">
            <span className="founder-eyebrow eyebrow mb-4 inline-flex reveal-fade">
              <User className="w-3 h-3 text-ag-blue" />
              EL FUNDADOR
            </span>
            
            <h2 id="founder-title" className="font-display text-display-4 lg:text-display-3 text-white mb-2">
              Nash Adam
            </h2>
            <p className="text-ag-text-gray text-lg mb-6">
              Fundador y CEO — AdamGráfica
            </p>
            
            <div className="space-y-4 mb-8">
              <p className="text-white text-lg leading-relaxed">
                Diseñador visionario y constructor de sistemas digitales.
                Desde 2018 ayudando a negocios y emprendedores a transformar
                cómo se ven, cómo comunican y cómo capturan clientes.
              </p>
              
              <p className="text-ag-text-gray leading-relaxed">
                No construyo proyectos. Construyo imperios. Cada cliente que trabaja
                conmigo recibe un sistema completo que funciona solo, no una web
                bonita que nadie visita. La diferencia está en la estrategia detrás.
              </p>
            </div>
            
            {/* Badges */}
            <div className="founder-badges flex flex-wrap gap-3">
              {badges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={index}
                    className="founder-badge inline-flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/10 rounded-full hover:border-ag-blue/30 hover:bg-ag-blue/5 transition-colors duration-300 reveal-up"
                  >
                    <Icon className="w-4 h-4 text-ag-blue" />
                    <span className="text-white text-sm">{badge.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

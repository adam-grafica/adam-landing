import { useReveal } from '../hooks/useReveal';
import { useRevealGroup } from '../hooks/useRevealGroup';
import Zap from 'lucide-react/dist/esm/icons/zap'
import Target from 'lucide-react/dist/esm/icons/target'
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up'
import Layers from 'lucide-react/dist/esm/icons/layers'
import Cpu from 'lucide-react/dist/esm/icons/cpu';

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
  const [sectionRef] = useReveal<HTMLDivElement>();
  const bulletsRef = useRevealGroup<HTMLDivElement>();

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
            <span className="solution-eyebrow eyebrow mb-4 inline-flex reveal-fade">
              <Cpu className="w-3 h-3 text-ag-blue" />
              QUÉ ES ADAMGRÁFICA
            </span>
            
            <h2 id="solution-title" className="solution-headline font-display text-display-3 lg:text-display-2 text-white mb-6 reveal-up">
              La primera agencia digital
              <span className="gradient-text"> 95% operada por IA</span> en Chile.
            </h2>
            
            <p className="solution-paragraph text-lg text-ag-text-gray leading-relaxed reveal-up">
              No somos una agencia tradicional con equipo grande, reuniones eternas
              y presupuestos inflados. Somos un sistema de agentes IA especializados,
              coordinados por Nash Adam, que trabajan en paralelo para entregar más
              rápido, mejor y con margen para ti.
            </p>
          </div>

          {/* Right Column - Bullets */}
          <div ref={bulletsRef} className="solution-bullets space-y-4 reveal-group">
            {bullets.map((bullet, index) => {
              const Icon = bullet.icon;
              return (
                <div
                  key={index}
                  className="solution-bullet flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] transition-colors duration-300 hover:bg-white/[0.05] hover:border-ag-blue/30 group reveal-child"
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

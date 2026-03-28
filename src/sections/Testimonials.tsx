import { useReveal } from '../hooks/useReveal';
import { useRevealGroup } from '../hooks/useRevealGroup';
import { Star, MessageCircle } from 'lucide-react';

const testimonials = [
  {
    name: 'Carolina M.',
    role: 'Artista y Emprendedora',
    location: 'Valparaíso',
    avatar: 'CM',
    quote: 'Antes no tenía identidad. Ahora tengo marca, web y contenido que me hacen ver profesional. Los clientes me buscan a mí.',
    result: 'Web lista en 3 semanas',
  },
  {
    name: 'Formativa OTEC',
    role: 'Academia de Capacitación',
    location: 'V Región',
    avatar: 'FO',
    quote: 'Necesitábamos una plataforma de cursos y nos entregaron algo que nunca esperábamos. Rápido, bien hecho y sin vueltas.',
    result: 'Plataforma operativa en 4 semanas',
  },
  {
    name: 'Clínica San Fernando',
    role: 'Salud y Estética',
    location: 'Quilpué',
    avatar: 'CS',
    quote: 'El rebranding cambió completamente cómo nos perciben. Ahora llenamos agenda. La imagen sí vende.',
    result: '+40% consultas desde el primer mes',
  },
];

const metrics = [
  { value: '30+', label: 'Proyectos' },
  { value: '100%', label: 'Tasa de entrega' },
  { value: '4 semanas', label: 'Tiempo promedio' },
  { value: '95%', label: 'Operación IA' },
];

export default function Testimonials() {
  const [sectionRef] = useReveal<HTMLDivElement>();
  const gridRef = useRevealGroup<HTMLDivElement>();
  const metricsRef = useRevealGroup<HTMLDivElement>();

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-ag-bg-secondary"
      aria-labelledby="testimonials-title"
    >
      {/* Decorative */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-ag-blue/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="testimonials-eyebrow eyebrow mb-4 inline-flex reveal-fade">
            <MessageCircle className="w-3 h-3 text-ag-blue" />
            LO QUE DICEN NUESTROS CLIENTES
          </span>
          <h2 id="testimonials-title" className="testimonials-title font-display text-display-3 lg:text-display-2 text-white reveal-up">
            Resultados reales.
            <br />
            <span className="text-ag-text-gray">Negocios reales.</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div ref={gridRef} className="testimonials-grid grid md:grid-cols-3 gap-6 lg:gap-8 mb-16 reveal-group">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card glass-card p-8 group hover:border-ag-blue/30 transition-colors duration-300 reveal-child"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="star-icon w-4 h-4 fill-ag-green text-ag-green" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white leading-relaxed mb-8 group-hover:text-ag-text-gray transition-colors">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ag-blue to-ag-blue-light flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="font-display text-white text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-white">{testimonial.name}</h3>
                  <p className="text-ag-text-gray text-sm">
                    {testimonial.role} — {testimonial.location}
                  </p>
                </div>
              </div>

              {/* Result Tag */}
              <div className="pt-4 border-t border-white/10">
                <span className="badge-green text-xs">
                  {testimonial.result}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics Bar */}
        <div ref={metricsRef} className="metrics-bar glass-card p-8 relative overflow-hidden reveal-group">
          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer opacity-30" />
          
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="metrics-item text-center reveal-child">
                <p className="font-display text-3xl lg:text-4xl text-white mb-1">
                  {metric.value}
                </p>
                <p className="text-ag-text-gray text-sm">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import Quote from 'lucide-react/dist/esm/icons/quote';
import type { RubroConfig } from '../../pages/brazos/types';

export default function RubroTestimonios({ brazo }: { brazo: RubroConfig }) {
  return (
    <section className="py-20 lg:py-28 bg-ag-bg-secondary">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-mono text-sm uppercase tracking-widest text-ag-text-muted mb-3">
            Resultados reales
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Lo que dicen los <span style={{ color: brazo.color.accent }}>dueños</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {brazo.testimonios.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-ag-bg-primary border border-white/10 hover:border-white/20 transition-all"
            >
              <Quote
                className="w-8 h-8 mb-4"
                style={{ color: brazo.color.accent }}
              />
              <p className="text-white leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div className="pt-4 border-t border-white/10">
                <p className="font-bold text-white">{t.nombre}</p>
                <p className="text-sm text-ag-text-gray">{t.cargo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

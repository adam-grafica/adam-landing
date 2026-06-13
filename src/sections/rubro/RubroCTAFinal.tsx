import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import type { RubroConfig } from '../../pages/brazos/types';

export default function RubroCTAFinal({ brazo }: { brazo: RubroConfig }) {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${brazo.color.primary}30 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          ¿Listo para que tu local se vea como{' '}
          <span
            style={{
              background: `linear-gradient(135deg, ${brazo.color.primary} 0%, ${brazo.color.accent} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            una cadena?
          </span>
        </h2>
        <p className="text-lg lg:text-xl text-ag-text-gray mb-10 max-w-2xl mx-auto">
          Escríbenos por WhatsApp. En 2 horas tienes tu pack completo.
        </p>

        <a
          href={brazo.ctaWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg text-white transition-all hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${brazo.color.primary} 0%, ${brazo.color.accent} 100%)`,
            boxShadow: `0 0 50px ${brazo.color.primary}99`,
          }}
        >
          Quiero mi Pack {brazo.nombre} →
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>

        <p className="text-sm text-ag-text-muted mt-6 font-mono">
          ⚡ Entrega en 2 horas · 💰 {brazo.ofertaPrincipal.precio} · 🎯 {brazo.ofertaPrincipal.incluye.length} piezas
        </p>
      </div>
    </section>
  );
}

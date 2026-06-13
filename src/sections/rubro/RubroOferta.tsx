import Check from 'lucide-react/dist/esm/icons/check';
import type { RubroConfig } from '../../pages/brazos/types';

export default function RubroOferta({ brazo }: { brazo: RubroConfig }) {
  const oferta = brazo.ofertaPrincipal;

  return (
    <section id="oferta" className="py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="font-mono text-sm uppercase tracking-widest text-ag-text-muted mb-3">
            Oferta de lanzamiento
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {oferta.titulo}
          </h2>
        </div>

        <div
          className="relative rounded-3xl p-8 lg:p-12 border-2"
          style={{
            background: `linear-gradient(135deg, ${brazo.color.primary}10 0%, ${brazo.color.accent}10 100%)`,
            borderColor: `${brazo.color.primary}40`,
          }}
        >
          {/* Promo badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <div
              className="px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest text-black font-bold"
              style={{
                background: `linear-gradient(135deg, ${brazo.color.primary} 0%, ${brazo.color.accent} 100%)`,
              }}
            >
              🔥 Promo Lanzamiento
            </div>
          </div>

          {/* Precio */}
          <div className="text-center mb-8 mt-4">
            {oferta.precioOriginal && (
              <div className="text-2xl text-ag-text-muted line-through mb-2">
                {oferta.precioOriginal}
              </div>
            )}
            <div
              className="font-display text-6xl lg:text-7xl font-bold mb-2"
              style={{
                background: `linear-gradient(135deg, ${brazo.color.primary} 0%, ${brazo.color.accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {oferta.precio}
            </div>
            <p className="text-ag-text-gray font-mono text-sm uppercase tracking-widest">
              {oferta.tiempo}
            </p>
          </div>

          {/* Incluye */}
          <div className="space-y-3 mb-8">
            {oferta.incluye.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-black/30"
              >
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: brazo.color.primary }}
                >
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-white">{item}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href={brazo.ctaWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-8 py-5 rounded-full font-bold text-lg text-white transition-all hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, ${brazo.color.primary} 0%, ${brazo.color.accent} 100%)`,
              boxShadow: `0 0 40px ${brazo.color.primary}80`,
            }}
          >
            Quiero este pack →
          </a>

          <p className="text-center text-ag-text-muted text-sm mt-4">
            Sin reuniones · Sin contratos largos · Sin letra chica
          </p>
        </div>
      </div>
    </section>
  );
}

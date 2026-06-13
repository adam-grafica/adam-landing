import type { RubroConfig } from '../../pages/brazos/types';

export default function RubroBeforeAfter({ brazo }: { brazo: RubroConfig }) {
  return (
    <section className="py-20 lg:py-28 bg-ag-bg-secondary">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-mono text-sm uppercase tracking-widest text-ag-text-muted mb-3">
            Mira la diferencia
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Mismo plato. Mismo local.{' '}
            <span style={{ color: brazo.color.accent }}>Más pedidos.</span>
          </h2>
          <p className="text-lg text-ag-text-gray max-w-2xl mx-auto">
            Esto es lo que cambia cuando tu comida se ve profesional.
          </p>
        </div>

        <div className="grid gap-8">
          {brazo.ejemplos.map((ej, i) => (
            <div
              key={i}
              className="rounded-3xl overflow-hidden border border-white/10 bg-ag-bg-primary"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* ANTES */}
                <div className="relative aspect-square md:aspect-auto">
                  <img
                    src={ej.antes}
                    alt={`${ej.nombre} - antes`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/20">
                    <span className="font-mono text-xs uppercase tracking-widest text-white">
                      Antes
                    </span>
                  </div>
                </div>

                {/* DESPUÉS */}
                <div className="relative aspect-square md:aspect-auto">
                  <img
                    src={ej.despues}
                    alt={`${ej.nombre} - después`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-sm border"
                    style={{
                      background: `${brazo.color.primary}cc`,
                      borderColor: brazo.color.accent,
                    }}
                  >
                    <span className="font-mono text-xs uppercase tracking-widest text-white font-bold">
                      Después
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 text-center">
                <h3 className="font-display text-xl font-bold text-white">{ej.nombre}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

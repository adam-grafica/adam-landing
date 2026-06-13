import type { RubroConfig } from '../../pages/brazos/types';

export default function RubroSolution({ brazo }: { brazo: RubroConfig }) {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-mono text-sm uppercase tracking-widest text-ag-text-muted mb-3">
            La solución completa
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Recibes todo esto <span className="text-ag-green">en 2 horas</span>
          </h2>
          <p className="text-lg text-ag-text-gray max-w-2xl mx-auto">
            Diseñado específicamente para {brazo.nombre.toLowerCase()}. Sin reuniones eternas, sin esperas.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {brazo.soluciones.map((sol, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl bg-ag-bg-secondary border border-white/10 hover:border-ag-green/40 transition-all hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{sol.emoji}</div>
              <h3 className="font-display text-xl font-bold mb-3 text-white">
                {sol.titulo}
              </h3>
              <p className="text-ag-text-gray leading-relaxed text-sm">
                {sol.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

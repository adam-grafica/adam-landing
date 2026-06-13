import XCircle from 'lucide-react/dist/esm/icons/x-circle';
import type { RubroConfig } from '../../pages/brazos/types';

export default function RubroPain({ brazo }: { brazo: RubroConfig }) {
  return (
    <section className="py-20 lg:py-28 bg-ag-bg-secondary">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-mono text-sm uppercase tracking-widest text-ag-text-muted mb-3">
            El problema real
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Esto es lo que <span className="text-red-400">te está pasando</span> como dueño de local
          </h2>
        </div>

        <div className="grid gap-4">
          {brazo.painPoints.map((pain, i) => (
            <div
              key={i}
              className="group flex items-start gap-4 p-6 rounded-2xl bg-red-500/5 border border-red-500/20 hover:border-red-500/40 transition-all"
            >
              <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-lg text-ag-text-white leading-relaxed">{pain}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

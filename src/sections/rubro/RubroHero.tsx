import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import type { RubroConfig } from '../../pages/brazos/types';

export default function RubroHero({ brazo }: { brazo: RubroConfig }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${brazo.color.primary}26 0%, transparent 60%)`,
        }}
      />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="text-2xl">{brazo.emoji}</span>
          <span className="text-sm font-mono text-ag-text-gray">{brazo.tagline}</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] mb-6">
          {brazo.heroHeadline.map((line, i) => (
            <span
              key={i}
              className="block"
              style={
                i === 1
                  ? {
                      background: `linear-gradient(135deg, ${brazo.color.primary} 0%, ${brazo.color.accent} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }
                  : undefined
              }
            >
              {line}
            </span>
          ))}
        </h1>

        <p className="text-lg lg:text-xl text-ag-text-gray max-w-3xl mx-auto mb-10 leading-relaxed">
          {brazo.heroSubheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={brazo.ctaWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${brazo.color.primary} 0%, ${brazo.color.accent} 100%)`,
              boxShadow: `0 0 30px ${brazo.color.primary}80`,
            }}
          >
            {brazo.ctaLabel}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#oferta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white border border-white/20 hover:bg-white/5 transition-all"
          >
            Ver Pack Enganche
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/10">
          {brazo.stats.map((s, i) => (
            <div key={i} className="text-center">
              <div
                className="font-display text-3xl lg:text-4xl font-bold mb-1"
                style={{
                  background: `linear-gradient(135deg, ${brazo.color.primary} 0%, ${brazo.color.accent} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.numero}
              </div>
              <div className="text-sm text-ag-text-gray font-mono uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import { brazosList } from './brazos';

export default function BrazoIndex() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ag-bg-primary">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-mono text-sm uppercase tracking-widest text-ag-text-muted mb-3">
              ADAM GRÁFICA · Brazos
            </p>
            <h1 className="font-display text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Soluciones por{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #0066FF 0%, #00AAFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                rubro
              </span>
            </h1>
            <p className="text-lg text-ag-text-gray max-w-2xl mx-auto">
              Packs especializados para cada tipo de negocio. Elige el tuyo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brazosList.map((brazo) => (
              <Link
                key={brazo.slug}
                to={`/brazo/${brazo.slug}`}
                className="group block p-8 rounded-2xl bg-ag-bg-secondary border border-white/10 hover:border-white/30 transition-all hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{brazo.emoji}</div>
                <h2 className="font-display text-2xl font-bold mb-3 text-white">
                  {brazo.nombre}
                </h2>
                <p className="text-ag-text-gray leading-relaxed mb-6">
                  {brazo.descripcionCorta}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="font-mono text-sm text-ag-text-muted">
                    {brazo.tagline}
                  </span>
                  <span
                    className="font-bold text-lg"
                    style={{
                      color: brazo.color.accent,
                    }}
                  >
                    {brazo.ofertaPrincipal.precio} →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {brazosList.length === 0 && (
            <div className="text-center py-20">
              <p className="text-ag-text-gray">Próximamente más brazos.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import { useReveal } from '../hooks/useReveal';
import { trackCTAClick } from '../utils/analytics';

export default function CTABanner() {
  const [sectionRef] = useReveal<HTMLDivElement>();

  return (
    <section ref={sectionRef} id="cta-banner-section" className="relative py-20 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[40px] shadow-[0_20px_50px_rgba(0,102,255,0.3)] reveal-up"
          style={{
            background: 'linear-gradient(135deg, #0066FF 0%, #00D9FF 100%)',
          }}
        >
          {/* Subtle logo watermark in background */}
          <img 
            src="/favicon.svg" 
            alt="" 
            loading="lazy"
            decoding="async"
            className="absolute top-[-20%] right-[-10%] w-[400px] opacity-10 rotate-[15deg] pointer-events-none" 
          />

          <div className="grid lg:grid-cols-2 items-center relative z-10">
            {/* Left Column: Branding Icon + Arrow */}
            <div className="relative flex items-center justify-center py-12 lg:py-20 group">
              <div className="relative w-48 h-48 lg:w-64 lg:h-64 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                {/* Outer Glows */}
                <div className="absolute inset-0 bg-white/20 rounded-full blur-[40px] animate-pulse" />
                <div className="absolute inset-4 bg-white/10 rounded-full blur-[20px] border border-white/20 backdrop-blur-sm" />
                
                {/* AdamGráfica Logo */}
                <img 
                  src="/favicon.svg" 
                  alt="AdamGráfica Logo" 
                  loading="lazy"
                  decoding="async"
                  className="relative z-10 w-24 h-24 lg:w-32 lg:h-32 object-contain drop-shadow-2xl"
                />

                {/* The Arrow pointing towards agendar (Right/CTA) */}
                <div className="absolute right-[-20%] lg:right-[-10%] top-1/2 -translate-y-1/2 animate-bounce-horizontal">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <ArrowRight className="w-6 h-6 lg:w-8 lg:h-8 text-ag-blue" />
                  </div>
                </div>

                {/* Decorative floating dots */}
                <div className="absolute top-0 right-4 w-3 h-3 bg-white/40 rounded-full blur-[2px] animate-float" />
                <div className="absolute bottom-4 left-0 w-2 h-2 bg-white/30 rounded-full blur-[1px] animate-float-delayed" />
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="p-10 lg:p-16 text-center lg:text-left">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
                Si llegaste hasta aquí,
                <br />
                <span className="text-white/80">ya sabes que lo necesitas.</span>
              </h2>

              <p className="text-lg text-white/90 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Agenda una sesión de diagnóstico gratuita de 30 min. Te decimos exactamente qué necesita tu negocio — y cuánto cuesta.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start">
                <a
                  href="#contact"
                  data-open-modal="contact"
                  onClick={() => trackCTAClick('Agendar diagnóstico gratuito', 'CTA Banner')}
                  aria-label="Agendar diagnóstico gratuito desde el banner de acción"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-ag-blue rounded-full font-bold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:-translate-y-1 active:scale-95"
                >
                  <span>Agendar diagnóstico gratuito</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

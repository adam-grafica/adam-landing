import { useState, useEffect } from 'react';
import { Briefcase, Zap, Folder, Users, MessageSquare } from 'lucide-react';

const navLinks = [
  { label: 'Servicios', href: '#services', icon: Briefcase },
  { label: 'Proceso',   href: '#process',  icon: Zap },
  { label: 'Portfolio', href: '#portfolio', icon: Folder },
  { label: 'Nosotros',  href: '#about',    icon: Users },
];

/* ─────────────────────────────────────────────
   Inline styles — override any Tailwind class
───────────────────────────────────────────── */
const NAV_STYLE: React.CSSProperties = {
  /* Semi-transparent so backdrop-filter blur is visible */
  background: 'rgba(8, 8, 14, 0.55)',
  backdropFilter: 'blur(24px) saturate(200%)',
  WebkitBackdropFilter: 'blur(24px) saturate(200%)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
};

const OVERLAY_STYLE: React.CSSProperties = {
  zIndex: 55,
  background: 'rgba(6, 6, 10, 0.90)',
  backdropFilter: 'blur(32px) saturate(160%)',
  WebkitBackdropFilter: 'blur(32px) saturate(160%)',
  willChange: 'opacity, transform',
};

const BURGER_STYLE: React.CSSProperties = {
  position: 'relative',
  zIndex: 70,
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.14)',
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* ── Lock body scroll while mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    /* Fixed / sticky — always visible at top on all devices */
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={NAV_STYLE}
    >
      {/* ── Bar content ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 60 }}>
        {/* Slim bar: h-12 mobile / h-14 desktop */}
        <div className="flex items-center justify-between h-12 lg:h-14">

          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 group shrink-0"
            aria-label="AdamGráfica — Inicio"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="favicon-shine-container">
              <img
                src="/favicon.svg"
                alt="AdamGráfica Logo"
                width="28"
                height="28"
                className="w-7 h-7 object-contain transition-transform duration-300 group-hover:scale-110 animate-favicon-glow"
              />
            </div>
            <span className="font-display text-sm lg:text-base font-bold text-white tracking-tight transition-colors duration-300 group-hover:text-ag-blue uppercase">
              ADAMGRÁFICA
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-sm text-ag-text-gray hover:text-white transition-colors duration-200 py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-ag-blue transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2 bg-ag-blue text-white text-sm font-medium rounded-full transition-all duration-300 hover:shadow-glow-blue hover:scale-105 group relative overflow-hidden"
            >
              <span className="relative z-10">Agendar llamada</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* Hamburger — z-70: always above overlay */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-white rounded-full transition-all duration-300 shrink-0 hover:bg-white/10"
            style={BURGER_STYLE}
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span className={`absolute h-[2px] w-5 bg-white rounded-full transition-all duration-400 ${isMobileMenuOpen ? 'rotate-45'       : '-translate-y-[6px]'}`} />
              <span className={`absolute h-[2px] w-5 bg-white rounded-full transition-all duration-400 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`} />
              <span className={`absolute h-[2px] w-5 bg-white rounded-full transition-all duration-400 ${isMobileMenuOpen ? '-rotate-45'      : 'translate-y-[6px]'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile full-screen overlay ── */}
      <div
        className={`lg:hidden fixed inset-0 h-[100dvh] w-full flex flex-col px-8 pb-10 transition-all duration-600 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-3'
        }`}
        style={OVERLAY_STYLE}
      >
        {/* Ambient blobs */}
        <div className={`absolute top-24 right-0 w-64 h-64 bg-ag-blue/25 rounded-full blur-[90px] pointer-events-none transition-opacity duration-1000 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none transition-opacity duration-1000 delay-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} />

        {/* Nav links — centered, no overflow clip */}
        <div className="relative z-10 flex flex-col justify-center flex-grow gap-6 mt-12">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="group block w-full"
            >
              <div
                className={`transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] ${
                  isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                }`}
                style={{ transitionDelay: `${isMobileMenuOpen ? 150 + index * 90 : 0}ms` }}
              >
                <div className="flex items-center gap-5 pl-2">
                  <span className="font-mono text-xs text-ag-blue/50 tracking-widest w-6 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {/* padding-left on hover avoids translateX overflow clip */}
                  <span className="font-display text-5xl text-white font-bold tracking-tighter leading-none transition-all duration-500 group-hover:text-ag-blue group-hover:pl-4">
                    {link.label}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer strip inside menu */}
        <div
          className={`relative z-10 flex flex-col gap-4 w-full transition-all duration-700 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? '550ms' : '0ms' }}
        >
          <div className="h-px w-full bg-gradient-to-r from-white/15 via-white/5 to-transparent" />
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-0.5">
              <span className="text-white/35 text-[10px] tracking-[0.2em] font-mono uppercase">Iniciar Proyecto</span>
              <a
                href="mailto:somos@adamgrafica.online"
                className="text-white text-base font-medium hover:text-ag-blue transition-colors"
              >
                somos@adamgrafica.online
              </a>
            </div>
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-ag-blue text-white shadow-[0_0_24px_rgba(0,102,255,0.45)] transition-all duration-400 hover:scale-110 active:scale-95"
              aria-label="Agendar llamada"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

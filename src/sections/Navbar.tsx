import { useState, useEffect } from 'react';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase'
import Zap from 'lucide-react/dist/esm/icons/zap'
import Folder from 'lucide-react/dist/esm/icons/folder'
import Users from 'lucide-react/dist/esm/icons/users'
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import { trackCTAClick } from '../utils/analytics';

const navLinks = [
  { label: 'Servicios', href: '#services', icon: Briefcase },
  { label: 'Proceso',   href: '#process',  icon: Zap },
  { label: 'Portfolio', href: '#portfolio', icon: Folder },
  { label: 'Nosotros',  href: '#about',    icon: Users },
];

const NAV_STYLE: React.CSSProperties = {
  background: 'rgba(8, 8, 14, 0.75)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
};

const BURGER_STYLE: React.CSSProperties = {
  position: 'relative',
  zIndex: 70,
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.14)',
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  /* Lock body scroll while menu is open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* ── NAV BAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={NAV_STYLE}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 60 }}>
          <div className="flex items-center justify-between h-12 lg:h-14">

            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 group shrink-0"
              aria-label="AdamGráfica — Inicio"
              onClick={close}
            >
              <div className="favicon-shine-container">
                <img
                  src="/favicon.svg?v=2"
                  alt="AdamGráfica Logo"
                  width="40"
                  height="40"
                  fetchPriority="high"
                  className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110 animate-favicon-glow"
                />
              </div>
              <span className="font-display text-sm lg:text-base font-bold text-white tracking-tight transition-colors duration-200 group-hover:text-ag-blue uppercase">
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
                data-open-modal="contact"
                onClick={() => trackCTAClick('Agendar llamada', 'Navbar Desktop')}
                aria-label="Agendar llamada - Navegación Principal"
                className="inline-flex items-center gap-2 px-5 py-2 bg-ag-blue text-white text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 group"
              >
                <span>Agendar llamada</span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>
            </div>

            {/* Hamburger */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white rounded-full transition-colors duration-200 shrink-0"
              style={BURGER_STYLE}
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <span className={`absolute h-[2px] w-5 bg-white rounded-full transition-all duration-300 ${open ? 'rotate-45' : '-translate-y-[6px]'}`} />
                <span className={`absolute h-[2px] w-5 bg-white rounded-full transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : 'opacity-100'}`} />
                <span className={`absolute h-[2px] w-5 bg-white rounded-full transition-all duration-300 ${open ? '-rotate-45' : 'translate-y-[6px]'}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE OVERLAY ── (Full Reset) */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* The Actual Blur Layer — Explicitly separated for better browser support */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'rgba(5, 5, 8, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        />

        {/* Floating background glows */}
        <div 
          className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-ag-blue/20 rounded-full blur-[100px] transition-transform duration-700" 
          style={{ transform: open ? 'scale(1)' : 'scale(0.5)' }} 
        />
        <div 
          className="absolute bottom-[-50px] left-[-50px] w-80 h-80 bg-ag-blue-light/10 rounded-full blur-[100px] transition-transform duration-700 delay-100" 
          style={{ transform: open ? 'scale(1)' : 'scale(0.5)' }} 
        />

        <div className="relative z-10 h-full w-full flex flex-col px-8 pb-10">
          {/* Navbar Spacer */}
          <div className="h-14" />

          {/* Nav Links Container */}
          <div className="flex-grow flex flex-col justify-center gap-2">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={close}
                className="group block py-2"
              >
                <div
                  className="transition-all duration-500"
                  style={{
                    transform: open ? 'translateY(0)' : 'translateY(40px)',
                    opacity: open ? 1 : 0,
                    transitionDelay: `${open ? 100 + index * 80 : 0}ms`,
                  }}
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-[10px] text-ag-blue/40 tracking-[0.2em] w-6 shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-5xl text-white font-bold tracking-tighter leading-none group-hover:text-ag-blue transition-colors">
                      {link.label}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Footer inside menu */}
          <div
            className="mt-auto transition-all duration-500"
            style={{
              transform: open ? 'translateY(0)' : 'translateY(20px)',
              opacity: open ? 1 : 0,
              transitionDelay: `${open ? 450 : 0}ms`,
            }}
          >
            <div className="h-px w-full bg-white/10 mb-6" />
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <span className="text-white/30 text-[9px] tracking-[0.2em] font-mono uppercase">Iniciar Proyecto</span>
                <a
                  href="mailto:somos@adamgrafica.online"
                  className="text-white text-base font-semibold hover:text-ag-blue transition-colors"
                >
                  somos@adamgrafica.online
                </a>
              </div>
              <a
                href="#contact"
                data-open-modal="contact"
                onClick={() => { close(); trackCTAClick('Agendar llamada', 'Navbar Mobile'); }}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-ag-blue text-white shadow-[0_0_20px_rgba(0,102,255,0.4)]"
                aria-label="Agendar llamada - Menú Móvil"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

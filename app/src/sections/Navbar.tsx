import { useState, useEffect } from 'react';
import { Briefcase, Zap, Folder, Users, MessageSquare } from 'lucide-react';

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

      {/* ── MOBILE FULL-SCREEN OVERLAY ── rendered outside nav so it covers everything */}
      <div
        className="lg:hidden fixed inset-0 z-40 flex flex-col px-8 pb-10"
        style={{
          /* Solid dark base ensures blur is always visible even if backdrop-filter unsupported */
          background: open ? 'rgba(3, 3, 7, 0.94)' : 'rgba(3, 3, 7, 0)',
          backdropFilter: open ? 'blur(30px) saturate(160%)' : 'blur(0px)',
          WebkitBackdropFilter: open ? 'blur(30px) saturate(160%)' : 'blur(0px)',
          /* Single transition for the whole container */
          transition: 'background 0.35s cubic-bezier(0.16,1,0.3,1), backdrop-filter 0.35s cubic-bezier(0.16,1,0.3,1)',
          /* Hide from pointer events when closed */
          pointerEvents: open ? 'auto' : 'none',
          /* Prevent any child clipping */
          overflow: 'hidden',
        }}
        aria-hidden={!open}
      >
        {/* Subtle ambient blue glow — top right */}
        <div
          className="absolute top-20 right-4 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,102,255,0.25) 0%, transparent 70%)',
            transform: open ? 'scale(1)' : 'scale(0.4)',
            opacity: open ? 1 : 0,
            transition: 'opacity 0.35s 0.1s, transform 0.4s 0.05s cubic-bezier(0.16,1,0.3,1)',
          }}
        />

        {/* Subtle ambient cyan glow — bottom left */}
        <div
          className="absolute bottom-8 -left-8 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,170,255,0.15) 0%, transparent 70%)',
            transform: open ? 'scale(1)' : 'scale(0.4)',
            opacity: open ? 1 : 0,
            transition: 'opacity 0.35s 0.15s, transform 0.4s 0.1s cubic-bezier(0.16,1,0.3,1)',
          }}
        />

        {/* Spacer for navbar height */}
        <div className="h-14" />

        {/* Nav Links */}
        <div className="relative z-10 flex flex-col justify-center flex-grow gap-2 mt-4">
          {navLinks.map((link, index) => {
            const delay = open ? 60 + index * 50 : 0;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={close}
                className="group block w-full py-4"
              >
                <div
                  style={{
                    transform: open ? 'translateY(0)' : 'translateY(30px)',
                    opacity: open ? 1 : 0,
                    transition: `transform 0.4s ${delay}ms cubic-bezier(0.16,1,0.3,1), opacity 0.3s ${delay}ms`,
                  }}
                >
                  <div className="flex items-center gap-5 pl-2">
                    <span className="font-mono text-xs text-ag-blue/50 tracking-widest w-6 shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-5xl text-white font-bold tracking-tighter leading-none transition-colors duration-200 group-hover:text-ag-blue">
                      {link.label}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer strip */}
        <div
          className="relative z-10 flex flex-col gap-4 w-full"
          style={{
            transform: open ? 'translateY(0)' : 'translateY(20px)',
            opacity: open ? 1 : 0,
            transition: `transform 0.4s ${open ? 350 : 0}ms cubic-bezier(0.16,1,0.3,1), opacity 0.3s ${open ? 350 : 0}ms`,
          }}
        >
          <div className="h-px w-full bg-gradient-to-r from-white/15 via-white/5 to-transparent" />
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-0.5">
              <span className="text-white/35 text-[10px] tracking-[0.2em] font-mono uppercase">Iniciar Proyecto</span>
              <a
                href="mailto:somos@adamgrafica.online"
                className="text-white text-base font-medium hover:text-ag-blue transition-colors duration-200"
              >
                somos@adamgrafica.online
              </a>
            </div>
            <a
              href="#contact"
              onClick={close}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-ag-blue text-white transition-transform duration-200 hover:scale-110 active:scale-95"
              style={{ boxShadow: '0 0 24px rgba(0,102,255,0.45)' }}
              aria-label="Agendar llamada"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Briefcase, Zap, Folder, Users, MessageSquare } from 'lucide-react';

const navLinks = [
  { label: 'Servicios', href: '#services', icon: Briefcase },
  { label: 'Proceso', href: '#process', icon: Zap },
  { label: 'Portfolio', href: '#portfolio', icon: Folder },
  { label: 'Nosotros', href: '#about', icon: Users },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Detect scroll direction for hide/show
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Background change on scroll
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-expo-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${isScrolled
          ? 'bg-ag-bg-primary/95 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
        }`}
    >
      <div className="relative z-[60] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a 
            href="#" 
            className="flex items-center gap-2 group"
            aria-label="AdamGráfica - Inicio"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="favicon-shine-container">
               <img 
                 src="/favicon.svg" 
                 alt="AdamGráfica Logo" 
                 width="32"
                 height="32"
                 className="w-8 h-8 lg:w-10 lg:h-10 object-contain transition-transform duration-300 group-hover:scale-110 animate-favicon-glow"
               />
            </div>
            <span className="font-display text-base lg:text-lg font-bold text-white tracking-tight transition-all duration-300 group-hover:text-ag-blue uppercase">
              ADAMGRÁFICA
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-sm text-ag-text-gray hover:text-white transition-colors duration-200 py-2 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-ag-blue transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ag-blue text-white text-sm font-medium rounded-full transition-all duration-300 hover:shadow-glow-blue hover:scale-105 group relative overflow-hidden"
            >
              <span className="relative z-10">Agendar llamada</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* Mobile Menu Button  - Modified to animate nicely */}
          <button
            className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg overflow-hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
          >
             <div className="relative w-5 h-5 flex items-center justify-center">
               <span className={`absolute h-[2px] w-full bg-white rounded-full transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`} />
               <span className={`absolute h-[2px] w-full bg-white rounded-full transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'opacity-0 translate-x-3' : 'opacity-100'}`} />
               <span className={`absolute h-[2px] w-full bg-white rounded-full transition-all duration-500 ease-in-out ${isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`} />
             </div>
          </button>
        </div>
      </div>

      {/* ULTRA MODERN MOBILE MENU OVERLAY - FULL SCREEN */}
      <div
        className={`lg:hidden fixed inset-0 z-[50] h-[100dvh] w-full bg-[#050505]/98 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] flex flex-col px-6 pt-28 pb-10 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-[2%]'
        }`}
      >
        {/* Decorative ambient blobs */}
        <div className={`absolute top-20 right-[-10%] w-72 h-72 bg-ag-blue/20 rounded-full blur-[100px] pointer-events-none transition-opacity duration-1000 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none transition-opacity duration-1000 delay-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} />

        {/* Massive Menu Links */}
        <div className="flex flex-col gap-8 w-full relative z-10 flex-grow justify-center mt-[-20%]">
          {navLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="group overflow-hidden relative w-fit"
            >
              <div 
                className={`transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[100px] opacity-0'}`}
                style={{ transitionDelay: `${isMobileMenuOpen ? 200 + index * 100 : 0}ms` }}
              >
                <div className="flex items-center gap-4">
                  {/* Numero */}
                  <span className="font-mono text-sm text-ag-blue/60 tracking-widest translate-y-1">
                    0{index + 1}
                  </span>
                  {/* Link Monumental */}
                  <span className="font-display text-5xl sm:text-7xl text-white font-bold tracking-tighter transition-all duration-500 group-hover:text-ag-blue group-hover:translate-x-6">
                    {link.label}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Sleek Agency Footer Info inside Menu */}
        <div 
          className={`relative z-10 flex flex-col gap-6 w-full transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100 delay-500' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="h-px w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-white/40 text-[10px] tracking-[0.2em] font-mono uppercase mb-2">Iniciar Proyecto</span>
              <a href="mailto:hola@adamgrafica.com" className="text-white text-lg font-medium hover:text-ag-blue transition-colors tracking-tight">
                hola@adamgrafica.com
              </a>
            </div>
            
            {/* Action CTA Circular */}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="group flex items-center justify-center w-14 h-14 rounded-full bg-ag-blue text-white shadow-[0_0_30px_rgba(0,102,255,0.4)] transition-all duration-500 hover:scale-110 active:scale-95 hover:bg-white hover:text-blue-600"
              aria-label="Agendar llamada"
            >
              <MessageSquare className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

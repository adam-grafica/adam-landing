import { useState, useEffect } from 'react';
import { Menu, X, Briefcase, Zap, Folder, Users, MessageSquare } from 'lucide-react';

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

  // Close mobile menu on scroll
  useEffect(() => {
    if (isMobileMenuOpen) {
      const handleScrollClose = () => {
        setIsMobileMenuOpen(false);
      };
      window.addEventListener('scroll', handleScrollClose, { passive: true });
      return () => window.removeEventListener('scroll', handleScrollClose);
    }
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-expo-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${isScrolled
          ? 'bg-ag-bg-primary/95 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 group"
            aria-label="AdamGráfica - Inicio"
          >
            <div className="favicon-shine-container">
              <img
                src="/favicon.svg"
                alt="AdamGráfica Logo"
                width="32"
                height="32"
                fetchPriority="high"
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

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - Modern glassmorphism */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-expo-out ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="py-6 bg-black/90 backdrop-blur-xl border-t border-white/10 mx-2 rounded-2xl mb-4 shadow-2xl">
            <div className="flex flex-col gap-2 px-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-4 px-4 py-4 text-ag-text-gray hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-ag-blue/20 group-hover:text-ag-blue transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-display font-medium">{link.label}</span>
                  </a>
                );
              })}
              <a
                href="#contact"
                className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-4 bg-ag-blue text-white font-bold rounded-xl transition-all duration-300 hover:shadow-glow-blue active:scale-95"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Agendar llamada</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

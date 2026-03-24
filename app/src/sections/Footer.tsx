import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Instagram, Linkedin, MessageCircle, Mail, Phone, MapPin, Heart, Facebook } from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'Génesis — Identidad Visual', href: '#services' },
    { label: 'Imperio Digital — Sistema Completo', href: '#services' },
    { label: 'Sistema Avanzado — Enterprise', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
  ],
  company: [
    { label: 'Nosotros', href: '#about' },
    { label: 'Proceso', href: '#process' },
    { label: 'Blog / Recursos', href: '#' },
    { label: 'Contacto', href: '#contact' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/adamgrafica', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/adamgraficaCL', label: 'Facebook' },
  { icon: Linkedin, href: 'https://linkedin.com/company/adamgrafica', label: 'LinkedIn' },
  { icon: MessageCircle, href: 'https://wa.me/569XXXXXXXX', label: 'WhatsApp' },
];

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-content', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 95%',
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'expo.out',
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-ag-bg-footer pt-16 pb-8">
      {/* Top Border with gradient animation */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-ag-blue to-transparent animate-pulse" />
      </div>
      
      <div className="footer-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1 - Logo & Tagline */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4 group cursor-pointer">
              <div className="favicon-shine-container">
                <img 
                  src="/favicon.svg" 
                  alt="" 
                  width="24"
                  height="24"
                  loading="lazy"
                  className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-110 animate-favicon-glow" 
                />
              </div>
              <h3 className="font-display text-lg text-white hover:text-ag-blue transition-colors uppercase">
                ADAMGRÁFICA
              </h3>
            </div>
            <p className="text-ag-text-gray text-sm mb-6">
              Construimos imperios digitales con IA.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-ag-text-gray hover:text-white hover:bg-ag-blue/20 hover:border-ag-blue/30 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Column 2 - Services */}
          <div>
            <h4 className="font-display text-white mb-4">Servicios</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-ag-text-gray text-sm hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3 - Company */}
          <div>
            <h4 className="font-display text-white mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-ag-text-gray text-sm hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4 - Contact */}
          <div>
            <h4 className="font-display text-white mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:somos@adamgrafica.online"
                  className="flex items-center gap-2 text-ag-text-gray text-sm hover:text-white transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 text-ag-blue" />
                  somos@adamgrafica.online
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-ag-text-gray text-sm hover:text-white transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 text-ag-blue" />
                  WhatsApp directo
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-ag-text-gray text-sm">
                  <MapPin className="w-4 h-4 text-ag-blue" />
                  Quilpué, Valparaíso, Chile
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-ag-text-muted text-sm">
              © 2026 AdamGráfica · Todos los derechos reservados
            </p>
            <p className="text-ag-text-muted text-sm flex items-center gap-2">
              Diseñado y construido con 
              <Heart className="w-4 h-4 text-red-400 fill-red-400 animate-pulse" /> 
              e IA en Chile
              <span className="text-lg">🇨🇱</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

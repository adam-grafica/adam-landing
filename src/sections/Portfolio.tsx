import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useRevealGroup } from '../hooks/useRevealGroup';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right'
import Lock from 'lucide-react/dist/esm/icons/lock'
import Layers from 'lucide-react/dist/esm/icons/layers'
import X from 'lucide-react/dist/esm/icons/x'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import { trackCTAClick, trackServiceView } from '../utils/analytics';

const projects = [
  {
    id: 'casademoda',
    name: 'CASA DE MODA SANTIAGO',
    industry: 'Moda / E-commerce',
    services: 'E-commerce, identidad digital, integración de pagos',
    techStack: 'WordPress · Elementor · WooCommerce · WebPay',
    tag: 'E-commerce Premium',
    image: '/portfolio/casademoda-preview.jpg',
    gradient: 'from-purple-900/60 to-blue-900/40',
    status: 'completed',
    caseStudy: {
      desafio: "Taller de vestidos con presencia física pero sin canal digital propio — perdiendo ventas a regiones y sin forma de vender online.",
      loQueHicimos: "Desarrollamos casademoda.cl: tienda online completa con catálogo autoadministrable, pago con tarjeta (WebPay), despacho con Chileexpress integrado, sincronización con Instagram y chat directo por WhatsApp.",
      resultado: "De venta solo presencial a canal digital activo 24/7. La tienda vende a todo Chile sin intervención manual."
    }
  },
  {
    id: 'quintavet',
    name: 'QUINTA VET',
    industry: 'Salud animal / Veterinaria',
    services: 'Sitio web profesional, identidad digital',
    techStack: 'Web development · Diseño UX/UI',
    tag: 'Web Corporativa',
    image: '/portfolio/quintavet-preview.jpg',
    gradient: 'from-blue-900/60 to-cyan-900/40',
    status: 'completed',
    caseStudy: {
      desafio: "Clínica veterinaria sin presencia digital — nuevos pacientes solo por referidos, sin canal propio de captación.",
      loQueHicimos: "Desarrollamos quintavet.cl — sitio web profesional con información completa de servicios, equipo médico y formulario de contacto directo.",
      resultado: "Presencia digital activa 24/7. La clínica ahora capta pacientes nuevos de forma autónoma."
    }
  },
  {
    id: 'placeholder3',
    name: 'Próximamente',
    tag: 'Próximamente',
    gradient: 'from-gray-800/60 to-gray-900/40',
    status: 'coming',
  },
  {
    id: 'placeholder4',
    name: 'Próximamente',
    tag: 'Próximamente',
    gradient: 'from-gray-800/60 to-gray-900/40',
    status: 'coming',
  },
  {
    id: 'placeholder5',
    name: 'Próximamente',
    tag: 'Próximamente',
    gradient: 'from-gray-800/60 to-gray-900/40',
    status: 'coming',
  },
  {
    id: 'placeholder6',
    name: 'Próximamente',
    tag: 'Próximamente',
    gradient: 'from-gray-800/60 to-gray-900/40',
    status: 'coming',
  },
];

export default function Portfolio() {
  const [sectionRef] = useReveal<HTMLDivElement>();
  const gridRef = useRevealGroup<HTMLDivElement>();
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const openModal = (project: any) => {
    if (project.status === 'completed') {
      setSelectedProject(project);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative py-24 lg:py-32 bg-ag-bg-tertiary"
      aria-labelledby="portfolio-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="portfolio-eyebrow eyebrow mb-4 inline-flex reveal-fade">
            <Layers className="w-3 h-3 text-ag-blue" />
            LO QUE CONSTRUIMOS
          </span>
          <h2 id="portfolio-title" className="portfolio-title font-display text-display-3 lg:text-display-2 text-white reveal-up">
            Cada proyecto es un
            <br />
            <span className="gradient-text">sistema de crecimiento.</span>
          </h2>
        </div>

        {/* Projects Grid */}
        <div ref={gridRef} className="portfolio-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 reveal-group">
          {projects.map((project, index) => (
            <div
              key={index}
              onClick={() => { if(project.status === 'completed') trackServiceView('Portfolio View: ' + project.name); openModal(project); }}
              className={`portfolio-card group relative aspect-[4/3] rounded-2xl overflow-hidden reveal-child ${project.status === 'completed' ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} transition-transform duration-700 group-hover:scale-110`} />
              
              {/* Image Preview (for completed projects) */}
              {project.image && (
                <picture>
                  <source srcSet={project.image.replace('.jpg', '.webp')} type="image/webp" />
                  <img 
                    src={project.image} 
                    alt={project.name}
                    loading="lazy"
                    decoding="async"
                    width="600"
                    height="450"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:scale-110 transition-transform duration-700"
                  />
                </picture>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end transition-all duration-300 group-hover:pb-10">
                <span className="text-ag-text-gray text-[10px] font-bold mb-2 uppercase tracking-widest">{project.tag}</span>
                <h3 className="font-display text-xl lg:text-2xl text-white group-hover:text-ag-blue transition-colors">{project.name}</h3>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-ag-blue/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                {project.status === 'completed' ? (
                  <div className="flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="bg-white text-ag-blue px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                      Estudio de Caso
                    </span>
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-60">
                    <Lock className="w-5 h-5 text-white" />
                    <span className="text-white text-[10px] uppercase font-bold tracking-widest">Próximamente</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal / Popup */}
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
              onClick={closeModal}
            />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-ag-bg-secondary rounded-[32px] overflow-y-auto border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 z-10 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors group"
              >
                <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>

              {/* Hero Image */}
              <div className="relative aspect-video w-full overflow-hidden">
                <picture>
                  <source srcSet={selectedProject.image.replace('.jpg', '.webp')} type="image/webp" />
                  <img 
                     src={selectedProject.image} 
                     alt={selectedProject.name}
                     className="w-full h-full object-cover"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-ag-bg-secondary to-transparent" />
              </div>

              {/* Project Info Header */}
              <div className="px-8 lg:px-12 pb-12 -mt-16 relative z-10">
                <div className="mb-6">
                  <span className="text-ag-blue text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
                    {selectedProject.industry}
                  </span>
                  <h2 className="font-display text-4xl lg:text-5xl text-white mb-2">
                    {selectedProject.name}
                  </h2>
                  <p className="text-ag-text-gray text-sm lg:text-base">
                    {selectedProject.services} | <span className="text-ag-blue-light">{selectedProject.techStack}</span>
                  </p>
                </div>

                {/* Case Study Grid */}
                <div className="grid gap-8 mb-12">
                  <div className="space-y-3">
                    <h3 className="text-white font-bold text-lg flex items-center gap-3">
                      <span className="w-8 h-px bg-ag-blue" />
                      El desafío
                    </h3>
                    <p className="text-ag-text-gray leading-relaxed text-sm lg:text-base">
                      {selectedProject.caseStudy.desafio}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-white font-bold text-lg flex items-center gap-3">
                      <span className="w-8 h-px bg-ag-blue" />
                      Lo que hicimos
                    </h3>
                    <p className="text-ag-text-gray leading-relaxed text-sm lg:text-base">
                      {selectedProject.caseStudy.loQueHicimos}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-white font-bold text-lg flex items-center gap-3">
                      <span className="w-8 h-px bg-ag-blue" />
                      El resultado
                    </h3>
                    <div className="bg-ag-blue/5 border border-ag-blue/20 p-6 rounded-2xl">
                      <p className="text-white leading-relaxed text-sm lg:text-base font-medium">
                        {selectedProject.caseStudy.resultado}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal CTA */}
                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center gap-6">
                  <a
                    href="#contact"
                    onClick={() => {
                      trackCTAClick('Quiero un proyecto así', 'Portfolio Modal');
                      closeModal();
                      // Small delay to allow the modal to start closing before anchor scroll
                      setTimeout(() => {
                        const element = document.getElementById('contact');
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="btn-primary w-full sm:w-auto px-10 py-4 flex items-center justify-center gap-3"
                  >
                    <span>Quiero un proyecto así</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  {selectedProject.id === 'casademoda' || selectedProject.id === 'quintavet' ? (
                     <a 
                      href={selectedProject.id === 'casademoda' ? 'https://casademoda.cl' : 'https://quintavet.cl'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ag-text-gray hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver sitio en vivo
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

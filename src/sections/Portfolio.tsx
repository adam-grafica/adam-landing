import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Lock, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    name: 'QuintaVet Veterinaria',
    tag: 'Branding + Identidad',
    gradient: 'from-purple-900/60 to-blue-900/40',
    status: 'completed',
  },
  {
    name: 'Formativa OTEC',
    tag: 'Web + Automatización',
    gradient: 'from-blue-900/60 to-cyan-900/40',
    status: 'completed',
  },
  {
    name: 'Clínica Dental',
    tag: 'Branding + Web',
    gradient: 'from-emerald-900/60 to-teal-900/40',
    status: 'completed',
  },
  {
    name: 'Carolina Marina',
    tag: 'Identidad Visual',
    gradient: 'from-rose-900/60 to-pink-900/40',
    status: 'completed',
  },
  {
    name: 'San Fernando',
    tag: 'Web + Contenido',
    gradient: 'from-amber-900/60 to-orange-900/40',
    status: 'completed',
  },
  {
    name: 'Imperio Digital Client',
    tag: 'Próximamente',
    gradient: 'from-gray-800/60 to-gray-900/40',
    status: 'coming',
  },
];

export default function Portfolio() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.portfolio-eyebrow', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'expo.out',
      });

      gsap.from('.portfolio-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: 'expo.out',
      });

      gsap.from('.portfolio-card', {
        scrollTrigger: {
          trigger: '.portfolio-grid',
          start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.1,
        ease: 'expo.out',
      });

      gsap.from('.portfolio-cta', {
        scrollTrigger: {
          trigger: '.portfolio-cta',
          start: 'top 90%',
        },
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'expo.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
          <span className="portfolio-eyebrow eyebrow mb-4 inline-flex">
            <Layers className="w-3 h-3 text-ag-blue" />
            LO QUE CONSTRUIMOS
          </span>
          <h2 id="portfolio-title" className="portfolio-title font-display text-display-3 lg:text-display-2 text-white">
            Cada proyecto es un
            <br />
            <span className="gradient-text">sistema de crecimiento.</span>
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="portfolio-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project, index) => (
            <div
              key={index}
              className="portfolio-card group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} transition-transform duration-700 group-hover:scale-110`} />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Scan line effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-full h-px bg-ag-blue/50 animate-scan" />
              </div>
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="text-ag-text-gray text-xs mb-2 uppercase tracking-wider">{project.tag}</span>
                <h3 className="font-display text-xl text-white group-hover:text-ag-blue transition-colors">{project.name}</h3>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-ag-blue/80 opacity-0 group-hover:opacity-100 transition-colors duration-300 flex items-center justify-center backdrop-blur-sm">
                {project.status === 'completed' ? (
                  <span className="inline-flex items-center gap-2 text-white font-medium group-hover:translate-y-0 translate-y-4 transition-transform duration-300">
                    Ver proyecto
                    <ArrowRight className="w-5 h-5" />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-white/80">
                    <Lock className="w-5 h-5" />
                    Proyecto en proceso
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="portfolio-cta text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 border border-ag-blue text-ag-blue font-medium rounded-full transition-all duration-300 hover:bg-ag-blue/10 hover:shadow-glow-blue group"
          >
            <span>Ver portfolio completo</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

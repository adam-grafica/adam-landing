import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const newsItems = [
  {
    id: 1,
    title: 'ADAMGRÁFICA ASISTIRÁ A SIGMA AMÉRICAS 2026 EN SÃO PAULO',
    date: '13 Mar 2026',
    gradient: 'from-blue-primary to-cyan',
  },
  {
    id: 2,
    title: 'ADAMGRÁFICA EXPANDE ECOSISTEMA DE CONTENIDO A TRAVÉS DE ALIANZA CON BLUE TOWER GAMES',
    date: '27 Feb 2026',
    gradient: 'from-cyan to-blue-primary',
  },
  {
    id: 3,
    title: 'ADAMGRÁFICA PRESELECCIONADA EN CINCO CATEGORÍAS EN GAMINGTECH CEE AWARDS 2026',
    date: '26 Feb 2026',
    gradient: 'from-blue-dark to-blue-primary',
  },
];

export default function News() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % newsItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline
      gsap.from('.news-headline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          // @ts-ignore
          lazy: false,
        },
        x: -50,
        opacity: 0,
        duration: 0.6,
        ease: 'expo.out',
      });

      // Subheadline
      gsap.from('.news-subheadline', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
          // @ts-ignore
          lazy: false,
        },
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Navigation
      gsap.from('.news-nav', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
          // @ts-ignore
          lazy: false,
        },
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'elastic.out(1, 0.5)',
      });

      // Cards
      gsap.from('.news-card', {
        scrollTrigger: {
          trigger: '.news-container',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          // @ts-ignore
          lazy: false,
        },
        rotateY: -45,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'expo.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="news"
      className="relative py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #E6F2FF 0%, #FFFFFF 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <h2 className="news-headline font-display text-display-2 md:text-[60px] text-black leading-none mb-4">
              NOTICIAS QUE
              <br />
              IMPORTAN
            </h2>
            <p className="news-subheadline text-lg text-black/60 max-w-md">
              Noticias, actualizaciones e insights del equipo detrás de la tecnología.
              Descubre lo nuevo en AdamGráfica.
            </p>
          </div>

          {/* Navigation */}
          <div className="news-nav flex gap-4">
            <button
              onClick={prevSlide}
              className="w-14 h-14 border border-black/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-black hover:text-white hover:border-black group"
            >
              <ChevronLeft className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
            <button
              onClick={nextSlide}
              className="w-14 h-14 border border-black/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-black hover:text-white hover:border-black group"
            >
              <ChevronRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* News Cards */}
        <div className="news-container perspective-1200">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item, index) => (
              <article
                key={item.id}
                className={`news-card group relative preserve-3d transition-all duration-400 ease-expo-out cursor-pointer ${
                  index === currentIndex ? 'scale-100' : 'scale-95 opacity-80'
                }`}
                style={{
                  transform: `rotateY(${index === currentIndex ? 0 : 5}deg)`,
                }}
              >
                <div className="relative h-80 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-deep to-black p-8 flex flex-col justify-between transition-all duration-400 group-hover:shadow-xl">
                  {/* Gradient Wave */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-30`}
                  />
                  <svg
                    className="absolute bottom-0 left-0 right-0 w-full h-32"
                    viewBox="0 0 400 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,50 Q100,20 200,50 T400,50 L400,100 L0,100 Z"
                      fill="rgba(0, 217, 255, 0.2)"
                    />
                    <path
                      d="M0,60 Q100,30 200,60 T400,60 L400,100 L0,100 Z"
                      fill="rgba(0, 102, 255, 0.15)"
                    />
                  </svg>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="font-display text-xl text-white leading-tight mb-4 group-hover:text-cyan transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-white/50 text-sm">{item.date}</span>
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-black">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* See All Button */}
        <div className="mt-12">
          <button className="w-full py-4 bg-black text-white rounded-full font-medium transition-all duration-300 hover:bg-blue-primary flex items-center justify-center gap-2 group">
            <span>Ver todas las noticias</span>
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </section>
  );
}

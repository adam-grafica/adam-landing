import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Trophy, Star, Medal, Crown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const awards = [
  { name: 'Google Premier Partner', year: '2025', icon: Award },
  { name: 'Meta Marketing Partner', year: '2025', icon: Trophy },
  { name: 'Shopify Partner of the Year', year: '2025', icon: Star },
  { name: 'HubSpot Impact Award', year: '2025', icon: Medal },
  { name: 'CSS Design Awards', year: '2025', icon: Crown },
  { name: 'Awwwards Site of the Day', year: '2025', icon: Award },
  { name: 'FWA Site of the Day', year: '2025', icon: Trophy },
  { name: 'Webby Awards Honoree', year: '2025', icon: Star },
  { name: 'Cannes Lions Shortlist', year: '2025', icon: Medal },
  { name: 'Clutch Top Agency', year: '2025', icon: Crown },
];

const row1 = awards.slice(0, 5);
const row2 = awards.slice(5, 10);

function AwardCard({ award }: { award: typeof awards[0] }) {
  const Icon = award.icon;
  
  return (
    <div className="flex-shrink-0 w-64 p-6 mx-3 bg-gradient-to-br from-blue-deep/50 to-blue-dark/30 border border-blue-primary/30 rounded-2xl transition-all duration-400 ease-expo-out hover:scale-110 hover:border-cyan/50 hover:shadow-glow group">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-primary to-cyan rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-cyan text-xs font-bold px-2 py-1 bg-cyan/10 rounded-full">
          {award.year}
        </span>
      </div>
      <h4 className="font-display text-lg text-white group-hover:text-cyan transition-colors">
        {award.name}
      </h4>
    </div>
  );
}

export default function Awards() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline
      gsap.from('.awards-headline', {
        // @ts-ignore

        lazy: false,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
      });

      // Rows
      gsap.from('.awards-row-1', {
        // @ts-ignore

        lazy: false,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        x: '100%',
        duration: 1,
        ease: 'expo.out',
      });

      gsap.from('.awards-row-2', {
        // @ts-ignore

        lazy: false,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
        x: '-100%',
        duration: 1,
        ease: 'expo.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="awards"
      className="relative py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #001133 50%, #000000 100%)',
      }}
    >
      {/* Header */}
      <div className="text-center mb-16 px-4">
        <h2 className="awards-headline font-display text-display-2 md:text-[60px] text-white leading-none mb-4">
          <span className="inline-flex items-center gap-4">
            <Award className="w-12 h-12 text-cyan" />
            RECONOCIMIENTOS
            <Award className="w-12 h-12 text-cyan" />
          </span>
          <br />
          <span className="text-gradient">GLOBALES</span>
        </h2>
      </div>

      {/* Marquee Rows */}
      <div className="space-y-6">
        {/* Row 1 - Left to Right */}
        <div className="awards-row-1 overflow-hidden">
          <div className="flex animate-marquee hover:[animation-play-state:paused]">
            {[...row1, ...row1, ...row1, ...row1].map((award, index) => (
              <AwardCard key={`row1-${index}`} award={award} />
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="awards-row-2 overflow-hidden">
          <div className="flex animate-marquee-reverse hover:[animation-play-state:paused]">
            {[...row2, ...row2, ...row2, ...row2].map((award, index) => (
              <AwardCard key={`row2-${index}`} award={award} />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
    </section>
  );
}

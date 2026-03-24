import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// All sections imported eagerly for GSAP ScrollTrigger stability
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import PainAgitation from './sections/PainAgitation';
import Solution from './sections/Solution';
import Services from './sections/Services';
import Process from './sections/Process';
import Testimonials from './sections/Testimonials';
import Comparison from './sections/Comparison';
import Portfolio from './sections/Portfolio';
import TechStack from './sections/TechStack';
import Founder from './sections/Founder';
import FAQ from './sections/FAQ';
import CTAFinal from './sections/CTAFinal';
import Footer from './sections/Footer';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: 'play none none none',
    });

    // Optimize ScrollTrigger for performance
    ScrollTrigger.config({
      ignoreMobileResize: true,
    });

    // Refresh ScrollTrigger when window fully loads (images, fonts, etc.)
    const handleLoad = () => {
      ScrollTrigger.refresh(true);
    };
    window.addEventListener('load', handleLoad);

    // Cleanup
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ag-bg-primary">
      <Navbar />
      <main>
        <Hero />
        <PainAgitation />
        <Solution />
        <Services />
        <Process />
        <Testimonials />
        <Comparison />
        <Portfolio />
        <TechStack />
        <Founder />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </div>
  );
}

export default App;

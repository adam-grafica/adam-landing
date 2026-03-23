import { useEffect, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Critical sections imported eagerly
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';

// Components below the fold imported lazily for performance
const PainAgitation = lazy(() => import('./sections/PainAgitation'));
const Solution = lazy(() => import('./sections/Solution'));
const Services = lazy(() => import('./sections/Services'));
const Process = lazy(() => import('./sections/Process'));
const Testimonials = lazy(() => import('./sections/Testimonials'));
const Comparison = lazy(() => import('./sections/Comparison'));
const Portfolio = lazy(() => import('./sections/Portfolio'));
const TechStack = lazy(() => import('./sections/TechStack'));
const Founder = lazy(() => import('./sections/Founder'));
const FAQ = lazy(() => import('./sections/FAQ'));
const CTAFinal = lazy(() => import('./sections/CTAFinal'));
const Footer = lazy(() => import('./sections/Footer'));

import './App.css';

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

    // Staggered refresh strategy to handle font/image loading race conditions
    const refreshTimers: ReturnType<typeof setTimeout>[] = [];

    const doRefresh = () => {
      ScrollTrigger.refresh(true); // true = force recalculation
    };

    // Refresh at multiple intervals to catch late-loading assets
    refreshTimers.push(setTimeout(doRefresh, 300));
    refreshTimers.push(setTimeout(doRefresh, 1000));
    refreshTimers.push(setTimeout(doRefresh, 2500));

    // Also refresh when window fully loads (images, fonts, etc.)
    const handleLoad = () => {
      setTimeout(doRefresh, 200);
    };
    window.addEventListener('load', handleLoad);

    // NUCLEAR FAILSAFE: After 3 seconds, force ALL animated elements to be visible.
    // This catches any element that GSAP's from() set to opacity:0 but never animated.
    const failsafeTimer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(
        '.pain-eyebrow, .pain-title, .pain-card, .pain-closing, .pain-icon,' +
        '.solution-eyebrow, .solution-headline, .solution-paragraph, .solution-bullet, .bullet-icon,' +
        '.services-eyebrow, .services-title, .service-card, .price-tag,' +
        '.process-eyebrow, .process-title, .process-step, .step-icon,' +
        '.testimonials-eyebrow, .testimonials-title, .testimonial-card, .metrics-item, .star-icon,' +
        '.comparison-eyebrow, .comparison-title, .comparison-row, .comparison-highlight,' +
        '.portfolio-eyebrow, .portfolio-title, .portfolio-card, .portfolio-cta,' +
        '.stack-eyebrow, .stack-title, .stack-category,' +
        '.founder-eyebrow, .founder-name, .founder-title-text, .founder-quote, .founder-badge, .founder-image,' +
        '.faq-eyebrow, .faq-title, .faq-item,' +
        '.cta-eyebrow, .cta-headline, .cta-subheadline, .cta-button, .cta-trust'
      ).forEach((el) => {
        const style = window.getComputedStyle(el);
        if (parseFloat(style.opacity) < 0.1) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    }, 3000);

    // Cleanup
    return () => {
      refreshTimers.forEach(clearTimeout);
      clearTimeout(failsafeTimer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ag-bg-primary">
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<div className="min-h-screen bg-ag-bg-primary" />}>
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
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;

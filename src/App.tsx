import React, { Suspense } from 'react';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Footer from './sections/Footer';

// Secciones "below the fold" con carga aplazada para no bloquear el LCP inicial
const PainAgitation = React.lazy(() => import('./sections/PainAgitation'));
const Solution = React.lazy(() => import('./sections/Solution'));
const Stats = React.lazy(() => import('./sections/Stats'));
const Services = React.lazy(() => import('./sections/Services'));
const CTABanner = React.lazy(() => import('./sections/CTABanner'));
const Process = React.lazy(() => import('./sections/Process'));
const Testimonials = React.lazy(() => import('./sections/Testimonials'));
const Comparison = React.lazy(() => import('./sections/Comparison'));
const WhatSetsUsApart = React.lazy(() => import('./sections/WhatSetsUsApart'));
const Portfolio = React.lazy(() => import('./sections/Portfolio'));
const TechStack = React.lazy(() => import('./sections/TechStack'));
const Founder = React.lazy(() => import('./sections/Founder'));
const FAQ = React.lazy(() => import('./sections/FAQ'));
const CTAFinal = React.lazy(() => import('./sections/CTAFinal'));

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ag-bg-primary">
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <PainAgitation />
          <Solution />
          <Stats />
          <Services />
          <CTABanner />
          <Process />
          <Testimonials />
          <Comparison />
          <WhatSetsUsApart />
          <Portfolio />
          <TechStack />
          <Founder />
          <FAQ />
          <CTAFinal />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;

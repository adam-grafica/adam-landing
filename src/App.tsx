import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Footer from './sections/Footer';
import Rubro from './pages/Rubro';
import BrazoIndex from './pages/BrazoIndex';

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
const ModalForm = React.lazy(() => import('./components/ModalForm'));

function HomePage() {
  return (
    <>
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
      <Suspense fallback={null}>
        <ModalForm />
      </Suspense>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen overflow-x-hidden bg-ag-bg-primary">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rubros" element={<BrazoIndex />} />
          <Route path="/rubro/:slug" element={<Rubro />} />
          <Route path="*" element={<Rubro />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

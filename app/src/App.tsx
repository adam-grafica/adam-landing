// All sections — eager imports ensure stable layout on first paint
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import PainAgitation from './sections/PainAgitation';
import Solution from './sections/Solution';
import Stats from './sections/Stats';
import Services from './sections/Services';
import CTABanner from './sections/CTABanner';
import Process from './sections/Process';
import Testimonials from './sections/Testimonials';
import Comparison from './sections/Comparison';
import WhatSetsUsApart from './sections/WhatSetsUsApart';
import Portfolio from './sections/Portfolio';
import TechStack from './sections/TechStack';
import Founder from './sections/Founder';
import FAQ from './sections/FAQ';
import CTAFinal from './sections/CTAFinal';
import Footer from './sections/Footer';

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ag-bg-primary">
      <Navbar />
      <main>
        <Hero />
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
      </main>
      <Footer />
    </div>
  );
}

export default App;

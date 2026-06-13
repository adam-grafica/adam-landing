import type { RubroConfig } from '../pages/brazos/types';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import RubroHero from '../sections/rubro/RubroHero';
import RubroPain from '../sections/rubro/RubroPain';
import RubroSolution from '../sections/rubro/RubroSolution';
import RubroOferta from '../sections/rubro/RubroOferta';
import RubroBeforeAfter from '../sections/rubro/RubroBeforeAfter';
import RubroTestimonios from '../sections/rubro/RubroTestimonios';
import RubroCTAFinal from '../sections/rubro/RubroCTAFinal';

/**
 * Layout reutilizable para todos los brazos de rubros.
 * Las mismas secciones, distinta data. Si actualizamos un componente
 * de sección, todos los brazos heredan el cambio.
 */
export default function BrazoLayout({ brazo }: { brazo: RubroConfig }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ag-bg-primary">
      <Navbar />
      <main>
        <RubroHero brazo={brazo} />
        <RubroPain brazo={brazo} />
        <RubroSolution brazo={brazo} />
        <RubroBeforeAfter brazo={brazo} />
        <RubroOferta brazo={brazo} />
        <RubroTestimonios brazo={brazo} />
        <RubroCTAFinal brazo={brazo} />
      </main>
      <Footer />
    </div>
  );
}

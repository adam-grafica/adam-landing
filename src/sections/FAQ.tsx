import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useRevealGroup } from '../hooks/useRevealGroup';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: '¿En cuánto tiempo entregan realmente?',
    answer: 'El paquete Imperio Digital se entrega en 4 a 6 semanas desde que iniciamos. Génesis puede estar listo en 1 a 2 semanas. Trabajamos con plazos reales, no prometemos lo que no podemos cumplir.',
  },
  {
    question: '¿Qué incluye exactamente el Imperio Digital?',
    answer: 'Identidad visual completa, website profesional de alto rendimiento, estrategia de contenido para 3 meses, templates para RRSS, automatizaciones básicas y training para que tú o tu equipo puedan operar todo.',
  },
  {
    question: '¿Necesito saber de tecnología para trabajar con ustedes?',
    answer: 'No. Nosotros nos encargamos de todo lo técnico. Solo necesitas saber qué quieres lograr con tu negocio. Nosotros traducimos eso a sistemas.',
  },
  {
    question: '¿Cómo es el proceso de comunicación durante el proyecto?',
    answer: 'Tendrás actualizaciones semanales de avance. Un canal directo de comunicación conmigo. Sin burocracia, sin esperar días para una respuesta.',
  },
  {
    question: '¿Qué pasa después de que me entregan el proyecto?',
    answer: 'Tienes 15 días de soporte post-entrega incluidos. Además puedes contratar un plan de soporte mensual si necesitas que sigamos optimizando tu sistema.',
  },
  {
    question: '¿Dónde están ubicados y cómo trabajaremos?',
    answer: 'Somos una agencia creativa tecnológica y digital 100% remota. Operamos desde Chile para el mundo, lo que significa que estamos a una simple videollamada de distancia para empezar a trabajar juntos, sin importar dónde te encuentres.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [sectionRef] = useReveal<HTMLDivElement>();
  const listRef = useRevealGroup<HTMLDivElement>();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-ag-bg-primary"
      aria-labelledby="faq-title"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="faq-eyebrow eyebrow mb-4 inline-flex reveal-fade">
            <HelpCircle className="w-3 h-3 text-ag-blue" />
            PREGUNTAS FRECUENTES
          </span>
          <h2 id="faq-title" className="faq-title font-display text-display-3 lg:text-display-2 text-white reveal-up">
            Todo lo que necesitas
            <br />
            <span className="text-ag-text-gray">saber antes de empezar.</span>
          </h2>
        </div>

        {/* FAQ List */}
        <div ref={listRef} className="faq-list space-y-3 reveal-group">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item glass-card overflow-hidden transition-colors duration-300 reveal-child ${
                openIndex === index ? 'border-ag-blue/30' : ''
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left group"
                aria-expanded={openIndex === index}
              >
                <span className="font-display text-lg text-white pr-8 group-hover:text-ag-blue transition-colors">
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full bg-ag-blue/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  openIndex === index ? 'bg-ag-blue/20 rotate-180' : ''
                }`}>
                  <ChevronDown className="w-5 h-5 text-ag-blue" />
                </div>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="h-px bg-white/10 mb-4" />
                  <p className="text-ag-text-gray leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

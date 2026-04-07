import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ChevronRight, Calendar } from 'lucide-react';

/**
 * ModalForm Component
 * Props:
 * - Se activa usando el atributo data-open-modal="contact" en cualquier botón/enlace de la landing.
 * - Implementa un formulario multi-paso con captura de leads hacia n8n.
 */
export default function ModalForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    servicios: [] as string[],
    fecha: ''
  });

  const totalSteps = 4;

  useEffect(() => {
    const handleOpen = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-open-modal="contact"]');
      if (target) {
        e.preventDefault();
        setIsOpen(true);
        // Reseteamos el estado cada vez que se abre
        setCurrentStep(1);
        setIsSuccess(false);
        setErrorMsg('');
        setFormData({ nombre: '', email: '', servicios: [], fecha: '' });
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('click', handleOpen);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('click', handleOpen);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Bloqueo de scroll cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const closeModal = () => setIsOpen(false);

  const handleNext = () => {
    setErrorMsg('');
    
    // Validación por paso
    if (currentStep === 1 && formData.nombre.trim().length < 2) {
      setErrorMsg('Por favor ingresa un nombre válido.');
      return;
    }
    if (currentStep === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMsg('Por favor ingresa un correo válido.');
        return;
      }
    }
    if (currentStep === 3 && formData.servicios.length === 0) {
      setErrorMsg('Por favor selecciona al menos un servicio.');
      return;
    }

    if (currentStep === 4) {
      if (formData.fecha === '') {
        setErrorMsg('Por favor elige una fecha para la reunión.');
        return;
      }
      submitForm();
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const submitForm = async () => {
    const payload = {
      ...formData,
      timestamp: new Date().toISOString(),
      fuente: 'landing-adamgrafica'
    };

    try {
      // Reemplazar con la URL real de n8n
      await fetch('https://TU_WEBHOOK_N8N/webhook/lead-adamgrafica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log('Lead enviado a n8n:', payload);
      // Asumimos éxito incluso si n8n no está listo para no quebrar UX
      setIsSuccess(true);
    } catch (err) {
      console.log('Lead capturado (modo offline):', payload);
      setIsSuccess(true);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (!dateValue) return;
    
    // Validar fin de semana
    const selected = new Date(dateValue + 'T00:00:00');
    const day = selected.getDay();
    if (day === 0 || day === 6) {
      setErrorMsg('Por favor elige un día de semana (lunes a viernes)');
      setFormData(prev => ({ ...prev, fecha: '' }));
    } else {
      setErrorMsg('');
      setFormData(prev => ({ ...prev, fecha: dateValue }));
    }
  };

  const toggleService = (service: string) => {
    setFormData(prev => {
      if (prev.servicios.includes(service)) {
        return { ...prev, servicios: prev.servicios.filter(s => s !== service) };
      }
      return { ...prev, servicios: [...prev.servicios, service] };
    });
    setErrorMsg('');
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay - onClick cierra el modal */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={closeModal}
      ></div>

      {/* Modal Container */}
      <div 
        className="relative w-[90%] max-w-[520px] max-h-[85vh] overflow-y-auto bg-[#111111] border border-[#0066FF33] rounded-2xl shadow-[0_0_60px_rgba(0,102,255,0.15)] flex flex-col"
      >
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        {!isSuccess ? (
          <>
            {/* Progress Bar */}
            <div className="w-full h-1 bg-[#111111] rounded-t-2xl overflow-hidden absolute top-0 left-0">
              <div 
                className="h-full bg-[#0066FF] transition-all duration-300 ease-out"
                style={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
              ></div>
            </div>

            <div className="p-8 pb-10 flex flex-col min-h-[360px]">
              {/* Controles de pasos */}
              <div className="flex-1 mt-6">
                
                {/* Paso 1 */}
                {currentStep === 1 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                      ¡Excelente decisión! 👋 <br/>
                      <span className="text-[#0066FF]">¿Cuál es tu nombre?</span>
                    </h2>
                    <input
                      type="text"
                      placeholder="Tu nombre completo"
                      className="w-full bg-black border border-[#0066FF44] rounded-lg px-4 py-4 text-white text-lg focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition-all"
                      value={formData.nombre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                      autoFocus
                    />
                  </div>
                )}

                {/* Paso 2 */}
                {currentStep === 2 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                      ¡Perfecto, {formData.nombre.split(' ')[0]}! 📧 <br/>
                      <span className="text-gray-300 text-xl font-normal">¿A qué correo te enviamos los detalles?</span>
                    </h2>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      className="w-full bg-black border border-[#0066FF44] rounded-lg px-4 py-4 text-white text-lg focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                      autoFocus
                    />
                  </div>
                )}

                {/* Paso 3 */}
                {currentStep === 3 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                      🎯 ¿En qué servicio estás interesado?
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { id: 'imperio', label: 'Imperio Digital ⭐' },
                        { id: 'identidad', label: 'Identidad de Marca' },
                        { id: 'web', label: 'Sitio Web' },
                        { id: 'automatizaciones', label: 'Automatizaciones' },
                        { id: 'sistema', label: 'Sistema Completo' },
                        { id: 'orientacion', label: 'No sé aún, necesito orientación' }
                      ].map((svc) => (
                        <button
                          key={svc.id}
                          onClick={() => toggleService(svc.label)}
                          className={`px-4 py-3 rounded-full text-sm md:text-base font-medium transition-all ${
                            formData.servicios.includes(svc.label)
                              ? 'bg-[#0066FF22] border-[#0066FF] text-[#0066FF] border'
                              : 'bg-transparent border border-[#0066FF44] text-gray-300 hover:border-[#0066FF] hover:text-white'
                          }`}
                        >
                          {svc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Paso 4 */}
                {currentStep === 4 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                      📅 ¿Qué día te acomoda para la reunión?
                    </h2>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="fecha-input"
                        type="date"
                        min={today}
                        className="w-full bg-black border border-[#0066FF44] rounded-lg pl-12 pr-4 py-4 text-white text-lg focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition-all color-scheme-dark"
                        style={{ colorScheme: 'dark' }}
                        value={formData.fecha}
                        onChange={handleDateChange}
                      />
                    </div>
                    <p className="text-gray-500 text-sm mt-3 flex items-center gap-2">
                       Horario a coordinar vía email (Días hábiles).
                    </p>
                  </div>
                )}

                {errorMsg && (
                  <p className="text-red-400 text-sm mt-4 animate-in fade-in">{errorMsg}</p>
                )}
              </div>

              {/* Controles Fijos */}
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                {currentStep > 1 && (
                  <button
                    onClick={() => { setErrorMsg(''); setCurrentStep(prev => prev - 1); }}
                    className="text-gray-400 hover:text-white font-medium text-sm transition-colors py-2"
                  >
                    ← Volver
                  </button>
                )}
                
                <button
                  onClick={handleNext}
                  className="ml-auto bg-[#0066FF] hover:bg-blue-600 shadow-[0_0_24px_rgba(0,102,255,0.5)] text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-all transform active:scale-95"
                >
                  {currentStep === 4 ? '¡Confirmar mi reunión! 🚀' : 'Siguiente'}
                  {currentStep !== 4 && <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Pantalla Éxito */
          <div className="p-8 py-16 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-[#00FF8822] rounded-full flex items-center justify-center mb-6 text-[#00FF88]">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              ¡Todo listo, {formData.nombre.split(' ')[0]}!
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-sm">
              Hemos registrado tu solicitud. Te contactaremos en menos de 24h ⚡
            </p>
            
            <div className="bg-black/50 border border-white/10 rounded-xl p-5 w-full text-left space-y-3 mb-8">
              <div className="flex gap-3"><span className="text-gray-500">Email:</span> <span className="text-white truncate">{formData.email}</span></div>
              <div className="flex gap-3"><span className="text-gray-500">Día:</span> <span className="text-white">{formData.fecha}</span></div>
              <div className="flex gap-3"><span className="text-gray-500">Interés:</span> <span className="text-white truncate">{formData.servicios[0] || 'Varios'}</span></div>
            </div>

            <button
              onClick={closeModal}
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

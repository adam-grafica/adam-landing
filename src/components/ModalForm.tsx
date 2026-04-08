import React, { useState, useEffect, useRef, useMemo } from 'react';
import './ModalForm.css';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

export default function ModalForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [exitingStep, setExitingStep] = useState<number | null>(null);

  const [nombre, setNombre] = useState('');
  const [nombreError, setNombreError] = useState(false);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const [telefono, setTelefono] = useState('');
  const [telefonoError, setTelefonoError] = useState(false);

  const [servicios, setServicios] = useState<string[]>([]);
  const [serviciosError, setServiciosError] = useState(false);

  const [fecha, setFecha] = useState<Date | null>(null);
  const [fechaError, setFechaError] = useState(false);

  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  
  const [hora, setHora] = useState<string>('');
  const [horaError, setHoraError] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [useFallback, setUseFallback] = useState(false);

  const workingDays = useMemo(() => {
    const days: Date[] = [];
    let current = new Date();
    while (days.length < 5) {
      current.setDate(current.getDate() + 1);
      const dow = current.getDay();
      if (dow !== 0 && dow !== 6) {
        days.push(new Date(current));
      }
    }
    return days;
  }, []);

  useEffect(() => {
    if (!fecha || useFallback) return;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setAvailableSlots([]);
      setHora('');
      try {
        const url = import.meta.env.VITE_N8N_DISPONIBILIDAD_URL;
        if (!url || url.includes('PENDIENTE')) {
          setUseFallback(true);
          return;
        }
        const dateStr = fecha.toISOString().split('T')[0];
        const res = await fetch(`${url}?fecha=${dateStr}`);
        if (!res.ok) throw new Error('Failed to fetch from n8n');
        const data = await res.json();
        setAvailableSlots(data.slots_disponibles || []);
      } catch (err) {
        console.error('Error fetching availability:', err);
        setUseFallback(true);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [fecha, useFallback]);
  
  const totalSteps = 5;
  const inputNombreRef = useRef<HTMLInputElement>(null);
  const inputEmailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpen = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-open-modal="contact"]');
      if (target) {
        e.preventDefault();
        setIsOpen(true);
        setCurrentStep(1);
        setExitingStep(null);
        setNombre(''); setEmail(''); setTelefono(''); setServicios([]); setFecha(null); setHora(''); setUseFallback(false); setAvailableSlots([]);
        setNombreError(false); setEmailError(false); setTelefonoError(false); setServiciosError(false); setFechaError(false); setHoraError(false);
        setCalendarDate(new Date());
        setTimeout(() => inputNombreRef.current?.focus(), 200);
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

  // Submit to n8n when entering success screen
  useEffect(() => {
    if (currentStep === 5) {
      launchConfetti();
      const payload: any = {
        nombre,
        email,
        telefono,
        telefonoCompleto: telefono ? `+56${telefono}` : '',
        servicios,
        fecha: fecha ? fecha.toISOString().split('T')[0] : null,
        timestamp: new Date().toISOString(),
        fuente: 'landing-adamgrafica'
      };
      
      if (!useFallback) {
        payload.hora = hora || null;
        payload.fechaHoraCompleta = (fecha && hora) ? `${fecha.toISOString().split('T')[0]}T${hora}:00` : null;
      }
      
      fetch('https://TU_WEBHOOK_N8N/webhook/lead-adamgrafica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => console.log('Lead capturado offline:', payload));
    }
  }, [currentStep]);

  const closeModal = () => setIsOpen(false);

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!nombre.trim()) { setNombreError(true); return false; }
      setNombreError(false); return true;
    }
    if (step === 2) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailOk = email.trim() && re.test(email.trim());
      const telOk = telefono === '' || (telefono.length === 9 && telefono.startsWith('9'));
      
      if (!emailOk) setEmailError(true); else setEmailError(false);
      if (!telOk) setTelefonoError(true); else setTelefonoError(false);

      return !!(emailOk && telOk);
    }
    if (step === 3) {
      if (servicios.length === 0) { setServiciosError(true); return false; }
      setServiciosError(false); return true;
    }
    if (step === 4) {
      if (!fecha) { setFechaError(true); return false; }
      if (!useFallback && !hora) { setHoraError(true); return false; }
      setFechaError(false); setHoraError(false); return true;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) {
      setExitingStep(currentStep);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setTimeout(() => setExitingStep(null), 300);

      // Focus
      setTimeout(() => {
        if (nextStep === 2) inputEmailRef.current?.focus();
      }, 200);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setExitingStep(currentStep);
      setCurrentStep(currentStep - 1);
      setTimeout(() => setExitingStep(null), 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep < 5) {
      e.preventDefault();
      handleNext();
    }
  };

  const toggleService = (val: string) => {
    setServicios(prev => {
      if (prev.includes(val)) return prev.filter(s => s !== val);
      return [...prev, val];
    });
    setServiciosError(false);
  };

  const launchConfetti = () => {
    const colors = ['#0066FF','#00aaff','#22c55e','#f59e0b','#fff','#a855f7'];
    for (let i = 0; i < 48; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${1.2 + Math.random() * 1.5}s;
        animation-delay: ${Math.random() * 0.5}s;
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      `;
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  };

  // Calendar logic
  const calDays = useMemo(() => {
    const d = calendarDate;
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
    let startDow = firstDay.getDay(); // 0=Dom
    if (startDow === 0) startDow = 7;
    startDow--; // 0=Lun

    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const today = new Date();
    today.setHours(0,0,0,0);

    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push({ empty: true });

    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(d.getFullYear(), d.getMonth(), day);
      const isToday = thisDate.getTime() === today.getTime();
      const isPast  = thisDate < today;
      const isWeekend = thisDate.getDay() === 0 || thisDate.getDay() === 6;
      const isSelected = fecha && thisDate.getTime() === fecha.getTime();
      
      cells.push({
        empty: false,
        day,
        date: thisDate,
        isToday,
        isPast,
        isWeekend,
        isSelected
      });
    }
    return cells;
  }, [calendarDate, fecha]);

  const servicioLabels: Record<string, string> = {
    branding: '🎨 Branding e Identidad',
    web: '💻 Sitio Web',
    contenido: '📱 Contenido RRSS',
    automatizacion: '🤖 Automatización IA',
    imperio: '👑 Imperio Digital',
    nosé: '🤔 Por definir',
  };

  return (
    <div className={`modal-form-theme modal-overlay ${isOpen ? 'visible' : ''}`} role="dialog" aria-modal="true" aria-label="Formulario de asesoría" onMouseDown={(e) => {
      if (e.target === e.currentTarget) closeModal();
    }}>
      <div className="modal-card">
        
        {/* HEADER */}
        <div className="modal-header">
          <div className="modal-brand">
            <div className="modal-brand-icon">
              <img src="/favicon.svg" alt="AdamGráfica Icon" style={{ width: '40px', height: '40px', objectFit: 'contain', marginLeft: '4px' }} />
            </div>
            <div>
              <div className="modal-brand-name">AdamGráfica</div>
              <div className="modal-brand-tagline">Asesoría Gratuita · 30 min</div>
            </div>
          </div>
          <button className="btn-close" onClick={closeModal} aria-label="Cerrar formulario">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* PROGRESS */}
        <div className="modal-progress">
          <div className="progress-track">
            {Array.from({ length: totalSteps - 1 }).map((_, i) => {
              const stepNum = i + 1;
              const isCompleted = stepNum < currentStep;
              const isActive = stepNum === currentStep;
              return (
                <React.Fragment key={stepNum}>
                  <div className={`progress-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                    {isCompleted ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    ) : (
                      stepNum
                    )}
                  </div>
                  {stepNum < totalSteps - 1 && (
                    <div className={`progress-line ${isCompleted ? 'filled' : ''}`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="progress-label">Paso <strong>{currentStep > 4 ? 4 : currentStep}</strong> de <strong>{totalSteps - 1}</strong></div>
        </div>

        {/* BODY */}
        <div className="modal-body">
          
          {/* PASO 1 */}
          <div className={`form-step ${currentStep === 1 ? 'active' : ''} ${exitingStep === 1 ? 'exiting' : ''}`}>
            <span className="step-emoji">👋</span>
            <h2 className="step-question">¡Excelente decisión!<br/>¿Cuál es tu nombre?</h2>
            <p className="step-hint">Queremos saber cómo llamarte para hacer esto más personal.</p>
            <div className={`input-wrap ${nombreError ? 'show-error' : ''}`}>
              <input 
                ref={inputNombreRef}
                type="text" 
                className={`form-input ${nombreError ? 'input-error' : ''}`}
                placeholder="Ej: María González" 
                autoComplete="given-name" 
                maxLength={60}
                value={nombre}
                onChange={(e) => { setNombre(e.target.value); setNombreError(false); }}
                onKeyDown={handleKeyDown}
              />
              <p className="error-msg">Por favor ingresa tu nombre.</p>
            </div>
          </div>

          {/* PASO 2 */}
          <div className={`form-step ${currentStep === 2 ? 'active' : ''} ${exitingStep === 2 ? 'exiting' : ''}`}>
            <span className="step-emoji">📧</span>
            <h2 className="step-question">Perfecto, {nombre}!<br/>¿Me dejas tu correo?</h2>
            <p className="step-hint">Te enviaremos la confirmación de tu asesoría directamente aquí.</p>
            <div className={`input-wrap ${emailError ? 'show-error' : ''}`}>
              <input 
                ref={inputEmailRef}
                type="email" 
                className={`form-input ${emailError ? 'input-error' : ''}`}
                placeholder="tu@correo.com" 
                autoComplete="email" 
                maxLength={100}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
                onKeyDown={handleKeyDown}
                style={{ fontSize: '16px' }}
              />
              <p className="error-msg">Por favor ingresa un correo válido.</p>
            </div>

            <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: '16px', marginBottom: '8px', fontWeight: 600 }}>
              📱 Tu WhatsApp <span style={{ color: 'var(--color-success)' }}>(prioridad)</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{
                background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)', color: 'var(--color-text)',
                fontSize: '16px', whiteSpace: 'nowrap', userSelect: 'none', height: '100%', display: 'flex', alignItems: 'center'
              }}>
                🇨🇱 +56
              </span>
              <div className={`input-wrap ${telefonoError ? 'show-error' : ''}`} style={{ flex: 1 }}>
                <input 
                  type="tel" 
                  className={`form-input ${telefonoError ? 'input-error' : ''}`}
                  placeholder="9 XXXX XXXX" 
                  maxLength={9}
                  value={telefono}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                    setTelefono(val);
                    setTelefonoError(false);
                  }}
                  onKeyDown={handleKeyDown}
                  style={{ fontSize: '16px', width: '100%' }}
                />
                <p className="error-msg" style={{ marginTop: '0.25rem' }}>Debe empezar con 9 (9 dígitos).</p>
              </div>
            </div>
            <p style={{ color: 'var(--color-text-faint)', fontSize: '12px', marginTop: '6px' }}>
              Opcional · Solo te escribimos para confirmar tu reunión
            </p>
          </div>

          {/* PASO 3 */}
          <div className={`form-step ${currentStep === 3 ? 'active' : ''} ${exitingStep === 3 ? 'exiting' : ''}`}>
            <span className="step-emoji">🎯</span>
            <h2 className="step-question">¿En qué servicio<br/>estás interesado?</h2>
            <p className="step-hint">Puedes elegir más de uno — te guiamos en la asesoría.</p>
            <div className="service-chips">
              {[
                { val: 'branding', icon: '🎨', label: 'Branding e Identidad' },
                { val: 'web', icon: '💻', label: 'Sitio Web' },
                { val: 'contenido', icon: '📱', label: 'Contenido RRSS' },
                { val: 'automatizacion', icon: '🤖', label: 'Automatización IA' },
                { val: 'imperio', icon: '👑', label: 'Imperio Digital (Pack completo)' },
                { val: 'nosé', icon: '🤔', label: 'No estoy seguro aún' }
              ].map(opt => (
                <div 
                  key={opt.val}
                  className={`chip ${servicios.includes(opt.val) ? 'selected' : ''}`} 
                  onClick={() => toggleService(opt.val)}
                >
                  <span className="chip-icon">{opt.icon}</span> {opt.label}
                </div>
              ))}
            </div>
            <p className={`error-msg ${serviciosError ? 'force-error-msg' : ''}`} style={{ marginTop: '0.5rem' }}>Selecciona al menos una opción.</p>
          </div>

          {/* PASO 4 */}
          <div className={`form-step ${currentStep === 4 ? 'active' : ''} ${exitingStep === 4 ? 'exiting' : ''}`}>
            <span className="step-emoji">📅</span>
            <h2 className="step-question">¿Qué día te acomoda<br/>para la reunión?</h2>
            <p className="step-hint">Asesoría gratuita de 30 min por videollamada. Elige tu fecha ideal.</p>
            
            {useFallback ? (
              <div className="calendar-wrap">
                <div className="cal-header">
                  <button className="cal-nav" onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}>‹</button>
                  <span className="cal-month">{MESES[calendarDate.getMonth()]} {calendarDate.getFullYear()}</span>
                  <button className="cal-nav" onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}>›</button>
                </div>
                <div className="cal-grid">
                  {DIAS.map(d => <div key={d} className="cal-weekday">{d}</div>)}
                  {calDays.map((cell, idx) => (
                    <div 
                      key={idx}
                      className={`cal-day ${cell.empty ? 'empty' : ''} ${cell.isToday ? 'today' : ''} ${cell.isPast || cell.isWeekend ? 'disabled' : ''} ${cell.isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        if (!cell.empty && !cell.isPast && !cell.isWeekend && cell.date) {
                          setFecha(cell.date);
                          setFechaError(false);
                        }
                      }}
                    >
                      {!cell.empty && cell.day}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="availability-container">
                <div className="days-scroll">
                  {workingDays.map((d, i) => {
                    const isSelected = fecha && d.getTime() === fecha.getTime();
                    const dayLabel = d.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/^\w/, c => c.toUpperCase());
                    return (
                      <button 
                        key={i} 
                        className={`slot-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setFecha(d); setFechaError(false); setHora(''); setHoraError(false);
                        }}
                      >
                        {dayLabel}
                      </button>
                    );
                  })}
                </div>

                {fecha && (
                  <div style={{ marginTop: '8px' }}>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: '12px', fontWeight: 600 }}>
                      Horas disponibles:
                    </label>
                    
                    {loadingSlots ? (
                      <div className="availability-spinner-wrap">
                        <div className="availability-spinner"></div>
                        <div className="availability-loading-text">Verificando disponibilidad...</div>
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="no-slots-text">Sin disponibilidad este día. Elige otro.</div>
                    ) : (
                      <div className="slots-grid">
                        {availableSlots.map((slotTime, idx) => (
                          <button 
                            key={idx}
                            className={`slot-btn ${hora === slotTime ? 'selected' : ''}`}
                            onClick={() => {
                              setHora(slotTime); setHoraError(false);
                            }}
                          >
                            {slotTime}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className={`error-msg ${horaError ? 'force-error-msg' : ''}`} style={{ marginTop: '8px' }}>Por favor selecciona una hora.</p>
                  </div>
                )}
              </div>
            )}

            <div className={`selected-date-display ${fecha && (useFallback || hora) ? 'visible' : ''}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>
                {fecha ? fecha.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).replace(/^\w/, c => c.toUpperCase()) : '—'}
                {!useFallback && hora ? ` a las ${hora}` : ''}
              </span>
            </div>
            {useFallback && <p className={`error-msg ${fechaError ? 'force-error-msg' : ''}`}>Por favor selecciona una fecha.</p>}
          </div>

          {/* PASO 5 */}
          <div className={`form-step ${currentStep === 5 ? 'active' : ''}`}>
            <div className="success-step">
              <div className="success-animation">✅</div>
              <h2 className="success-title">¡Todo listo, {nombre.split(' ')[0]}!</h2>
              <p className="success-sub">Recibimos tu solicitud. En menos de 2 horas te contactamos por correo para confirmar tu asesoría. 🚀</p>
              <div className="success-summary">
                <div className="summary-row">
                  <span className="summary-label">Nombre</span>
                  <span className="summary-value">{nombre}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Correo</span>
                  <span className="summary-value">{email}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Servicio</span>
                  <span className="summary-value">{servicios.map(s => servicioLabels[s] || s).join(', ') || '—'}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Fecha preferida</span>
                  <span className="summary-value">
                    {fecha ? fecha.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^\w/, c => c.toUpperCase()) : '—'}
                    {!useFallback && hora ? `, ${hora}` : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        {currentStep < 5 && (
          <div className="modal-footer">
            <button className="btn-back" disabled={currentStep === 1} onClick={handleBack} aria-label="Paso anterior">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Atrás
            </button>
            <div className="footer-secure">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              100% seguro
            </div>
            <button className="bg-[#0066FF] hover:bg-[#0052d6] text-white font-bold flex items-center justify-center gap-2 py-3 px-8 rounded-full transition-all duration-300 ml-auto border-none cursor-pointer" onClick={handleNext} aria-label="Siguiente paso">
              {currentStep === 4 ? 'Confirmar' : 'Siguiente'}
              {currentStep === 4 ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M20 6L9 17l-5-5"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              )}
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}

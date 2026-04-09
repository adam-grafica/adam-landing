/**
 * ModalForm.tsx — Formulario multi-paso AdamGráfica v3
 * 
 * Formulario minimalista de 5 pasos para captura de leads.
 * Integra disponibilidad dinámica vía n8n (con fallback estático).
 * 
 * Dependencias: React, ModalForm.css
 * Env: VITE_N8N_DISPONIBILIDAD_URL
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import './ModalForm.css';

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS = ['Lu','Ma','Mi','Ju','Vi','Sá','Do'];

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

  const totalSteps = 5;
  const inputNombreRef = useRef<HTMLInputElement>(null);
  const inputEmailRef = useRef<HTMLInputElement>(null);

  /** Fetch de slots dinámicos desde n8n */
  useEffect(() => {
    if (!fecha) return;
    
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setAvailableSlots([]);
      setHora('');
      
      try {
        const url = import.meta.env.VITE_N8N_DISPONIBILIDAD_URL;
        
        // Si no hay URL o es el placeholder, activar fallback
        if (!url || url.includes('PENDIENTE')) {
          setUseFallback(true);
          setLoadingSlots(false);
          return;
        }

        const dateStr = fecha.toISOString().split('T')[0];
        const res = await fetch(`${url}?fecha=${dateStr}`);
        
        if (!res.ok) throw new Error('Network error');
        
        const data = await res.json();
        
        if (data.slots_disponibles && data.slots_disponibles.length > 0) {
          setAvailableSlots(data.slots_disponibles);
          setUseFallback(false);
        } else {
          // Si el endpoint responde pero no hay slots, tratamos de dar opción de fallback o mostrar vacío
          setAvailableSlots([]);
        }
      } catch (err) {
        console.warn('Cargando modo fallback por error de conexión:', err);
        setUseFallback(true);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [fecha]);

  /** Abrir/cerrar modal */
  useEffect(() => {
    const handleOpen = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-open-modal="contact"]');
      if (target) {
        e.preventDefault();
        setIsOpen(true);
        setCurrentStep(1);
        setExitingStep(null);
        setNombre(''); setEmail(''); setTelefono('');
        setServicios([]); setFecha(null); setHora('');
        setUseFallback(false); setAvailableSlots([]);
        setNombreError(false); setEmailError(false);
        setTelefonoError(false); setServiciosError(false);
        setFechaError(false); setHoraError(false);
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

  /** Submit al entrar en paso 5 (éxito) */
  useEffect(() => {
    if (currentStep === 5) {
      launchConfetti();
      const payload: Record<string, unknown> = {
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
        payload.fechaHoraCompleta = (fecha && hora)
          ? `${fecha.toISOString().split('T')[0]}T${hora}:00`
          : null;
      }
      fetch('https://TU_WEBHOOK_N8N/webhook/lead-adamgrafica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => console.log('Lead capturado offline:', payload));
    }
  }, [currentStep]);

  const closeModal = () => setIsOpen(false);

  /** Validación por paso */
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
      const next = currentStep + 1;
      setCurrentStep(next);
      setTimeout(() => setExitingStep(null), 250);
      setTimeout(() => {
        if (next === 2) inputEmailRef.current?.focus();
      }, 200);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setExitingStep(currentStep);
      setCurrentStep(currentStep - 1);
      setTimeout(() => setExitingStep(null), 250);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep < 5) {
      e.preventDefault();
      handleNext();
    }
  };

  const toggleService = (val: string) => {
    setServicios(prev =>
      prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]
    );
    setServiciosError(false);
  };

  /** Confetti ligero */
  const launchConfetti = () => {
    const colors = ['#0066FF','#00aaff','#22c55e','#f59e0b','#fff','#a855f7'];
    for (let i = 0; i < 36; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left:${Math.random()*100}%;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        animation-duration:${1.2+Math.random()*1.5}s;
        animation-delay:${Math.random()*0.4}s;
        width:${5+Math.random()*7}px;
        height:${5+Math.random()*7}px;
        border-radius:${Math.random()>0.5?'50%':'2px'};
      `;
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  };

  /** Lógica de calendario */
  const calDays = useMemo(() => {
    const d = calendarDate;
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
    let startDow = firstDay.getDay();
    if (startDow === 0) startDow = 7;
    startDow--;
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const today = new Date();
    today.setHours(0,0,0,0);
    const cells: Array<{
      empty: boolean; day?: number; date?: Date;
      isToday?: boolean; isPast?: boolean; isWeekend?: boolean; isSelected?: boolean;
    }> = [];
    for (let i = 0; i < startDow; i++) cells.push({ empty: true });
    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(d.getFullYear(), d.getMonth(), day);
      cells.push({
        empty: false, day, date: thisDate,
        isToday: thisDate.getTime() === today.getTime(),
        isPast: thisDate < today,
        isWeekend: thisDate.getDay() === 0 || thisDate.getDay() === 6,
        isSelected: !!(fecha && thisDate.getTime() === fecha.getTime())
      });
    }
    return cells;
  }, [calendarDate, fecha]);

  /** Labels para resumen */
  const servicioLabels: Record<string, string> = {
    branding: 'Branding e Identidad',
    web: 'Sitio Web',
    contenido: 'Contenido RRSS',
    automatizacion: 'Automatización IA',
    imperio: 'Imperio Digital',
    nosé: 'Por definir',
  };

  return (
    <div
      className={`modal-form-theme modal-overlay ${isOpen ? 'visible' : ''}`}
      role="dialog" aria-modal="true" aria-label="Formulario de asesoría"
      onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div className="modal-card">

        {/* ── HEADER ── */}
        <div className="modal-header">
          <div className="modal-brand">
            <div className="modal-brand-icon">
              <img src="/favicon.svg" alt="AdamGráfica" />
            </div>
            <div>
              <div className="modal-brand-name">AdamGráfica</div>
              <div className="modal-brand-tagline">Asesoría Gratuita · 30 min</div>
            </div>
          </div>
          <button className="btn-close" onClick={closeModal} aria-label="Cerrar">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── PROGRESS ── */}
        <div className="modal-progress">
          <div className="progress-track">
            {Array.from({ length: totalSteps - 1 }).map((_, i) => {
              const s = i + 1;
              return (
                <React.Fragment key={s}>
                  <div className={`progress-step ${s < currentStep ? 'completed' : ''} ${s === currentStep ? 'active' : ''}`}>
                    {s < currentStep ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    ) : s}
                  </div>
                  {s < totalSteps - 1 && (
                    <div className={`progress-line ${s < currentStep ? 'filled' : ''}`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="progress-label">Paso <strong>{Math.min(currentStep, 4)}</strong> de <strong>4</strong></div>
        </div>

        {/* ── BODY (scrollable) ── */}
        <div className="modal-body">

          {/* PASO 1 — Nombre */}
          <div className={`form-step ${currentStep === 1 ? 'active' : ''} ${exitingStep === 1 ? 'exiting' : ''}`}>
            <h2 className="step-question">¿Cuál es tu nombre?</h2>
            <p className="step-hint">Para personalizar tu experiencia.</p>
            <div className={`input-wrap ${nombreError ? 'show-error' : ''}`}>
              <input
                ref={inputNombreRef}
                type="text"
                className={`form-input ${nombreError ? 'input-error' : ''}`}
                placeholder="María González"
                autoComplete="given-name"
                maxLength={60}
                value={nombre}
                onChange={(e) => { setNombre(e.target.value); setNombreError(false); }}
                onKeyDown={handleKeyDown}
              />
              <p className="error-msg">Ingresa tu nombre.</p>
            </div>
          </div>

          {/* PASO 2 — Contacto */}
          <div className={`form-step ${currentStep === 2 ? 'active' : ''} ${exitingStep === 2 ? 'exiting' : ''}`}>
            <h2 className="step-question">Datos de contacto</h2>
            <p className="step-hint">Te enviaremos la confirmación por correo.</p>

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
              />
              <p className="error-msg">Ingresa un correo válido.</p>
            </div>

            <label style={{ display:'block', color:'var(--color-text-muted)', fontSize:'var(--text-xs)', marginTop:'14px', marginBottom:'6px', fontWeight:600 }}>
              WhatsApp <span style={{ color:'var(--color-text-faint)' }}>(opcional)</span>
            </label>
            <div style={{ display:'flex', gap:'6px', alignItems:'flex-start' }}>
              <span style={{
                background:'var(--color-surface-2)', border:'1.5px solid var(--color-border)',
                borderRadius:'var(--radius-lg)', padding:'10px 12px', color:'var(--color-text-muted)',
                fontSize:'14px', whiteSpace:'nowrap', userSelect:'none'
              }}>+56</span>
              <div className={`input-wrap ${telefonoError ? 'show-error' : ''}`} style={{ flex:1 }}>
                <input
                  type="tel"
                  className={`form-input ${telefonoError ? 'input-error' : ''}`}
                  placeholder="9 XXXX XXXX"
                  maxLength={9}
                  value={telefono}
                  onChange={(e) => {
                    setTelefono(e.target.value.replace(/\D/g, '').slice(0, 9));
                    setTelefonoError(false);
                  }}
                  onKeyDown={handleKeyDown}
                />
                <p className="error-msg">Debe empezar con 9 (9 dígitos).</p>
              </div>
            </div>
          </div>

          {/* PASO 3 — Servicios */}
          <div className={`form-step ${currentStep === 3 ? 'active' : ''} ${exitingStep === 3 ? 'exiting' : ''}`}>
            <h2 className="step-question">¿Qué servicio te interesa?</h2>
            <p className="step-hint">Selecciona uno o más.</p>
            <div className="service-chips">
              {[
                { val:'branding', label:'Branding e Identidad' },
                { val:'web', label:'Sitio Web' },
                { val:'contenido', label:'Contenido RRSS' },
                { val:'automatizacion', label:'Automatización IA' },
                { val:'imperio', label:'Imperio Digital' },
                { val:'nosé', label:'No estoy seguro' }
              ].map(opt => (
                <div
                  key={opt.val}
                  className={`chip ${servicios.includes(opt.val) ? 'selected' : ''}`}
                  onClick={() => toggleService(opt.val)}
                >
                  {opt.label}
                </div>
              ))}
            </div>
            <p className={`error-msg ${serviciosError ? 'force-error-msg' : ''}`} style={{ marginTop:'8px' }}>Selecciona al menos una opción.</p>
          </div>

          {/* PASO 4 — Fecha y Hora */}
          <div className={`form-step ${currentStep === 4 ? 'active' : ''} ${exitingStep === 4 ? 'exiting' : ''}`}>
            <h2 className="step-question">Elige fecha y hora</h2>
            <p className="step-hint">Videollamada de 30 min gratuita.</p>

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

            {/* Slots dinámicos */}
            {fecha && !useFallback && (
              <div className="slots-container-inline">
                <label className="slots-label">
                  Horarios — {fecha.toLocaleDateString('es-CL', { day:'numeric', month:'short' })}
                </label>
                {loadingSlots ? (
                  <div className="slots-loading">
                    <div className="availability-spinner"></div>
                    <span>Verificando...</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className="no-slots-text">Sin disponibilidad. Prueba otro día.</p>
                ) : (
                  <div className="slots-grid-refined">
                    {availableSlots.map((slot, i) => (
                      <button
                        key={i}
                        className={`slot-chip ${hora === slot ? 'active' : ''}`}
                        onClick={() => { setHora(slot); setHoraError(false); }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
                {horaError && <p className="error-msg force-error-msg">Selecciona una hora.</p>}
              </div>
            )}

            <div className={`selected-date-display ${fecha && (useFallback || hora) ? 'visible' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>
                {fecha ? fecha.toLocaleDateString('es-CL', { weekday:'long', day:'numeric', month:'long' }).replace(/^\w/, c => c.toUpperCase()) : '—'}
                {!useFallback && hora ? ` · ${hora}` : ''}
              </span>
            </div>
            {useFallback && fechaError && <p className="error-msg force-error-msg">Selecciona una fecha.</p>}
          </div>

          {/* PASO 5 — Éxito */}
          <div className={`form-step ${currentStep === 5 ? 'active' : ''}`}>
            <div className="success-step">
              <div className="success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h2 className="success-title">Todo listo, {nombre.split(' ')[0]}</h2>
              <p className="success-sub">Te contactaremos en menos de 2 horas para confirmar tu asesoría.</p>
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
                  <span className="summary-label">Fecha</span>
                  <span className="summary-value">
                    {fecha ? fecha.toLocaleDateString('es-CL', { day:'numeric', month:'short' }) : '—'}
                    {!useFallback && hora ? ` · ${hora}` : useFallback ? ' · Hora por confirmar' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── FOOTER ── */}
        {currentStep < 5 && (
          <div className="modal-footer">
            <button className="btn-back" disabled={currentStep === 1} onClick={handleBack} aria-label="Atrás">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Atrás
            </button>
            <div className="footer-secure">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Seguro
            </div>
            <button className="btn-next" onClick={handleNext} aria-label="Siguiente">
              {currentStep === 4 ? 'Confirmar' : 'Siguiente'}
              {currentStep === 4 ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

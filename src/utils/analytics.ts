/**
 * Utilidad centralizada para enviar eventos a Google Tag Manager vía DataLayer.
 * Mantiene nuestros componentes limpios y la analítica consistente.
 */

declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Función base para enviar eventos al DataLayer de GTM
 */
export const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...eventData,
    });
  }
};

/**
 * Evento: Clic en Call To Actions (Botones Principales)
 */
export const trackCTAClick = (buttonName: string, location: string) => {
  trackEvent('cta_click', {
    button_name: buttonName,
    location: location,
  });
};

/**
 * Evento: Interacción de un usuario con un servicio o plan específico
 */
export const trackServiceView = (serviceName: string) => {
  trackEvent('view_service', {
    service_name: serviceName,
  });
};

/**
 * Evento: Intención de contacto general
 */
export const trackContactIntent = (method: string, location: string) => {
  trackEvent('contact_intent', {
    contact_method: method, // 'whatsapp', 'email', 'booking_form'
    location: location,
  });
};

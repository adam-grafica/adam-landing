/**
 * api.ts — base URL del backend, fuente única de verdad.
 *
 * 2026-09-26 MS-MANAGER: el default era `http://localhost:3001` horneado en el
 * bundle. Para un visitante real en adamgrafica.online eso es *su* localhost,
 * así que disponibilidad, chat y envío de lead morían en producción aunque el
 * código estuviera perfecto. El symptom era invisible en local (todo vive en
 * 127.0.0.1) y en el smoke test (que pegaba directo al backend, no al bundle).
 *
 * Regla: same-origin por defecto. El proxy inverso sirve `/api/*` y lo manda al
 * FastAPI, igual que en dev (vite preview) y en prod (nginx). El origen nunca
 * se escribe en el bundle salvo que se defina VITE_API_BASE_URL explícitamente
 * (builds que会谈en con un backend en otro host, p.ej. staging en Tailscale).
 */

/** Vacío = mismo origen. Nunca 'http://localhost:3001' como fallback. */
const configured = (import.meta.env.VITE_API_BASE_URL ?? '').trim();

/**
 * Quita la barra final para no producir `//api/...` con rutas relativas.
 * Una URL absoluta con path (`https://x.me/api`) se respeta tal cual.
 */
export const API_BASE: string = configured.replace(/\/+$/, '');

/** true cuando el bundle habla same-origin (o sea: detrás del proxy inverso). */
export const API_IS_SAME_ORIGIN: boolean = configured === '';

/** Log de arranque, útil para diagnóstico en consola del navegador. */
if (!API_IS_SAME_ORIGIN) {
  console.info(`[api] backend explícito: ${API_BASE}`);
} else {
  console.info('[api] backend same-origin vía proxy /api');
}

/** Construye una URL de API. `path` debe empezar con `/api`. */
export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

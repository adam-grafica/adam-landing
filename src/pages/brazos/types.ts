/**
 * Tipos y configuración base para brazos por rubro
 */

export type RubroSlug =
  | 'comida-rapida'
  | 'restaurant'
  | 'panaderia'
  | 'cafeteria'
  | 'botilleria';

export interface RubroConfig {
  slug: RubroSlug;
  nombre: string;
  emoji: string;
  tagline: string;
  descripcionCorta: string;
  descripcionLarga: string;
  heroEyebrow: string;
  heroHeadline: string[];
  heroSubheadline: string;
  painPoints: string[];
  soluciones: Array<{ titulo: string; descripcion: string; emoji: string }>;
  testimonios: Array<{ nombre: string; cargo: string; quote: string }>;
  ctaLabel: string;
  ctaWhatsapp: string;
  color: { primary: string; accent: string };
  // Métricas
  stats: Array<{ numero: string; label: string }>;
  // Pricing
  ofertaPrincipal: {
    titulo: string;
    precio: string;
    precioOriginal?: string;
    incluye: string[];
    tiempo: string;
  };
  // Antes/Después (imágenes)
  ejemplos: Array<{ antes: string; despues: string; nombre: string }>;
}

export const Brazos: Record<RubroSlug, RubroConfig> = {} as never;

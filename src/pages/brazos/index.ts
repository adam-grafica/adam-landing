import { comidaRapida } from './comida-rapida';
import type { RubroConfig, RubroSlug } from './types';

// Mapa de brazos activos. Al agregar un nuevo rubro:
//   1. Crea `pages/brazos/<slug>.ts` exportando RubroConfig
//   2. Agrégalo al registro de abajo
//   3. Listo — aparece automáticamente en /<slug> y en el index de la home
export const brazos: Record<string, RubroConfig> = {
  'comida-rapida': comidaRapida,
};

export const brazosList: RubroConfig[] = Object.values(brazos);

export function getBrazo(slug: string): RubroConfig | null {
  return brazos[slug] ?? null;
}

export type { RubroConfig, RubroSlug };

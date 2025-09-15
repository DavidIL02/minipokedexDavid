// Tipos base para tener todo ordenado y legible

export type Stat = { name: string; base: number };

export type PokemonLite = {
  id: number;
  name: string;
  sprite: string | null;
  types: string[];
  height: number;       // Nota: la API da decímetros
  weight: number;       // Nota: la API da hectogramos
  base_experience: number;
};

export type PokemonFull = PokemonLite & {
  abilities: string[];
  stats: Stat[];
};

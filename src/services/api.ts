import type { PokemonLite, PokemonFull } from "../types";

const API = "https://pokeapi.co/api/v2";

/** Respuesta del endpoint de lista */
type PokemonListResponse = {
  count: number;
  results: { name: string; url: string }[];
};

/** Subconjunto mínimo del detalle que usamos para construir el "lite" */
type PokemonDetailResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience?: number | null;
  sprites?: {
    front_default?: string | null;
    other?: {
      ["official-artwork"]?: {
        front_default?: string | null;
      };
    };
  };
  types?: { type: { name: string } }[];
};

/**
 * Trae una página de pokémon (lista).
 * Implementación actual: N+1 peticiones (1 a lista + N a detalle) para enriquecer la grid con sprite/tipos.
 * Ventaja: UX rica en la lista. Contras: más latencia y peticiones.
 * (Mejora futura: derivar id de la URL y construir artwork URL sin pedir todos los detalles.
 *  Luego pedir detalle al abrir el modal: patrón "fetch on demand").
 */
export async function fetchPokemonPage(opts: {
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
}): Promise<{ count: number; items: PokemonLite[] }> {
  const { limit = 20, offset = 0, signal } = opts;

  // 1) Petición a la lista
  const res = await fetch(`${API}/pokemon?limit=${limit}&offset=${offset}`, { signal });
  if (!res.ok) throw new Error("Error cargando listado");
  const data: PokemonListResponse = await res.json();

  // 2) Para cada item, pido detalle en paralelo para construir el "lite" rico
  const items: PokemonLite[] = await Promise.all(
    data.results.map(async (p) => {
      const r = await fetch(p.url, { signal });
      if (!r.ok) throw new Error("Error cargando detalle");
      const d: PokemonDetailResponse = await r.json();

      const sprite =
        d.sprites?.other?.["official-artwork"]?.front_default ??
        d.sprites?.front_default ??
        null;

      return {
        id: d.id,
        name: d.name,
        sprite,
        types: d.types?.map((t) => t.type.name) ?? [],
        height: d.height,
        weight: d.weight,
        base_experience: d.base_experience ?? 0,
      } as PokemonLite;
    })
  );

  return { count: data.count, items };
}

/**
 * Busca un pokémon por nombre y devuelve el objeto "full" (detalle).
 * Lanza "No encontrado" si el endpoint responde 404.
 */
export async function fetchPokemonByName(
  name: string,
  { signal }: { signal?: AbortSignal } = {}
): Promise<PokemonFull> {
  const res = await fetch(`${API}/pokemon/${name.toLowerCase()}`, { signal });
  if (!res.ok) throw new Error("No encontrado");
  const d: PokemonDetailResponse & {
    abilities?: { ability: { name: string } }[];
    stats?: { base_stat: number; stat: { name: string } }[];
  } = await res.json();

  const sprite =
    d.sprites?.other?.["official-artwork"]?.front_default ??
    d.sprites?.front_default ??
    null;

  return {
    id: d.id,
    name: d.name,
    sprite,
    types: d.types?.map((t) => t.type.name) ?? [],
    height: d.height,
    weight: d.weight,
    base_experience: d.base_experience ?? 0,
    abilities: d.abilities?.map((a) => a.ability.name) ?? [],
    stats: d.stats?.map((s) => ({ name: s.stat.name, base: s.base_stat })) ?? [],
  } as PokemonFull;
}

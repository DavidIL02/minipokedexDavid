import type { PokemonLite, PokemonFull } from "../types";

const API = "https://pokeapi.co/api/v2";

// devolvemos una forma tipada de la página (conteo + items resumidos)
export async function fetchPokemonPage(opts: {
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
}): Promise<{ count: number; items: PokemonLite[] }> {
  const { limit = 20, offset = 0, signal } = opts;

  const res = await fetch(`${API}/pokemon?limit=${limit}&offset=${offset}`, { signal });
  if (!res.ok) throw new Error("Error cargando listado");
  const data: { count: number; results: { name: string; url: string }[] } = await res.json();

  // aquí pido detalles en paralelo con los datos del primer fetch para tener imagenes y tipos (mejor UX en la lista)
  const items: PokemonLite[] = await Promise.all(
    data.results.map(async (p) => {
      const r = await fetch(p.url, { signal });
      if (!r.ok) throw new Error("Error cargando detalle");
      const d = await r.json();
      return {
        id: d.id,
        name: d.name,
        sprite: d.sprites?.other?.["official-artwork"]?.front_default ?? d.sprites?.front_default ?? null,
        types: d.types?.map((t: any) => t.type.name) ?? [],
        height: d.height,
        weight: d.weight,
        base_experience: d.base_experience ?? 0,
      } as PokemonLite;
    })
  );

  return { count: data.count, items };
}

// buscar por nombre me devuelve el objeto completo y tipado
export async function fetchPokemonByName(
  name: string,
  { signal }: { signal?: AbortSignal } = {}
): Promise<PokemonFull> {
  const res = await fetch(`${API}/pokemon/${name.toLowerCase()}`, { signal });
  if (!res.ok) throw new Error("No encontrado");
  const d = await res.json();

  return {
    id: d.id,
    name: d.name,
    sprite: d.sprites?.other?.["official-artwork"]?.front_default ?? d.sprites?.front_default ?? null,
    types: d.types?.map((t: any) => t.type.name) ?? [],
    height: d.height,
    weight: d.weight,
    base_experience: d.base_experience ?? 0,
    abilities: d.abilities?.map((a: any) => a.ability.name) ?? [],
    stats: d.stats?.map((s: any) => ({ name: s.stat.name, base: s.base_stat })) ?? [],
  } as PokemonFull;
}

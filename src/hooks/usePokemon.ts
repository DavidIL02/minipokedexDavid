import { useEffect, useMemo, useRef, useState } from "react";
import { fetchPokemonByName, fetchPokemonPage } from "../services/api";
import type { PokemonLite } from "../types";

/**
 * Hook principal de datos/estado para la Pokédex.
 * Gestiona:
 *  - Página actual (0-based) y tamaño de página (limit)
 *  - Query de búsqueda
 *  - Lista "lite" para la grid
 *  - Total y totalPages
 *  - Estados de carga y error
 *  - Cancelación de peticiones para evitar condiciones de carrera
 */
export function usePokemon() {
  // Paginación y búsqueda
  const [page, setPage] = useState(0);   // 0-based para encajar con offset = page * limit
  const [limit] = useState(20);          // fijo (podrías exponerlo si quisieras)
  const [query, setQuery] = useState("");

  // Datos y metadatos
  const [list, setList] = useState<PokemonLite[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Referencia al AbortController para cancelar la petición anterior
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancelo la petición anterior si existe (cambio de página o query)
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function load() {
      setLoading(true);
      setError("");

      try {
        // Si hay query, hago búsqueda directa por nombre (detalle completo)
        if (query.trim()) {
          const one = await fetchPokemonByName(query.trim(), { signal: controller.signal });
          setList([one]);   // muestro el match
          setTotal(1);      // hay exactamente 1 resultado
        } else {
          // Sin query: pido la página "lite" (con N+1 a detalle según tu servicio)
          const { items, count } = await fetchPokemonPage({
            limit,
            offset: page * limit,
            signal: controller.signal,
          });
          setList(items);
          setTotal(count);
        }
      } catch (e: unknown) {
        // Errores de red, abortos o 404 (en nombre)
        const msg = e instanceof Error ? e.message : "Error";
        setError(msg);
        setList([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    load();
    // Al desmontar o cambiar dependencias, aborto la petición en curso
    return () => controller.abort();
  }, [page, limit, query]);

  // Derivado: totalPages (0 cuando no conozco total)
  const totalPages = useMemo(
    () => (total ? Math.ceil(total / limit) : 0),
    [total, limit]
  );

  return {
    page, setPage,
    query, setQuery,
    list, total, totalPages,
    loading, error,
  };
}

/**
 * Notas:
 * - El patrón de cancelación con AbortController evita "setState" tras desmontar o tras cambios rápidos.
 * - Con query activa ocultas paginación (lógico, ya que muestras un match único).
 * - Mejora futura (opcional): cachear páginas y/o usar React Query para reuso y control fino de estados.
 */

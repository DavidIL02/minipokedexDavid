import { useEffect, useMemo, useRef, useState } from "react";
import { fetchPokemonByName, fetchPokemonPage } from "../services/api";
import type { PokemonLite } from "../types";

// hook principal: maneja estado de lista, búsqueda, paginación y errores
export function usePokemon() {
  const [page, setPage] = useState(0);       // 0-based para que sea cómodo
  const [limit] = useState(20);              // tamaño de página fijo (se puede exponer si quiero)
  const [query, setQuery] = useState("");
  const [list, setList] = useState<PokemonLite[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // buenas prácticas: abortar petición anterior si hay nueva búsqueda/cambio de página
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function load() {
      setLoading(true);
      setError("");
      try {
        if (query.trim()) {
          const one = await fetchPokemonByName(query.trim(), { signal: controller.signal });
          setList([one]); // si hay query, muestro match directo
          setTotal(1);
        } else {
          const { items, count } = await fetchPokemonPage({
            limit,
            offset: page * limit,
            signal: controller.signal,
          });
          setList(items);
          setTotal(count);
        }
      } catch (e: any) {
        setError(e?.message ?? "Error");
        setList([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [page, limit, query]);

  const totalPages = useMemo(() => (total ? Math.ceil(total / limit) : 0), [total, limit]);

  return {
    page, setPage,
    query, setQuery,
    list, total, totalPages,
    loading, error,
  };
}

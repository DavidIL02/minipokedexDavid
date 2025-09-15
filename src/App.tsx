/**
 * App.tsx
 * Componente raíz: orquesto búsqueda (SearchBar), listado (PokemonList),
 * paginación (Pagination) y detalle (PokemonModal).
 *
 * Decisiones:
 * - La obtención de datos vive en el hook `usePokemon`.
 * - El detalle "full" se pide al abrir el modal (upgrade de lite->full).
 * - Sin estilos inline: todo va a `index.css`.
 */

import { useCallback, useMemo, useState } from "react";

// UI
import SearchBar from "./components/SearchBar";
import PokemonList from "./components/PokemonList";
import PokemonModal from "./components/PokemonModal";
import Pagination from "./components/Pagination";

// Datos/estado
import { usePokemon } from "./hooks/usePokemon";
import { fetchPokemonByName } from "./services/api";

// Tipos
import type { PokemonLite, PokemonFull } from "./types";

// ❌ Quitamos el import de App.css para unificar estilos en index.css
// import "./App.css";

export default function App() {
  /**
   * usePokemon centraliza:
   * - page/query/list/totalPages
   * - loading/error
   * - cancelación con AbortController
   */
  const {
    page, setPage,
    query, setQuery,
    list, totalPages,
    loading, error,
  } = usePokemon();

  /** Item seleccionado (puede ser lite o full) para el modal */
  const [selected, setSelected] = useState<PokemonFull | PokemonLite | null>(null);
  /** Control del modal */
  const [modalOpen, setModalOpen] = useState(false);

  // -- BÚSQUEDA --------------------------------------------------------------
  // Al buscar, reseteo a la primera página y delego el valor en el hook.
  const handleSearch = useCallback((val: string) => {
    setPage(0);
    setQuery(val);
  }, [setPage, setQuery]);

  // -- DETALLE ---------------------------------------------------------------
  // Intento “upgrade” lite -> full; si falla, muestro el lite.
  const openDetail = useCallback(async (item: PokemonLite) => {
    try {
      const d = await fetchPokemonByName(item.name);
      setSelected(d);
      setModalOpen(true);
    } catch {
      setSelected(item);
      setModalOpen(true);
    }
  }, []);

  // -- CABECERA --------------------------------------------------------------
  const headerTitle = useMemo(
    () => (query?.trim() ? `Resultados para "${query.trim()}"` : "Mini Pokédex"),
    [query]
  );

  // -- RENDER ---------------------------------------------------------------
  return (
    <div className="container">
      {/* Cabecera con título dinámico */}
      <div className="header">
        <h1 className="title">{headerTitle}</h1>
      </div>

      {/* Sección de búsqueda (con pequeño margen por CSS) */}
      <div className="section">
        <SearchBar onChange={handleSearch} />
      </div>

      {/* Estados de red */}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {loading && (
        <div className="skeleton skeleton--lg" aria-hidden="true" />
      )}

      {/* Contenido principal sólo cuando no hay carga ni error */}
      {!loading && !error && (
        <>
          <PokemonList items={list} onSelect={openDetail} />

          {/* Paginación solo sin query (búsqueda muestra 1 match) */}
          {!query?.trim() && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(0, p - 1))}
              onNext={() => setPage((p) => p + 1)}
            />
          )}
        </>
      )}

      {/* Modal de detalle */}
      <PokemonModal
        open={modalOpen}
        item={selected}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

/**
 * Ideas futuras:
 * - aria-live para loading; React.memo en lista/paginación.
 * - Cache de `fetchPokemonByName` si abres/cerras el mismo modal varias veces.
 */

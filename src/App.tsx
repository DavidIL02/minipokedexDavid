/**
 * App.tsx
 * Componente raíz de la aplicación. Aquí orquesto:
 * - búsqueda (SearchBar) -> actualiza query y resetea la página
 * - listado (PokemonList) -> muestra resultados (lite)
 * - paginación (Pagination) -> solo cuando NO hay búsqueda
 * - detalle (PokemonModal) -> "upgradeo" de lite a full al abrir
 *
 * Nota: mantengo aquí el "flow" de la UI y delego la obtención de datos
 * en el hook usePokemon y el servicio fetchPokemonByName.
 */

import { useCallback, useMemo, useState } from "react";

// UI: piezas visuales independientes y reutilizables
import SearchBar from "./components/SearchBar";
import PokemonList from "./components/PokemonList";
import PokemonModal from "./components/PokemonModal";
import Pagination from "./components/Pagination";

// Estado/datos: hook que encapsula lógica de fetch, paginado y query
import { usePokemon } from "./hooks/usePokemon";

// Servicio: API para obtener un Pokémon con detalle completo por nombre
import { fetchPokemonByName } from "./services/api";

// Tipos compartidos de la app (lite para la lista, full para el modal)
import type { PokemonLite, PokemonFull } from "./types";

// Estilos específicos de esta pantalla/contenedor
import "./App.css";


// ============================================================================
// Componente principal: orquesto búsqueda, lista, paginación y modal
// ============================================================================
export default function App() {
  /**
   * usePokemon centraliza el estado derivado de datos:
   * - page / setPage: índice de página (0-based)
   * - query / setQuery: cadena de búsqueda (se usa para filtrar)
   * - list: resultados "lite" listos para pintar
   * - totalPages: total estimado de páginas (cuando no hay búsqueda)
   * - loading / error: estados de red para UX (skeleton / mensaje)
   */
  const { page, setPage, query, setQuery, list, totalPages, loading, error } = usePokemon();

  /**
   * selected: lo que muestro en el modal. Puedo guardar:
   * - PokemonFull (ideal, si el fetch del detalle funciona)
   * - PokemonLite (fallback, si el fetch del detalle falla)
   * - null (modal cerrado / nada seleccionado)
   */
  const [selected, setSelected] = useState<PokemonFull | PokemonLite | null>(null);

  /** modalOpen: control explícito de visibilidad del modal */
  const [modalOpen, setModalOpen] = useState(false);


  // ==========================================================================
  // BÚSQUEDA
  // Al cambiar la query, reseteo la paginación y delego en el hook
  // Memorizo el callback para que no cambie de referencia en cada render.
  // ==========================================================================
  const handleSearch = useCallback((val: string) => {
    setPage(0);   // Al iniciar una búsqueda, vuelvo siempre a la primera página
    setQuery(val);
  }, [setPage, setQuery]);


  // ==========================================================================
  // DETALLE
  // Cuando selecciono un item de la lista:
  // 1) intento "upgrade" de PokemonLite -> PokemonFull
  // 2) si algo falla, uso el lite para no romper la experiencia
  // Mantengo el modal abierto en ambos casos.
  // ==========================================================================
  const openDetail = useCallback(async (item: PokemonLite) => {
    try {
      const d = await fetchPokemonByName(item.name); // detalle completo por nombre
      setSelected(d);                                // guardo full
      setModalOpen(true);                            // abro modal
    } catch {
      setSelected(item);                             // fallback: me quedo con el lite
      setModalOpen(true);                            // abro modal igualmente
    }
  }, []);
  // Nota: [] -> referencia estable. Útil si PokemonList hace memo y compara props.


  // ==========================================================================
  // CABECERA
  // Título dinámico: si hay query no vacía, muestro "Resultados para "<query>""
  // useMemo evita recalcular en cada render; solo depende de 'query'.
  // ==========================================================================
  const headerTitle = useMemo(
    () => (query?.trim() ? `Resultados para "${query.trim()}"` : "Mini Pokédex"),
    [query]
  );


  // ==========================================================================
  // RENDER
  // Estructura general: header, search, estados de error/carga, lista y paginación,
  // y por último el modal (fuera del flujo del listado para no reflowear).
  // ==========================================================================
  return (
    <div className="container">
      {/* Header fijo con el título dinámico */}
      <div className="header">
        <h1 style={{ margin: 0 }}>{headerTitle}</h1>
      </div>

      {/* Barra de búsqueda: disparo handleSearch en cada cambio (debounce va dentro de SearchBar si lo hay) */}
      <div style={{ marginTop: 12 }}>
        <SearchBar onChange={handleSearch} />
      </div>

      {/* UX de estados:
          - error: mensaje claro en rojo
          - loading: skeleton con altura fija para evitar "saltos" (CLS) */}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {loading && <div className="skeleton" style={{ height: 140, marginTop: 16 }} />}

      {/* Contenido principal: solo cuando no hay ni carga ni error */}
      {!loading && !error && (
        <>
          {/* Listado de resultados "lite". Al hacer click en un item, abro detalle. */}
          <PokemonList items={list} onSelect={openDetail} />

          {/* Paginación solo cuando NO hay query (en búsqueda muestro un set filtrado) */}
          {!query?.trim() && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(0, p - 1))} // no permite bajar de 0
              onNext={() => setPage((p) => p + 1)}               // avanza una página
            />
          )}
        </>
      )}

      {/* Modal de detalle: recibe el item (lite o full) y un handler para cerrar */}
      <PokemonModal open={modalOpen} item={selected} onClose={() => setModalOpen(false)} />
    </div>
  );
}

/**
 * Notas futuras / ideas de mejora:
 * - Accesibilidad: aria-live para mensajes de loading/error; foco inicial dentro del modal.
 * - Rendimiento: React.memo en PokemonList/Pagination; cache simple para fetchPokemonByName.
 * - Estado: limpiar "selected" al cerrar el modal si quisiera evitar datos antiguos.
 * - Paginación en búsqueda: si más adelante quiero paginar resultados filtrados, mostrar Pagination también con query.
 */

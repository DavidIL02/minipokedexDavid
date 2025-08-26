import { useCallback, useMemo, useState } from "react";
import SearchBar from "./components/SearchBar";
import PokemonList from "./components/PokemonList";
import PokemonModal from "./components/PokemonModal";
import Pagination from "./components/Pagination";
import { usePokemon } from "./hooks/usePokemon";
import { fetchPokemonByName } from "./services/api";
import type { PokemonLite, PokemonFull } from "./types";
import "./App.css";

// componente principal: orquesta búsqueda, lista y modal de detalle
export default function App() {
  const { page, setPage, query, setQuery, list, totalPages, loading, error } = usePokemon();
  const [selected, setSelected] = useState<PokemonFull | PokemonLite | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSearch = useCallback((val: string) => {
    setPage(0);       // al buscar, reseteo a página 0
    setQuery(val);
  }, [setPage, setQuery]);

  const openDetail = useCallback(async (item: PokemonLite) => {
    try {
      // aquí “upgradeo” del lite al full cuando abro modal
      const d = await fetchPokemonByName(item.name);
      setSelected(d);
      setModalOpen(true);
    } catch {
      // si falla, muestro lo que tengo (lite)
      setSelected(item);
      setModalOpen(true);
    }
  }, []);

  const headerTitle = useMemo(
    () => (query?.trim() ? `Resultados para "${query.trim()}"` : "Mini Pokédex"),
    [query]
  );

  return (
    <div className="container">
      <div className="header">
        <h1 style={{ margin: 0 }}>{headerTitle}</h1>
      </div>

      <div style={{ marginTop: 12 }}>
        <SearchBar onChange={handleSearch} />
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {loading && <div className="skeleton" style={{ height: 140, marginTop: 16 }} />}

      {!loading && !error && (
        <>
          <PokemonList items={list} onSelect={openDetail} />
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

      <PokemonModal open={modalOpen} item={selected} onClose={() => setModalOpen(false)} />
    </div>
  );
}

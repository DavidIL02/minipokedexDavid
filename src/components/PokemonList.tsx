/**
 * Grid de resultados con semántica de lista:
 * - <ul>/<li> en lugar de <div> sueltos.
 * - Renderiza PokemonCard por cada elemento.
 * - Mensaje vacío cuando no hay items.
 */
import type { PokemonLite } from "../types";
import PokemonCard from "./PokemonCard";

type Props = {
  items: PokemonLite[];               // lista de pokémon (lite)
  onSelect: (p: PokemonLite) => void; // callback al hacer click en una card
};

export default function PokemonList({ items, onSelect }: Props) {
  // Empty state simple y claro
  if (!items?.length) return <p className="empty">No hay resultados.</p>;

  return (
    <ul className="grid">
      {items.map((p) => (
        <li key={p.id} className="grid__cell">
          <PokemonCard item={p} onClick={onSelect} />
        </li>
      ))}
    </ul>
  );
}

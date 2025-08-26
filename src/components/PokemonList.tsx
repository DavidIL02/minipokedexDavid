import type { PokemonLite } from "../types";
import PokemonCard from "./PokemonCard";

type Props = {
  items: PokemonLite[];
  onSelect: (p: PokemonLite) => void;
};

// grid de resultados o vacío si no hay
export default function PokemonList({ items, onSelect }: Props) {
  if (!items?.length) return <p>No hay resultados.</p>;
  return (
    <div className="grid">
      {items.map((p) => (
        <PokemonCard key={p.id} item={p} onClick={onSelect} />
      ))}
    </div>
  );
}

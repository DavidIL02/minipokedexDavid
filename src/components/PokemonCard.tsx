import type { PokemonLite } from "../types";

type Props = {
  item: PokemonLite;
  onClick?: (p: PokemonLite) => void;
};

// card simple para lista: imagen + nombre + tipos
export default function PokemonCard({ item, onClick }: Props) {
  return (
    <div className="card" onClick={() => onClick?.(item)} role="button" tabIndex={0}>
      {item.sprite && <img src={item.sprite} alt={item.name} loading="lazy" />}
      <h3 style={{ textTransform: "capitalize", margin: "8px 0" }}>{item.name}</h3>
      <div>
        {item.types.map((t) => (
          <span key={t} className="badge">{t}</span>
        ))}
      </div>
    </div>
  );
}

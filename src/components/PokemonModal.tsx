import type { PokemonLite, PokemonFull } from "../types";

type Props = {
  open: boolean;
  item: (PokemonLite | PokemonFull) | null;
  onClose: () => void;
};

// modal: si item tiene "stats"/"abilities", sé que es el detalle completo
export default function PokemonModal({ open, item, onClose }: Props) {
  if (!open || !item) return null;

  const hasFull = (i: any): i is PokemonFull => Array.isArray(i?.stats) && Array.isArray(i?.abilities);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2 style={{ textTransform: "capitalize" }}>{item.name}</h2>
          <button className="button" onClick={onClose}>Cerrar</button>
        </header>

        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          {item.sprite && (
            <img
              src={item.sprite}
              alt={item.name}
              style={{ width: 180, height: 180, objectFit: "contain" }}
            />
          )}

          <div>
            <p><strong>ID:</strong> {item.id}</p>
            <p><strong>Tipos:</strong> {item.types.join(", ")}</p>
            <p><strong>Altura:</strong> {item.height}</p>
            <p><strong>Peso:</strong> {item.weight}</p>
            <p><strong>XP base:</strong> {item.base_experience}</p>

            {hasFull(item) && (
              <>
                <p><strong>Habilidades:</strong> {item.abilities.join(", ")}</p>
                <div>
                  <strong>Stats:</strong>
                  <ul>
                    {item.stats.map((s) => <li key={s.name}>{s.name}: {s.base}</li>)}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

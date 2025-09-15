/**
 * Tarjeta clicable de Pokémon:
 * - Semántica: <button> (no <div role="button">) => foco y teclado nativos.
 * - A11y: aria-label describiendo la acción (ver detalles del Pokémon).
 * - UI: imagen (lazy), nombre y badges de tipos.
 *
 * Nota: sin estilos inline; las clases CSS (.card, .card__img, etc.) van en tu hoja de estilos.
 */
import type { PokemonLite } from "../types";

type Props = {
  item: PokemonLite;                 // Pokémon en formato "lite" para la lista
  onClick?: (p: PokemonLite) => void; // callback opcional al pulsar la tarjeta
};

export default function PokemonCard({ item, onClick }: Props) {
  return (
    <button
      type="button"
      className="card"
      onClick={() => onClick?.(item)}
      aria-label={`Ver detalles de ${item.name}`}
    >
      {/* Imagen: solo si existe; lazy para rendimiento.
         .card__img define tamaño/fit en CSS */}
      {item.sprite && (
        <img
          className="card__img"
          src={item.sprite}
          alt={item.name}
          loading="lazy"
        />
      )}

      {/* Título: capitalización se hará por CSS (.card__title) */}
      <h3 className="card__title">{item.name}</h3>

      {/* Badges de tipos */}
      <div className="card__badges">
        {item.types.map((t) => (
          <span key={t} className="badge">
            {t}
          </span>
        ))}
      </div>
    </button>
  );
}

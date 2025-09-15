/**
 * Modal de detalle:
 * - Solo se monta cuando `open` e `item` existen (evita trabajo extra).
 * - Cierra al pulsar backdrop o tecla Escape.
 * - Foco inicial en el botón "Cerrar" para facilitar la navegación con teclado.
 * - A11y: role="dialog", aria-modal="true", aria-label con el nombre del Pokémon.
 *
 * Nota: este modal no implementa un "focus trap" completo (suficiente para tu caso).
 * Si más adelante quieres un trap real, usaremos una librería o lógica extra.
 */
import { useEffect, useRef } from "react";
import type { PokemonLite, PokemonFull } from "../types";

type Props = {
  open: boolean;                          // ¿el modal está visible?
  item: PokemonLite | PokemonFull | null; // el pokémon seleccionado
  onClose: () => void;                    // cerrar modal
};

// Type guard: detecta si el item es "full" (tiene stats/abilities)
function isFull(i: PokemonLite | PokemonFull): i is PokemonFull {
  return (
    Array.isArray((i as PokemonFull).stats) &&
    Array.isArray((i as PokemonFull).abilities)
  );
}

export default function PokemonModal({ open, item, onClose }: Props) {
  // Referencia al botón de cerrar para enfocar al abrir
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Manejo de foco inicial y tecla Escape
  useEffect(() => {
    if (!open) return;
    // foco en el botón de cerrar para accesibilidad con teclado
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Si no está abierto o no hay item, no renderizamos nada
  if (!open || !item) return null;

  return (
    // Backdrop: cierra al hacer click fuera del modal
    <div className="modal-backdrop" onClick={onClose}>
      {/* Contenedor del diálogo: detenemos propagación para que no cierre al click dentro */}
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalles de ${item.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <h2 className="modal__title">{item.name}</h2>
          <button
            ref={closeRef}
            className="button"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            Cerrar
          </button>
        </header>

        <div className="modal__body">
          {/* Imagen principal */}
          {item.sprite && (
            <img
              className="modal__img"
              src={item.sprite}
              alt={item.name}
              loading="lazy"
            />
          )}

          {/* Información base (si es "lite" algunos campos pueden faltar/ser 0) */}
          <div className="modal__info">
            <p><strong>ID:</strong> {item.id}</p>
            <p><strong>Tipos:</strong> {item.types.join(", ")}</p>
            <p><strong>Altura:</strong> {item.height}</p>
            <p><strong>Peso:</strong> {item.weight}</p>
            <p><strong>XP base:</strong> {item.base_experience}</p>

            {/* Bloque extra solo si es "full" */}
            {isFull(item) && (
              <>
                <p><strong>Habilidades:</strong> {item.abilities.join(", ")}</p>
                <div className="modal__stats">
                  <strong>Stats:</strong>
                  <ul>
                    {item.stats.map((s) => (
                      <li key={s.name}>
                        {s.name}: {s.base}
                      </li>
                    ))}
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

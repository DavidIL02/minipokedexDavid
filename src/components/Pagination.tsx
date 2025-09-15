/**
 * Componente de paginación accesible y minimalista.
 * - Semántica: <nav aria-label="Paginación">
 * - A11y: estados disabled, aria-live para anunciar la página actual.
 * - Controlado por props: page (0-based), totalPages, onPrev, onNext.
 */
type Props = {
  page: number;            // índice de página actual (0-based)
  totalPages: number;      // número total de páginas (>= 1)
  onPrev: () => void;      // callback al ir a la página anterior
  onNext: () => void;      // callback al ir a la página siguiente
};

export default function Pagination({ page, totalPages, onPrev, onNext }: Props) {
  // Si no hay páginas o solo hay 1, no tiene sentido mostrar paginación.
  if (!totalPages || totalPages <= 1) return null;

  // Estados derivados para botones
  const isFirst = page <= 0;
  const isLast = page >= totalPages - 1;

  return (
    <nav className="pagination" aria-label="Paginación">
      {/* Botón anterior: deshabilitado en la primera página */}
      <button
        className="button"
        onClick={onPrev}
        disabled={isFirst}
        aria-label="Página anterior"
      >
        Anterior
      </button>

      {/* Indicador "humano". aria-live=polite para lectores de pantalla */}
      <span className="pagination__meta" aria-live="polite">
        Página {page + 1} / {totalPages}
      </span>

      {/* Botón siguiente: deshabilitado en la última página */}
      <button
        className="button"
        onClick={onNext}
        disabled={isLast}
        aria-label="Página siguiente"
      >
        Siguiente
      </button>
    </nav>
  );
}

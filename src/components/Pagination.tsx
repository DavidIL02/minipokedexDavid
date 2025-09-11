type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

// paginación minimalista y funcional
export default function Pagination({ page, totalPages, onPrev, onNext }: Props) {
  // Guard clause: si no hay páginas o solo hay 1, no mostramos nada
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="pagination">
      {/* Botón anterior: se desactiva en la primera página (índice 0) */}
      <button className="button" onClick={onPrev} disabled={page === 0}>
        Anterior
      </button>

      {/* Indicador de página para humanos: sumamos 1 porque 'page' es 0-based */}
      <span>Página {page + 1} / {totalPages}</span>

      {/* Botón siguiente: se desactiva si ya estamos en la última página (totalPages - 1) */}
      <button className="button" onClick={onNext} disabled={page + 1 >= totalPages}>
        Siguiente
      </button>
    </div>
  );
}

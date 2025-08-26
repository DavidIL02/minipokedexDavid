type Props = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
  };
  
  // paginación minimalista y funcional
  export default function Pagination({ page, totalPages, onPrev, onNext }: Props) {
    if (!totalPages || totalPages <= 1) return null;
    return (
      <div className="pagination">
        <button className="button" onClick={onPrev} disabled={page === 0}>Anterior</button>
        <span>Página {page + 1} / {totalPages}</span>
        <button className="button" onClick={onNext} disabled={page + 1 >= totalPages}>Siguiente</button>
      </div>
    );
  }
  
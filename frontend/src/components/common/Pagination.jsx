const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
      <button
        className="px-4 py-2 rounded-full border border-beige disabled:opacity-40"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      {pageNumbers.map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className={`w-10 h-10 rounded-full transition-colors ${
            n === page ? 'bg-gold text-ivory' : 'border border-beige hover:bg-beige'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        className="px-4 py-2 rounded-full border border-beige disabled:opacity-40"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

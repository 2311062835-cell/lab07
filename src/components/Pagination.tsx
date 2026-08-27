interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination" aria-label="Phan trang">
      <button className="btn ghost-dark" type="button" disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)}>Truoc</button>
      <span>Trang {currentPage + 1} / {totalPages}</span>
      <button className="btn ghost-dark" type="button" disabled={currentPage >= totalPages - 1} onClick={() => onPageChange(currentPage + 1)}>Sau</button>
    </div>
  );
}

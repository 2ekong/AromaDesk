import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisible = 5,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav aria-label="페이지 네비게이션">
      <ul className="pagination justify-content-center">
        {/* 첫 페이지 */}
        {showFirstLast && currentPage > 1 && (
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => onPageChange(1)}
              aria-label="첫 페이지"
            >
              &laquo;
            </button>
          </li>
        )}

        {/* 이전 페이지 */}
        {currentPage > 1 && (
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="이전 페이지"
            >
              &lsaquo;
            </button>
          </li>
        )}

        {/* 페이지 번호들 */}
        {visiblePages.map((page) => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}

        {/* 다음 페이지 */}
        {currentPage < totalPages && (
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="다음 페이지"
            >
              &rsaquo;
            </button>
          </li>
        )}

        {/* 마지막 페이지 */}
        {showFirstLast && currentPage < totalPages && (
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => onPageChange(totalPages)}
              aria-label="마지막 페이지"
            >
              &raquo;
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;

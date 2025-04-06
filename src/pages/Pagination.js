import React from "react";

const Pagination = ({ page, totalPages, setPage }) => {
  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
        Предыдущая
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => handlePageClick(number)}
          disabled={page === number}
          className={page === number ? "active" : ""}
        >
          {number}
        </button>
      ))}
      <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
        Следующая
      </button>
    </div>
  );
};

export default Pagination;

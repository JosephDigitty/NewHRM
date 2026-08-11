import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const Pagination = ({ currentPage, totalPages, onPageChange, onPrev, onNext, showingText }) => {
  const maxVisiblePages = 3;
  const pagesToShow = [];

  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  for (let i = startPage; i <= endPage; i++) {
    pagesToShow.push(i);
  }

  return (
    <div className="flex justify-between items-center mt-4">
      <p className="text-sm text-gray-500">{showingText}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdChevronLeft size={18} />
        </button>

        {pagesToShow.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium ${
              currentPage === page
                ? "bg-[#4f46e5] text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {totalPages > maxVisiblePages && <span className="text-gray-400">...</span>}

        {totalPages > maxVisiblePages && (
          <button
            onClick={() => onPageChange(totalPages)}
            className={`w-8 h-8 flex items-center justify-center rounded border text-sm font-medium ${
              currentPage === totalPages
                ? "bg-[#4f46e5] text-white border-[#4f46e5]"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {totalPages}
          </button>
        )}

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

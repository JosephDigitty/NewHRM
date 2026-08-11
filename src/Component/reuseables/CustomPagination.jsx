import { ChevronLeft, ChevronRight } from "lucide-react";

const CustomPagination = ({ currentPage, rowsPerPage, rowCount, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(rowCount / rowsPerPage));
  const start = rowCount === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, rowCount);

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
      <div className="text-sm text-gray-500">
        Showing {start} to {end} of {rowCount} results
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-purple-600 text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;

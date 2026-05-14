import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const maxVisible = 5;
    const pageNumbers = [];

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) pageNumbers.push(i);
    } else if (page <= 3) {
      for (let i = 1; i <= maxVisible; i++) pageNumbers.push(i);
    } else if (page >= pages - 2) {
      for (let i = pages - maxVisible + 1; i <= pages; i++)
        pageNumbers.push(i);
    } else {
      for (let i = page - 2; i <= page + 2; i++) pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium">{start}</span> to{" "}
        <span className="font-medium">{end}</span> of{" "}
        <span className="font-medium">{total}</span> results
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50
            disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              page === pageNum
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50
            disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
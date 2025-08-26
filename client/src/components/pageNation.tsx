import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export const Pagination = ({
  pageNationData,
  onPageChange,
  setpageNationData,
}: {
  pageNationData: { pageNum: number; totalPages: number };
  onPageChange: (
    page: number,
    select?: string,
    searchData?: string
  ) => Promise<void> | void;
  setpageNationData: React.Dispatch<
    React.SetStateAction<{ pageNum: number; totalPages: number }>
  >;
}) => {
  if (pageNationData.totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const current = pageNationData.pageNum;
    const total = pageNationData.totalPages;

    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (current <= 3) {
      end = Math.min(5, total);
    }
    if (current >= total - 2) {
      start = Math.max(1, total - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const newPage = pageNationData.pageNum - 1;
          setpageNationData((prev) => ({ ...prev, pageNum: newPage }));
          onPageChange(newPage);
        }}
        disabled={pageNationData.pageNum <= 1}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {renderPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => {
              setpageNationData((prev) => ({ ...prev, pageNum: page }));
              onPageChange(page);
            }}
            className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
              page === pageNationData.pageNum
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            aria-current={page === pageNationData.pageNum ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const newPage = pageNationData.pageNum + 1;
          setpageNationData((prev) => ({ ...prev, pageNum: newPage }));
          onPageChange(newPage);
        }}
        disabled={pageNationData.pageNum >= pageNationData.totalPages}
        className="gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};
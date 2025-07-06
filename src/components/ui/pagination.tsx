"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="flex items-center gap-1 text-sm px-3 py-1 border rounded-md border-border text-white disabled:opacity-40"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      <span className="text-sm text-gray-300">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 text-sm px-3 py-1 border rounded-md border-border text-white disabled:opacity-40"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

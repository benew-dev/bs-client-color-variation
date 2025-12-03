"use client";

import { memo, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ResponsivePaginationComponent from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";

const CustomPagination = memo(({ totalPages = 1 }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  const getCurrentPage = useCallback(() => {
    const pageParam = searchParams?.get("page");
    if (!pageParam) return 1;

    const parsedPage = parseInt(pageParam, 10);

    if (isNaN(parsedPage) || parsedPage < 1) {
      return 1;
    }

    return Math.min(parsedPage, Math.max(1, totalPages));
  }, [searchParams, totalPages]);

  const currentPage = getCurrentPage();

  useEffect(() => {
    if (isNavigating) {
      setIsNavigating(false);
    }
  }, [searchParams]);

  const handlePageChange = useCallback(
    (newPage) => {
      if (isNavigating) return;

      if (newPage === currentPage) return;

      setIsNavigating(true);

      try {
        const params = new URLSearchParams(searchParams?.toString() || "");

        if (newPage === 1) {
          params.delete("page");
        } else {
          params.set("page", newPage.toString());
        }

        const query = params.toString();
        const path = query ? `${pathname}?${query}` : pathname;

        router.push(path);

        if (typeof window !== "undefined") {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      } catch (error) {
        console.error("Erreur de navigation:", error);
        setIsNavigating(false);
      }
    },
    [currentPage, searchParams, pathname, router, isNavigating],
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex mt-8 justify-center" aria-live="polite">
      {isNavigating ? (
        <div className="flex items-center space-x-2 text-gray-600">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" // ✅ Spinner bleu pastel
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Chargement de la page {currentPage}...</span>
        </div>
      ) : (
        <ResponsivePaginationComponent
          current={currentPage}
          total={totalPages}
          onPageChange={handlePageChange}
          maxWidth={300}
          ariaPreviousLabel="Page précédente"
          ariaNextLabel="Page suivante"
          previousLabel="«"
          nextLabel="»"
        />
      )}
    </div>
  );
});

CustomPagination.displayName = "CustomPagination";

export default CustomPagination;

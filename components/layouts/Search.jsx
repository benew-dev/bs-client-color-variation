"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Search as SearchIcon } from "lucide-react";

const useDebounce = (fn, delay) => {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay],
  );
};

const Search = ({ setLoading }) => {
  const [keyword, setKeyword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  const handleKeywordChange = useCallback((e) => {
    const value = e.target.value;
    setKeyword(value);
  }, []);

  const submitHandler = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      if (isSubmitting) return;
      setIsSubmitting(true);

      if (setLoading && typeof setLoading === "function") {
        setLoading(true);
      }

      try {
        if (!keyword || keyword.trim() === "") {
          toast.error("Veuillez entrer un terme de recherche");
          if (setLoading && typeof setLoading === "function") {
            setLoading(false);
          }
          setIsSubmitting(false);
          return;
        }

        if (setLoading && typeof setLoading === "function") {
          setLoading(false);
        }
        setIsSubmitting(false);
        router.push(`/?keyword=${encodeURIComponent(keyword.trim())}`);
      } catch (error) {
        if (error.inner && error.inner.length) {
          error.inner.forEach((err) => {
            toast.error(err.message);
          });
        } else {
          toast.error(
            error.message || "Une erreur est survenue lors de la recherche",
          );
        }

        if (setLoading && typeof setLoading === "function") {
          setLoading(false);
        }
        setIsSubmitting(false);
      }
    },
    [keyword, setLoading],
  );

  const debouncedSubmit = useDebounce(submitHandler, 300);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        debouncedSubmit(e);
      }
    },
    [debouncedSubmit],
  );

  return (
    <form
      className="flex flex-nowrap items-center w-full order-last md:order-0 mt-5 md:mt-0 md:w-1/3 lg:w-2/4"
      onSubmit={(e) => {
        e.preventDefault();
        debouncedSubmit(e);
      }}
      role="search"
      aria-label="Rechercher des produits"
    >
      <input
        ref={inputRef}
        className="grow appearance-none border border-pink-100 bg-white rounded-md mr-2 py-2 px-3 hover:border-pink-200 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" // ✅ Blanc avec bordure rose
        type="search"
        placeholder="Rechercher un produit..."
        value={keyword}
        onChange={handleKeywordChange}
        onKeyDown={handleKeyDown}
        aria-label="Terme de recherche"
        disabled={isSubmitting}
        required
      />
      <button
        type="button"
        className={`px-4 py-2 inline-block border border-transparent ${
          isSubmitting
            ? "bg-blue-200 cursor-not-allowed"
            : "bg-gradient-btn-primary hover:bg-gradient-btn-primary-hover"
        } text-gray-800 font-medium rounded-md transition-all shadow-sm hover:shadow-md`}
        onClick={debouncedSubmit}
        disabled={isSubmitting}
        aria-label="Lancer la recherche"
      >
        <span className="md:hidden">
          <SearchIcon className="w-5 h-5" />
        </span>
        <span className="hidden md:inline">
          {isSubmitting ? "Recherche..." : "Rechercher"}
        </span>
      </button>
    </form>
  );
};

export default Search;

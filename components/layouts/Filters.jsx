"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { getPriceQueryParams, isArrayEmpty } from "@/helpers/helpers";
import { ChevronDown, ChevronUp } from "lucide-react";
import dynamic from "next/dynamic";

const Search = dynamic(() => import("./Search"), {
  loading: () => (
    <div className="h-10 w-full bg-pink-50 animate-pulse rounded-md"></div> // ✅ Rose pastel
  ),
  ssr: true,
});

const Filters = ({ categories, setLocalLoading }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [min, setMin] = useState(() => searchParams?.get("min") || "");
  const [max, setMax] = useState(() => searchParams?.get("max") || "");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCategory = useMemo(
    () => searchParams?.get("category") || "",
    [searchParams],
  );

  const currentKeyword = useMemo(
    () => searchParams?.get("keyword") || "",
    [searchParams],
  );

  useEffect(() => {
    setMin(searchParams?.get("min") || "");
    setMax(searchParams?.get("max") || "");
  }, [searchParams]);

  const validatePrices = useCallback(async () => {
    if (min === "" && max === "") {
      throw new Error(
        "Veuillez renseigner au moins un des deux champs de prix",
      );
    }

    if (min !== "" && max !== "") {
      const minNum = Number(min);
      const maxNum = Number(max);

      if (isNaN(minNum) || isNaN(maxNum)) {
        throw new Error("Les valeurs de prix doivent être des nombres valides");
      }

      if (minNum > maxNum) {
        throw new Error("Le prix minimum doit être inférieur au prix maximum");
      }
    }
  }, [min, max]);

  const handleCategoryClick = useCallback(
    (categoryId) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      setLocalLoading(true);

      try {
        const params = new URLSearchParams(searchParams?.toString() || "");

        if (params.get("category") === categoryId) {
          params.delete("category");
        } else {
          params.set("category", categoryId);
        }

        const path = `/?${params.toString()}`;
        setOpen(false);
        setIsSubmitting(false);
        setLocalLoading(false);
        router.push(path);
      } catch (error) {
        console.error("Erreur lors de la sélection de catégorie:", error);
        toast.error("Une erreur est survenue lors du filtrage par catégorie");
        setLocalLoading(false);
        setIsSubmitting(false);
      }
    },
    [searchParams, router, setLocalLoading],
  );

  const handlePriceFilter = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setLocalLoading(true);

    try {
      await validatePrices();

      let params = new URLSearchParams(searchParams?.toString() || "");

      params = getPriceQueryParams(params, "min", min);
      params = getPriceQueryParams(params, "max", max);

      const path = `/?${params.toString()}`;
      setOpen(false);
      setIsSubmitting(false);
      setLocalLoading(false);
      router.push(path);
    } catch (error) {
      toast.error(
        error.message || "Une erreur est survenue avec les filtres de prix",
      );
      setLocalLoading(false);
      setIsSubmitting(false);
    }
  }, [min, max, searchParams, validatePrices, router, setLocalLoading]);

  const resetFilters = useCallback(() => {
    setIsSubmitting(false);
    setLocalLoading(false);
    setMin("");
    setMax("");
    router.push("/");
    setOpen(false);
  }, [router, setLocalLoading]);

  const hasActiveFilters = useMemo(() => {
    return min || max || currentCategory || currentKeyword;
  }, [min, max, currentCategory, currentKeyword]);

  const handleSearchComplete = useCallback(() => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, []);

  const handleSearchLoading = useCallback(
    (loading) => {
      setLocalLoading(loading);
      if (!loading) {
        handleSearchComplete();
      }
    },
    [setLocalLoading, handleSearchComplete],
  );

  return (
    <aside className="md:w-1/3 lg:w-1/4 px-4">
      <div className="sticky top-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 hidden md:block">
            Filtres
          </h2>

          <button
            className="md:hidden w-full mb-4 py-2 px-4 bg-white border border-pink-200 rounded-md shadow-sm flex justify-between items-center" // ✅ Bordure rose douce
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="filter-panel"
          >
            <span className="font-medium text-gray-700">Filtres</span>
            {open ? (
              <ChevronUp className="text-gray-500" />
            ) : (
              <ChevronDown className="text-gray-500" />
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-400 cursor-pointer hover:text-blue-500 hidden md:block" // ✅ Bleu doux
              aria-label="Réinitialiser tous les filtres"
            >
              Réinitialiser
            </button>
          )}
        </div>

        <div
          id="filter-panel"
          className={`${open ? "block" : "hidden"} md:block space-y-4`}
        >
          <div className="md:hidden mb-4">
            <Search setLoading={handleSearchLoading} />
          </div>

          {/* Prix */}
          <div className="p-4 border border-pink-100 bg-white rounded-lg shadow-sm">
            {" "}
            {/* ✅ Bordure rose très douce */}
            <h3 className="font-semibold mb-3 text-gray-700">Prix (Fdj)</h3>
            <div className="grid grid-cols-2 gap-x-2 mb-3">
              <div>
                <label
                  htmlFor="min-price"
                  className="text-xs text-gray-500 mb-1 block"
                >
                  Min
                </label>
                <input
                  id="min-price"
                  name="min"
                  className="appearance-none border border-pink-100 bg-white rounded-md py-2 px-3 hover:border-pink-200 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 w-full" // ✅ Background blanc
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  aria-label="Prix minimum"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="max-price"
                  className="text-xs text-gray-500 mb-1 block"
                >
                  Max
                </label>
                <input
                  id="max-price"
                  name="max"
                  className="appearance-none border border-pink-100 bg-white rounded-md py-2 px-3 hover:border-pink-200 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 w-full"
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  aria-label="Prix maximum"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <button
              className={`w-full py-2 px-4 ${
                isSubmitting
                  ? "bg-blue-200 cursor-not-allowed"
                  : "bg-blue-200 hover:bg-blue-300" // ✅ Bleu pastel a2d2ff
              } text-gray-800 font-medium cursor-pointer rounded-md transition-colors shadow-sm`}
              onClick={handlePriceFilter}
              aria-label="Appliquer les filtres de prix"
              disabled={isSubmitting}
            >
              Appliquer
            </button>
          </div>

          {/* Catégories */}
          <div className="p-4 border border-pink-100 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold mb-3 text-gray-700">Catégories</h3>

            {isArrayEmpty(categories) ? (
              <div className="w-full text-center py-2">
                <p className="text-gray-500">Aucune catégorie disponible</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {categories?.map((category) => (
                  <button
                    key={category?._id}
                    className={`flex items-center w-full p-2 rounded-md transition-colors cursor-pointer ${
                      currentCategory === category?._id
                        ? "bg-blue-100 text-blue-700 font-medium" // ✅ Sélection bleu clair
                        : "hover:bg-pink-50 text-gray-700" // ✅ Hover rose très doux
                    }`}
                    onClick={() => handleCategoryClick(category?._id)}
                    aria-pressed={currentCategory === category?._id}
                    disabled={isSubmitting}
                  >
                    <span className="ml-2">{category?.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bouton réinitialiser mobile */}
          {hasActiveFilters && (
            <div className="md:hidden">
              <button
                onClick={resetFilters}
                className="w-full py-2 text-center text-sm text-pink-600 hover:text-pink-700 border border-pink-200 cursor-pointer rounded-md hover:bg-pink-50"
                aria-label="Réinitialiser tous les filtres"
                disabled={isSubmitting}
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Filters;

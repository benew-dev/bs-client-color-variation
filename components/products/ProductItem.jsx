import { memo, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

import CartContext from "@/context/CartContext";
import { INCREASE } from "@/helpers/constants";
import AuthContext from "@/context/AuthContext";

const ProductItem = memo(({ product }) => {
  const { addItemToCart, updateCart, cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  if (!product || typeof product !== "object") {
    return null;
  }

  const inStock = product.stock > 0;
  const productId = product._id || "";
  const productName = product.name || "Produit sans nom";
  const productDescription = product.description || "";
  const productPrice = product.price || 0;
  const productCategory = product.category?.categoryName || "Non catégorisé";

  const imageUrl = product.images?.[0]?.url || "/images/default_product.png";

  const addToCartHandler = useCallback(
    (e) => {
      e.preventDefault();

      try {
        if (!user) {
          return toast.error(
            "Connectez-vous pour ajouter des articles à votre panier !",
          );
        }

        const isProductInCart = cart.find((i) => i?.productId === productId);

        if (isProductInCart) {
          updateCart(isProductInCart, INCREASE);
        } else {
          addItemToCart({
            product: productId,
          });
        }
      } catch (error) {
        toast.error("Impossible d'ajouter au panier. Veuillez réessayer.");
        console.error("Erreur d'ajout au panier:", error);
      }
    },
    [user, cart, productId, addItemToCart, updateCart],
  );

  return (
    <article className="border border-white/40 overflow-hidden bg-white/30 backdrop-blur-md shadow-lg rounded-lg mb-5 hover:shadow-xl transition-shadow">
      <Link
        href={`/product/${productId}`}
        className="flex flex-col md:flex-row hover:bg-white/40 transition-colors"
        aria-label={`Voir les détails du produit: ${productName}`}
      >
        <div className="md:w-1/4 flex p-3">
          <div className="relative w-full aspect-square bg-white/20 backdrop-blur-sm rounded-md overflow-hidden">
            <Image
              src={imageUrl}
              alt={productName}
              title={productName}
              width={240}
              height={240}
              onError={(e) => {
                e.currentTarget.src = "/images/default_product.png";
                e.currentTarget.onerror = null;
              }}
              style={{ objectFit: "contain" }}
              priority={false}
              loading="lazy"
              sizes="(max-width: 768px) 80vw, 240px"
            />
          </div>
        </div>
        <div className="md:w-2/4">
          <div className="p-4">
            <h3
              className="font-semibold text-xl text-gray-800 line-clamp-2 mb-3"
              title={productName}
            >
              {productName}
            </h3>
            <div className="mt-4 md:text-xs lg:text-sm text-gray-700 space-y-2">
              <p className="mb-1" title={productCategory}>
                <span className="font-semibold mr-3 text-gray-600">
                  Catégorie:
                </span>
                <span className="text-lavender-600">{productCategory}</span>
              </p>
              <p className="mb-1" title="Description">
                <span className="font-semibold mr-3 text-gray-600">
                  Description:
                </span>
                <span className="line-clamp-2 text-gray-600">
                  {productDescription
                    ? productDescription.substring(0, 45) + "..."
                    : "Aucune description disponible"}
                </span>
              </p>
              <p className="mb-1 flex items-center" title="Stock">
                <span className="font-semibold mr-3 text-gray-600">Stock:</span>
                {inStock ? (
                  <span className="text-green-600 font-medium flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    En stock
                  </span>
                ) : (
                  <span className="text-pink-600 font-medium flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Rupture de stock
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="md:w-1/4 border-t lg:border-t-0 lg:border-l border-white/40 bg-gradient-card-action">
          <div className="p-5 flex flex-col justify-between h-full">
            <div>
              <span
                className="text-2xl font-bold text-blue-400 flex items-center justify-center md:justify-start mb-2"
                data-testid="Price"
              >
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "Fdj",
                }).format(productPrice)}
              </span>

              <div className="flex items-center justify-center md:justify-start mb-3">
                <svg
                  className="w-4 h-4 text-green-600 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <p
                  className="text-green-700 text-xs lg:text-sm font-medium"
                  title="Livraison gratuite"
                >
                  Livraison gratuite
                </p>
              </div>
            </div>

            <div className="flex justify-center md:justify-start">
              <button
                disabled={!inStock}
                className={`px-4 lg:px-6 py-2.5 inline-block text-sm lg:text-base font-medium text-gray-800 rounded-md transition-all shadow-sm
                      ${inStock ? "bg-gradient-btn-primary hover:bg-gradient-btn-primary-hover hover:shadow-md active:scale-95" : "bg-gray-200 cursor-not-allowed opacity-60"}`}
                onClick={(e) => inStock && addToCartHandler(e)}
                aria-label={
                  inStock ? "Ajouter au panier" : "Produit indisponible"
                }
                aria-disabled={!inStock}
              >
                {inStock ? (
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Ajouter au panier
                  </span>
                ) : (
                  "Indisponible"
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
});

ProductItem.displayName = "ProductItem";

export default ProductItem;

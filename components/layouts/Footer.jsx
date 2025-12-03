import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-lavender-200 to-pink-200 text-gray-800 py-6 mt-auto">
      {" "}
      {/* ✅ Dégradé lavande-rose */}
      <div className="container max-w-[1440px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900">Buy It Now</h3>
            <p className="text-gray-700 text-sm">
              Votre destination pour le shopping en ligne de qualité. Découvrez
              notre vaste sélection de produits à des prix compétitifs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900">
              Liens utiles
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors" // ✅ Hover bleu pastel
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/me"
                  className="text-gray-700 hover:text-blue-600 transition-colors" // ✅ Hover bleu pastel
                >
                  Mon compte
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-gray-700 hover:text-blue-600 transition-colors" // ✅ Hover bleu pastel
                >
                  Panier
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900">
              Nous contacter
            </h3>
            <address className="text-gray-700 text-sm not-italic">
              <p>Email: contact@buyitnow.com</p>
              <p>Téléphone: +33 1 23 45 67 89</p>
            </address>
          </div>
        </div>
        <div className="border-t border-lavender-300 mt-8 pt-6 text-center text-sm text-gray-600">
          {" "}
          {/* ✅ Bordure lavande */}
          <p>© {new Date().getFullYear()} Buy It Now. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

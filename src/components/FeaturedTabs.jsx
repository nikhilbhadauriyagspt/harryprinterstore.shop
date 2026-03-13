import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ArrowRight,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import API_BASE_URL from "../config";

export default function FeaturedTabs() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  useEffect(() => {
    fetch(`${API_BASE_URL}/products?limit=12&is_featured=1`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getImagePath = (images) => {
    try {
      const imgs = typeof images === "string" ? JSON.parse(images) : images;
      if (Array.isArray(imgs) && imgs.length > 0) {
        return `/${imgs[0].replace(/\\/g, '/')}`;
      }
      return "/logo/fabicon.png";
    } catch { return "/logo/fabicon.png"; }
  };

  return (
    <section className="w-full py-16 md:py--0 font-['Heebo'] bg-white">
      <div className="w-full px-4 sm:px-10 lg:px-24">

        {/* LIGHT MINIMAL HEADER */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Featured Studio Collection
          </h2>
          <div className="h-1 w-12 bg-[#4f46e5] my-4 rounded-full"></div>
          <p className="text-slate-500 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Discover our handpicked selection of high-performance hardware and genuine supplies, engineered for precision and long-lasting workspace quality.
          </p>
        </div>

        {/* ULTRA-LIGHT PRODUCT GRID - 6 PRODUCTS PER ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[3/4] bg-slate-50 animate-pulse rounded-2xl border border-slate-100"></div>)
          ) : (
            products.map((p, idx) => (
              <div key={p.id} className="group flex flex-col h-full">

                {/* Compact Image Area */}
                <div className="relative aspect-[3/4] mb-4 bg-gray-200 border border-transparent rounded-2xl overflow-hidden flex items-center justify-center p-4 transition-all duration-500 group-hover:bg-white group-hover:border-slate-100">
                  <Link to={`/product/${p.slug}`} className="w-full h-full flex items-center justify-center">
                    <img
                      src={getImagePath(p.images)}
                      alt={p.name}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { e.target.src = "/logo/fabicon.png"; }}
                    />
                  </Link>

                  {/* Minimal Wishlist */}
                  <button
                    onClick={() => toggleWishlist(p)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm border border-slate-100 flex items-center justify-center transition-all ${isInWishlist(p.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                  >
                    <Heart size={14} className={isInWishlist(p.id) ? 'fill-red-500' : ''} />
                  </button>

                  {/* Light Quick Add */}
                  <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button
                      onClick={() => addToCart(p)}
                      className="w-full py-2 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#4f46e5] transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={12} /> Quick Add
                    </button>
                  </div>
                </div>

                {/* Compact Content */}
                <div className="px-1">
                  <span className="text-[8px] font-black text-[#4f46e5] uppercase tracking-widest block mb-1">{p.brand_name || 'Premium'}</span>

                  <Link to={`/product/${p.slug}`}>
                    <h3 className="text-[13px] font-bold text-slate-800 leading-tight line-clamp-2 min-h-[32px] group-hover:text-[#4f46e5] transition-colors">
                      {p.name}
                    </h3>
                  </Link>

                  <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[15px] font-black text-slate-900">${p.price}</span>
                    <Link to={`/product/${p.slug}`} className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-[#4f46e5] transition-colors">
                      Details <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Bottom Action */}
        <div className="mt-16 flex justify-center">
          <Link to="/shop" className="px-10 py-4 border border-slate-900 text-slate-900 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
            View All Products
          </Link>
        </div>

      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { useSearchParams, Link, useParams, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import { useCart } from '../context/CartContext';
import {
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  Heart,
  X,
  Loader2,
  ChevronRight,
  Plus,
  Expand,
  CheckCircle2,
  Filter,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';

export default function Shop() {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { category: pathCategory, brand: pathBrand } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState('grid');

  const category = searchParams.get('category') || pathCategory || '';
  const brand = searchParams.get('brand') || pathBrand || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(d => {
        if (d.status === 'success') {
          const printers = d.data.find(c => c.slug === 'printers' || c.id === 46);
          setCategories(printers ? printers.children : []);
        }
      });
    fetch(`${API_BASE_URL}/brands`).then(res => res.json()).then(d => setBrands(d.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams);
    params.set('limit', '1000');

    fetch(`${API_BASE_URL}/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const filteredProducts = data.data.filter(p =>
            !p.name.toLowerCase().includes('laptop') &&
            !p.name.toLowerCase().includes('macbook')
          );
          setProducts(filteredProducts);
          setTotal(filteredProducts.length);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
    setActiveDropdown(null);
  };

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
    <div className="bg-white min-h-screen font-['Heebo'] text-slate-900">
      <SEO title="Hardware Catalog | Printer Mania" />

      {/* --- SIMPLE PAGE HEADER --- */}
      <div className="bg-slate-50 border-b border-slate-100 py-12 md:py-16">
        <div className="max-w-full mx-auto px-6 lg:px-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <nav className="flex items-center gap-2 text-[11px] font-bold text-[#4F46E5] uppercase tracking-[3px] mb-4">
              <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="text-slate-400">Shop all</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight capitalize leading-none">
              Explore catalog
            </h1>
          </div>
          <div className="flex items-center gap-3 px-5 py-2.5 bg-white text-slate-400 rounded-full border border-slate-100">
            <SlidersHorizontal size={16} className="text-[#4F46E5]" />
            <span className="text-[11px] font-black uppercase tracking-widest">{total} Products found</span>
          </div>
        </div>
      </div>

      {/* --- MINIMAL FILTER HUD --- */}
      <div className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-full mx-auto px-6 lg:px-12 py-4 flex flex-wrap items-center justify-between gap-6">

          <div className="flex items-center gap-3">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'cat' ? null : 'cat')}
                className={`px-6 py-2.5 border text-[12px] font-bold capitalize flex items-center gap-3 transition-all rounded-full ${category ? 'border-[#4F46E5] bg-gray-200/5 text-[#4F46E5]' : 'border-slate-100 bg-gray-200 hover:border-slate-200'}`}
              >
                {category ? category.replace('-', ' ') : 'Categories'}
                <ChevronDown size={14} className={activeDropdown === 'cat' ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'cat' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full left-0 mt-3 w-[280px] bg-white border border-slate-100 p-2 z-[110] rounded-2xl">
                    <button onClick={() => updateFilter('category', '')} className="w-full text-left px-4 py-3 text-[10px] font-black hover:bg-slate-50 uppercase tracking-widest text-slate-400 border-b border-slate-50 mb-1">Clear Selection</button>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {categories.map(c => (
                        <button key={c.id} onClick={() => updateFilter('category', c.slug)} className={`w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 hover:text-[#4F46E5] transition-colors rounded-lg ${category === c.slug ? 'bg-gray-200/5 text-[#4F46E5]' : 'text-slate-600'}`}>
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Brand Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'brand' ? null : 'brand')}
                className={`px-6 py-2.5 border text-[12px] font-bold capitalize flex items-center gap-3 transition-all rounded-full ${brand ? 'border-[#4F46E5] bg-gray-200/5 text-[#4F46E5]' : 'border-slate-100 bg-gray-200 hover:border-slate-200'}`}
              >
                {brand || 'Manufacturers'}
                <ChevronDown size={14} className={activeDropdown === 'brand' ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'brand' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full left-0 mt-3 w-[240px] bg-white border border-slate-100 p-2 z-[110] rounded-2xl">
                    <button onClick={() => updateFilter('brand', '')} className="w-full text-left px-4 py-3 text-[10px] font-black hover:bg-slate-50 uppercase tracking-widest text-slate-400 border-b border-slate-50 mb-1">All Brands</button>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {brands.map(b => (
                        <button key={b.id} onClick={() => updateFilter('brand', b.name)} className={`w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 hover:text-[#4F46E5] transition-colors rounded-lg ${brand === b.name ? 'bg-gray-200/5 text-[#4F46E5]' : 'text-slate-600'}`}>
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Search catalog */}
          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4F46E5]" size={16} />
            <input
              type="text" value={search} onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search items..."
              className="w-full pl-12 pr-6 py-2.5 bg-gray-200 border border-slate-100 rounded-full text-[13px] font-bold outline-none focus:bg-white focus:border-[#4F46E5] transition-all placeholder:font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-950 text-white' : 'text-slate-400 hover:bg-gray-200'}`}><LayoutGrid size={18} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-950 text-white' : 'text-slate-400 hover:bg-gray-200'}`}><List size={18} /></button>
            </div>

            <div className="relative">
              <select
                value={sort} onChange={(e) => updateFilter('sort', e.target.value)}
                className="appearance-none bg-gray-200 border border-slate-100 rounded-full pl-6 pr-12 py-2.5 text-[12px] font-bold capitalize outline-none cursor-pointer hover:border-slate-200 transition-colors"
              >
                <option value="newest">Sort: Latest</option>
                <option value="price_low">Price: Low-High</option>
                <option value="price_high">Price: High-Low</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CATALOG CONTENT --- */}
      <div className="max-w-full mx-auto px-6 lg:px-12 py-12">

        {loading ? (
          <div className="py-48 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#4F46E5] mb-6" />
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300">Synchronizing products</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-40 text-center border border-slate-100 bg-gray-200 rounded-[3rem]">
            <Search size={48} className="mx-auto text-slate-200 mb-8" />
            <h3 className="text-2xl font-bold text-slate-900 mb-4 capitalize tracking-tight">No products found</h3>
            <p className="text-slate-500 mb-10">Try adjusting your filters or search keywords.</p>
            <button onClick={() => navigate('/shop')} className="px-10 py-4 bg-slate-950 text-white font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-all rounded-full active:scale-95">Reset Catalog</button>
          </div>
        ) : (
          <div className={`grid gap-6 md:gap-8 ${viewMode === 'grid'
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
            : 'grid-cols-1'
            }`}>
            {products.map((p) => (
              <div
                key={p.id}
                className={`group relative flex flex-col h-full transition-all duration-500 ${viewMode === 'list' ? 'sm:flex-row gap-10 items-center p-8 bg-gray-200 border border-slate-100 rounded-[2.5rem]' : ''
                  }`}
              >
                {/* Product Card Design */}
                <div className={`${viewMode === 'grid' ? 'w-full flex flex-col h-full' : 'w-full sm:w-72 shrink-0'}`}>
                  <div className="relative mb-4 rounded-2xl bg-gray-200 border border-slate-100 overflow-hidden flex items-center justify-center aspect-square p-6 transition-all group-hover:bg-white group-hover:border-[#4F46E5]/20">
                    <Link to={`/product/${p.slug}`} className="w-full h-full flex items-center justify-center">
                      <img
                        src={getImagePath(p.images)}
                        alt={p.name}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = "/logo/fabicon.png"; }}
                      />
                    </Link>

                    {/* Hover Wishlist */}
                    <button
                      onClick={() => toggleWishlist(p)}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${isInWishlist(p.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                    >
                      <Heart size={16} className={isInWishlist(p.id) ? 'fill-red-500' : ''} />
                    </button>
                  </div>

                  {viewMode === 'grid' && (
                    <div className="flex flex-col flex-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{p.brand_name || 'Premium'}</span>
                      <Link to={`/product/${p.slug}`}>
                        <h3 className="text-[13px] font-bold text-slate-800 leading-snug line-clamp-2 mb-3 group-hover:text-[#4F46E5] transition-colors">
                          {p.name}
                        </h3>
                      </Link>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-base font-black text-slate-900 tracking-tighter">${Number(p.price).toFixed(2)}</span>
                        <button
                          onClick={() => addToCart(p)}
                          className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center hover:bg-gray-200 transition-all active:scale-90"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {viewMode === 'list' && (
                  <div className="flex flex-col flex-1 min-w-0 py-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-black text-[#4F46E5] uppercase tracking-[3px]">{p.brand_name || 'Premium Hardware'}</span>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1"><CheckCircle2 size={12} /> Item In Stock</span>
                    </div>
                    <Link to={`/product/${p.slug}`}>
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-[#4F46E5] transition-colors mb-6 capitalize leading-tight">{p.name}</h3>
                    </Link>
                    <p className="text-slate-500 text-lg mb-10 line-clamp-2 leading-relaxed font-medium">Experience professional-grade printing with this genuine hardware solution. Optimized for speed, clarity, and enterprise performance standards.</p>

                    <div className="mt-auto flex items-center justify-between pt-8 border-t border-slate-200">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Market Price</p>
                        <p className="text-3xl font-black text-slate-950 tracking-tighter">${Number(p.price).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => addToCart(p)} className="px-10 py-4 bg-slate-950 text-white font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-all rounded-full active:scale-95">Add To Cart</button>
                        <Link to={`/product/${p.slug}`} className="group flex items-center gap-2 px-8 py-4 text-slate-950 font-bold hover:text-[#4F46E5] transition-all">Details <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Footer Spacing --- */}
      <div className="py-20 border-t border-slate-100">
        <div className="max-w-full px-6 flex justify-center">
          <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em]">End of catalog</p>
        </div>
      </div>

    </div>
  );
}

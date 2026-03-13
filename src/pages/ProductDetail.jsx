import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { useCart } from '../context/CartContext';
import {
  Heart,
  ChevronRight,
  Truck,
  ShieldCheck,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle2,
  ArrowRight,
  Zap,
  ArrowLeft,
  Info,
  Package,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';

export default function ProductDetail() {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('specs');

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`${API_BASE_URL}/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setProduct(data.data);

          const categories = data.data.categories || [];
          const categorySlug = categories.length > 0 ? categories[0].slug : '';
          const brand = data.data.brand_name;

          let fetchUrl = `${API_BASE_URL}/products?limit=6`;
          if (categorySlug) fetchUrl += `&category=${categorySlug}`;
          else if (brand) fetchUrl += `&brand=${brand}`;

          fetch(fetchUrl)
            .then(res => res.json())
            .then(relData => {
              if (relData.status === 'success') {
                setRelatedProducts(relData.data.filter(p => p.id !== data.data.id));
              }
            });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const getImages = (images) => {
    try {
      const imgs = typeof images === "string" ? JSON.parse(images) : images;
      return Array.isArray(imgs) ? imgs.map(img => `/${img.replace(/\\/g, '/')}`) : [];
    } catch (e) { return []; }
  };

  const getImagePath = (images) => {
    try {
      const imgs = typeof images === "string" ? JSON.parse(images) : images;
      if (Array.isArray(imgs) && imgs.length > 0) return `/${imgs[0].replace(/\\/g, '/')}`;
    } catch (e) { }
    return "/logo/fabicon.png";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white font-['Heebo']">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-slate-100 border-t-[#4F46E5] rounded-full mb-6"
        />
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loading catalog...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-white font-['Heebo']">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 rounded-[2rem]">
          <Info size={32} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Product not found</h2>
        <p className="text-slate-500 mb-10 max-w-md mx-auto text-sm font-medium">The requested hardware could not be located in our inventory.</p>
        <Link to="/shop" className="px-10 py-4 bg-slate-950 text-white font-bold text-[11px] uppercase tracking-widest transition-all rounded-2xl hover:bg-[#4F46E5]">Return To Catalog</Link>
      </div>
    );
  }

  const images = getImages(product.images);
  const mainImage = images.length > 0 ? images[activeImage] : "/logo/fabicon.png";

  return (
    <div className="bg-white min-h-screen font-['Heebo'] text-slate-900 pb-20">
      <SEO title={product.name} description={product.description?.substring(0, 160)} />

      {/* --- BREADCRUMBS --- */}
      <div className="bg-slate-50 border-b border-slate-100 py-6">
        <div className="max-w-full mx-auto px-6 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-[3px]">
            <Link to="/" className="hover:text-[#4F46E5] transition-colors">Home</Link>
            <ChevronRight size={14} className="text-slate-300" />
            <Link to="/shop" className="hover:text-[#4F46E5] transition-colors">Catalog</Link>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-slate-900 truncate max-w-[200px]">{product.name}</span>
          </nav>

          <Link to="/shop" className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-slate-950 transition-all uppercase tracking-widest">
            <ArrowLeft size={16} /> Back To Shop
          </Link>
        </div>
      </div>

      <div className="max-w-full mx-auto px-6 lg:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">

          {/* Left Stage: Visual Gallery */}
          <div className="lg:col-span-6">
            <div className="sticky top-32 space-y-8">
              <div
                className="aspect-square bg-slate-50 border border-slate-100 rounded-[3rem] flex items-center justify-center p-12 overflow-hidden relative group"
              >
                <img
                  src={mainImage} alt={product.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-1000 mix-blend-multiply"
                  onError={(e) => { e.target.src = "/logo/fabicon.png"; }}
                />

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-8 right-8 h-12 w-12 flex items-center justify-center transition-all bg-white rounded-2xl border border-slate-100 hover:border-red-500/30 ${isInWishlist(product.id) ? 'text-red-500' : 'text-slate-300 hover:text-red-500'}`}
                >
                  <Heart size={22} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                </button>

                <div className="absolute bottom-8 left-8">
                  <div className="px-5 py-2 bg-white text-slate-900 text-[10px] font-black uppercase tracking-[3px] flex items-center gap-2 rounded-full border border-slate-100">
                    <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse"></div> Ready To Ship
                  </div>
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx} onClick={() => setActiveImage(idx)}
                      className={`h-24 w-24 border-2 rounded-2xl flex-shrink-0 flex items-center justify-center p-4 transition-all bg-white overflow-hidden ${activeImage === idx ? 'border-[#4F46E5]' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <img src={img} alt="" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Stage: Info & Actions */}
          <div className="lg:col-span-6">
            <div className="space-y-10">

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-[#4F46E5] uppercase tracking-[3px]">
                    {product.brand_name || 'Premium'}
                  </span>
                  <div className="h-4 w-px bg-slate-200"></div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Genuine Hardware</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-slate-950 leading-tight tracking-tight capitalize">
                  {product.name}
                </h1>

                <div className="flex items-end gap-8 pt-4">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[2px]">Market price</p>
                    <p className="text-5xl font-black text-slate-950 tracking-tighter">${Number(product.price).toFixed(2)}</p>
                  </div>
                  {product.sale_price && (
                    <div className="pb-1 text-slate-400">
                      <span className="text-xl font-bold line-through">${product.sale_price}</span>
                      <p className="text-[10px] font-black text-red-500 mt-1 uppercase tracking-widest">Promotion</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <p className="text-slate-500 text-lg font-medium leading-relaxed">
                    {product.description || "High-performance printing solution designed for professional environments. Experience reliable output, advanced features, and efficient performance for your daily business needs."}
                  </p>
                </div>
              </div>

              {/* Purchase Controls */}
              <div className="space-y-8 pt-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-10 w-full sm:w-auto">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-400 hover:text-[#4F46E5] transition-all active:scale-125">
                      <Minus size={20} strokeWidth={3} />
                    </button>
                    <span className="text-xl font-black text-slate-950 min-w-[24px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-slate-400 hover:text-[#4F46E5] transition-all active:scale-125">
                      <Plus size={20} strokeWidth={3} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart} disabled={isAdded}
                    className={`flex-1 h-16 flex items-center justify-center gap-4 font-bold text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-70 rounded-full ${isAdded ? 'bg-emerald-500 text-white' : 'bg-slate-950 text-white hover:bg-[#4F46E5]'}`}
                  >
                    {isAdded ? <><CheckCircle2 size={22} /> System Added</> : <><ShoppingCart size={20} /> Add To Cart</>}
                  </button>
                </div>

                {/* Service Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center gap-5 transition-all hover:bg-white hover:border-[#4F46E5]/20">
                    <div className="h-12 w-12 bg-white rounded-2xl text-[#4F46E5] flex items-center justify-center border border-slate-50">
                      <Truck size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 capitalize">Fast delivery</p>
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Safe Logistics</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center gap-5 transition-all hover:bg-white hover:border-[#4F46E5]/20">
                    <div className="h-12 w-12 bg-white rounded-2xl text-[#4F46E5] flex items-center justify-center border border-slate-50">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 capitalize">Full warranty</p>
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Brand Protected</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs Tabs */}
              <div className="pt-12 border-t border-slate-100">
                <div className="flex gap-10 mb-10 border-b border-slate-100">
                  {[
                    { id: 'specs', label: 'Hardware Specs' },
                    { id: 'support', label: 'Help & Support' }
                  ].map(tab => (
                    <button
                      key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`pb-5 text-[12px] font-bold uppercase tracking-widest relative transition-colors ${activeTab === tab.id ? 'text-[#4F46E5]' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                      {tab.label}
                      {activeTab === tab.id && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#4F46E5] rounded-t-full" />}
                    </button>
                  ))}
                </div>

                <div className="min-h-[150px]">
                  {activeTab === 'specs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-16">
                      {[
                        { label: "Manufacturer", value: product.brand_name || "Certified Partner" },
                        { label: "Product Class", value: "Enterprise Hardware" },
                        { label: "Deployment", value: "Smart Connectivity" },
                        { label: "Condition", value: "100% Genuine New" }
                      ].map((spec, i) => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{spec.label}</span>
                          <span className="text-[13px] font-black text-slate-900 capitalize">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'support' && (
                    <div className="bg-slate-950 p-10 rounded-[2.5rem] text-white relative overflow-hidden">
                      <h4 className="text-xl font-black mb-4 capitalize">Need technical assistance?</h4>
                      <p className="text-slate-400 text-base font-medium mb-8 leading-relaxed">Our specialists are available to provide configuration support and hardware guidance for your new system.</p>
                      <Link to="/contact" className="inline-flex items-center gap-4 bg-[#4F46E5] text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#059669] transition-all active:scale-95">
                        Contact Support Center <ArrowRight size={16} />
                      </Link>
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#4F46E5] opacity-5 blur-[80px] rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Related Products --- */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-24 border-t border-slate-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-[2px] bg-[#4F46E5]"></span>
                  <span className="text-[#4F46E5] text-[11px] font-black uppercase tracking-[3px]">Recommended</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight capitalize">Complementary hardware</h2>
              </div>
              <Link to="/shop" className="group flex items-center gap-4 text-slate-950 font-black text-xs uppercase tracking-widest border-b-2 border-slate-100 pb-2 hover:border-[#4F46E5] transition-all">
                Full catalog <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {relatedProducts.map((p) => (
                <Link
                  to={`/product/${p.slug}`}
                  key={p.id}
                  className="group flex flex-col transition-all duration-500"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <div className="aspect-square bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center p-6 mb-6 overflow-hidden relative group-hover:bg-white group-hover:border-[#4F46E5]/20 transition-all">
                    <img src={getImagePath(p.images)} alt="" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" onError={(e) => { e.target.src = "/logo/fabicon.png"; }} />
                  </div>
                  <div className="flex flex-col px-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{p.brand_name || 'Premium'}</span>
                    <h4 className="text-[14px] font-bold text-slate-800 group-hover:text-[#4F46E5] transition-colors leading-snug line-clamp-2 mb-3">{p.name}</h4>
                    <p className="text-[16px] font-black text-slate-950 mt-auto tracking-tighter">${Number(p.price).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

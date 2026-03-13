import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import API_BASE_URL from '../config';
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  LayoutGrid,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { cartCount, wishlistCount, openCartDrawer } = useCart();
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSearchCatOpen, setIsSearchCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const searchCatRef = useRef(null);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);

    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          const printerParent = data.data.find(
            (cat) => cat.slug === 'printers' || cat.id === 46
          );
          if (printerParent && printerParent.children) {
            setCategories(printerParent.children);
          }
        }
      })
      .catch((err) => console.error(err));

    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    checkUser();
    window.addEventListener('storage', checkUser);

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (searchCatRef.current && !searchCatRef.current.contains(event.target)) {
        setIsSearchCatOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkUser);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.length > 1) {
        setIsLoading(true);
        fetch(`${API_BASE_URL}/products?search=${encodeURIComponent(searchValue)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 'success') {
              setSearchResults(data.data);
            } else {
              setSearchResults([]);
            }
            setIsLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setSearchResults([]);
            setIsLoading(false);
          });
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  const handleSearchTrigger = (term) => {
    const searchParam = term || searchValue;
    if (searchParam.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchParam.trim())}`);
      setIsSearchFocused(false);
      setSearchValue(searchParam);
    }
  };

  const getImagePath = (product) => {
    let imagePath = '/logo/fabicon.png';
    try {
      const images = JSON.parse(product.images);
      if (images && images.length > 0) {
        imagePath = `/${images[0].replace(/\\/g, '/')}`;
      }
    } catch (e) { }
    return imagePath;
  };

  return (
    <header className={`w-full z-[1000] font-['Heebo'] ${isHomePage && !scrolled ? 'absolute top-0 left-0' : 'relative'}`}>

      {/* TOP STRIP - SOLID BACKGROUND */}
      <div className="hidden lg:block border-b border-white/5 bg-[#4f46e5] text-white relative z-[1001]">
        <div className="max-w-full mx-auto px-4 sm:px-8 xl:px-24 h-[42px] flex items-center justify-between">

          {/* REFINED EMAIL STYLING */}
          <div className="flex items-center group cursor-pointer">
            <div className="flex items-center gap-2.5 px-3 py-1 bg-white/10 border border-white/10 rounded-full group-hover:border-[#4f46e5] transition-all duration-300">
              <Mail size={13} className="text-white" />
              <span className="text-[12px] font-bold text-white/90 tracking-tight group-hover:text-white transition-colors">info@printermania.shop</span>
            </div>
          </div>

          {/* NAVIGATION LINKS */}
          <div className="flex items-center">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[13px] font-bold tracking-tight px-5 py-1 transition-all duration-300 relative group ${location.pathname === link.path ? 'text-black' : 'text-white/70 hover:text-red-600'
                  }`}
              >
                {link.name}
                {index !== navLinks.length - 1 && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-px bg-white/20" />
                )}
                <span className={`absolute bottom-0 left-5 right-5 h-[1.5px] bg-[#4f46e5] transition-all duration-300 ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN HEADER - OVERLAY ON HOME PAGE */}
      <div
        className={`w-full transition-all duration-500 ${scrolled
          ? 'fixed top-0 left-0 bg-white border-b border-[#f0f0f0] z-[1500]'
          : isHomePage
            ? 'bg-transparent border-white/10'
            : 'bg-white  border-[#f0f0f0]'
          }`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-8 xl:px-24 py-4 md:py-4">
          <div className="flex items-center justify-between gap-6 xl:gap-16">

            {/* MOBILE MENU BUTTON */}
            <button
              className={`lg:hidden w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${!scrolled && isHomePage ? 'border-white/20 text-white' : 'border-[#e0e0e0] text-[#222]'
                }`}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>

            {/* LOGO */}
            <Link to="/" className="shrink-0">
              <img
                src="/logo/logo.png"
                alt="Printer Mania"
                className="h-8 md:h-10 xl:h-12 object-contain transition-all duration-300"
              />
            </Link>

            {/* CATEGORY + SEARCH AREA */}
            <div
              ref={searchRef}
              className="hidden lg:flex flex-1 items-center max-w-[950px]"
            >
              <div className="flex items-center w-full">
                {/* CATEGORY SELECTOR */}
                <div
                  className="relative shrink-0 mr-4"
                  ref={searchCatRef}
                  onMouseEnter={() => setIsCategoryOpen(true)}
                  onMouseLeave={() => {
                    setIsCategoryOpen(false);
                    setIsSearchCatOpen(false);
                  }}
                >
                  <button
                    onClick={() => setIsSearchCatOpen((prev) => !prev)}
                    className="h-[46px] px-6 rounded-full bg-[#4f46e5] text-white flex items-center gap-2.5 text-[14px] font-bold hover:bg-black transition-colors"
                  >
                    <LayoutGrid size={16} />
                    <span>Categories</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isSearchCatOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {(isCategoryOpen || isSearchCatOpen) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-[calc(100%+12px)] left-0 w-[260px] bg-white border border-[#e8e8e8] rounded-2xl py-2 z-[2000] shadow-xl"
                      >
                        <div className="max-h-[380px] overflow-y-auto custom-scrollbar py-1">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/shop?category=${cat.slug}`}
                              onClick={() => {
                                setIsCategoryOpen(false);
                                setIsSearchCatOpen(false);
                              }}
                              className="flex items-center justify-between px-6 py-2.5 text-[14px] font-bold text-[#444] hover:text-[#4f46e5] hover:bg-[#f8f8ff] transition-all capitalize group"
                            >
                              <span>{cat.name}</span>
                              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#4f46e5]" />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* PREMIUM SEARCH BAR */}
                <div
                  className={`relative flex-1 h-[48px] rounded-full border transition-all duration-300 ${isSearchFocused
                    ? 'border-[#4f46e5] bg-white ring-4 ring-[#4f46e5]/10'
                    : !scrolled && isHomePage
                      ? 'border-white/20 bg-[#f9f9f9]'
                      : 'border-[#e0e0e0] bg-[#f9f9f9]'
                    }`}
                >
                  <input
                    type="text"
                    placeholder="Find genuine printers & accessories..."
                    className={`w-full h-full bg-transparent pl-7 pr-16 text-[14px] outline-none font-medium ${!scrolled && isHomePage && !isSearchFocused ? 'text-[#999] placeholder:text-[#999]' : 'text-[#222] placeholder:text-[#999]'
                      }`}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchTrigger()}
                  />

                  <button
                    onClick={() => handleSearchTrigger()}
                    className={`absolute right-[5px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all ${!scrolled && isHomePage && !isSearchFocused ? 'bg-[#4f46e5] text-white' : 'bg-[#4f46e5] text-white'
                      } hover:scale-105 active:scale-95`}
                  >
                    <Search size={20} strokeWidth={2.5} />
                  </button>

                  {/* RESULTS DROPDOWN */}
                  <AnimatePresence>
                    {isSearchFocused && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="absolute top-[calc(100%+14px)] left-0 w-full bg-white border border-[#e8e8e8] rounded-3xl overflow-hidden z-[2000] shadow-2xl"
                      >
                        <div className="p-6">
                          {searchValue.length > 1 ? (
                            <>
                              <h4 className="text-[11px] font-black text-[#aaa] mb-4 uppercase tracking-widest">
                                Best Matches
                              </h4>

                              {isLoading ? (
                                <div className="space-y-3">
                                  {[1, 2, 3].map((i) => (
                                    <div
                                      key={i}
                                      className="h-[68px] rounded-2xl bg-[#f5f5f5] animate-pulse"
                                    />
                                  ))}
                                </div>
                              ) : searchResults.length > 0 ? (
                                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                                  {searchResults.map((product) => (
                                    <Link
                                      key={product.id}
                                      to={`/product/${product.slug}`}
                                      onClick={() => setIsSearchFocused(false)}
                                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#f8f8ff] transition-all group border border-transparent hover:border-[#4f46e5]/10"
                                    >
                                      <div className="w-14 h-14 rounded-xl border border-[#efefef] bg-white flex items-center justify-center overflow-hidden shrink-0">
                                        <img
                                          src={getImagePath(product)}
                                          alt={product.name}
                                          className="w-full h-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-110"
                                          onError={(e) => {
                                            e.target.src = '/logo/fabicon.png';
                                          }}
                                        />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-[14px] font-bold text-[#222] truncate group-hover:text-[#4f46e5] transition-colors">
                                          {product.name}
                                        </p>
                                        <p className="text-[15px] font-black text-[#4f46e5] mt-0.5">
                                          ${product.price}
                                        </p>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[14px] text-[#777] py-10 text-center font-medium">
                                  No matches for "{searchValue}"
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              <h4 className="text-[11px] font-black text-[#aaa] mb-4 uppercase tracking-widest">
                                Popular Searches
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {['EcoTank', 'LaserJet Pro', 'Ink Cartridges', 'Scanners', 'Brother Printers'].map((tag) => (
                                  <button
                                    key={tag}
                                    onClick={() => handleSearchTrigger(tag)}
                                    className="px-5 py-2.5 rounded-full border border-[#e0e0e0] text-[13px] font-bold text-[#555] hover:border-[#4f46e5] hover:text-[#4f46e5] hover:bg-[#4f46e5]/5 transition-all"
                                  >
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ACTION ICONS */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              <Link
                to="/shop"
                className={`hidden md:flex h-[46px] px-8 rounded-full border-2 items-center justify-center text-[13px] font-black uppercase tracking-[0.1em] transition-all duration-300 hover:bg-[#4f46e5] hover:text-white ${!scrolled && isHomePage ? 'border-[#4f46e5] text-white' : 'border-[#4f46e5] text-[#4f46e5]'
                  }`}
              >
                Shop Now
              </Link>

              <Link
                to={user ? '/profile' : '/login'}
                className={`w-[44px] h-[44px] rounded-full border flex items-center justify-center transition-all ${!scrolled && isHomePage ? 'border-white/20 bg-white/10 text-white' : 'border-[#e0e0e0] bg-[#fafafa] text-[#222]'
                  } hover:border-[#4f46e5] hover:text-[#4f46e5]`}
              >
                <User size={20} strokeWidth={2} />
              </Link>

              <Link
                to="/wishlist"
                className={`relative w-[44px] h-[44px] rounded-full border flex items-center justify-center transition-all ${!scrolled && isHomePage ? 'border-white/20 bg-white/10 text-white' : 'border-[#e0e0e0] bg-[#fafafa] text-[#222]'
                  } hover:border-[#4f46e5] hover:text-[#4f46e5]`}
              >
                <Heart size={20} strokeWidth={2} />
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-[#4f46e5] text-white text-[11px] font-black flex items-center justify-center border-2 border-white shadow-sm">
                  {wishlistCount}
                </span>
              </Link>

              <button
                onClick={openCartDrawer}
                className={`relative w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all ${!scrolled && isHomePage ? 'bg-[#4f46e5] text-white' : 'bg-[#4f46e5] text-white'
                  } hover:scale-105 active:scale-95`}
              >
                <ShoppingCart size={20} strokeWidth={2} />
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-[#4f46e5] text-white text-[11px] font-black flex items-center justify-center border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          {/* MOBILE SEARCH BAR */}
          <div className="lg:hidden mt-5">
            <div className={`flex-1 h-[48px] rounded-full border flex items-center px-5 transition-all ${!scrolled && isHomePage ? 'border-white/20 bg-white/10' : 'border-[#e0e0e0] bg-[#f9f9f9]'
              }`}>
              <Search size={20} className={!scrolled && isHomePage ? 'text-white/60' : 'text-[#888]'} />
              <input
                type="text"
                placeholder="Search products..."
                className={`w-full bg-transparent outline-none px-3 text-[14px] font-bold ${!scrolled && isHomePage ? 'text-white placeholder:text-white/60' : 'text-[#222]'
                  }`}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchTrigger()}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[2000]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[2100] flex flex-col"
            >
              <div className="p-6 border-b border-[#efefef] flex items-center justify-between">
                <img src="/logo/logo.png" alt="Logo" className="h-8 object-contain" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-full border border-[#e0e0e0] flex items-center justify-center text-[#444]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-8">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-[#aaa] mb-4">Navigation</h3>
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-3.5 text-[15px] font-bold text-[#222] border-b border-[#f9f9f9] last:border-0"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-[#aaa] mb-4">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-3 text-[14px] font-bold text-[#555] capitalize"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#efefef] bg-[#fafafa]">
                <Link
                  to={user ? '/profile' : '/login'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-[14px] font-bold text-[#222]"
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-[#e0e0e0] flex items-center justify-center">
                    <User size={16} />
                  </div>
                  {user ? user.name.split(' ')[0] : 'Sign In / Register'}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e0e0e0;
          border-radius: 20px;
        }
      `}</style>
    </header>
  );
}

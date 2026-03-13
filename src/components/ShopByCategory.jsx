import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const softColors = [
  { bg: "bg-emerald-50/60", border: "border-emerald-100", text: "text-emerald-600", points: ["High-speed output", "Precision ink", "Eco-mode"] },
  { bg: "bg-blue-50/60", border: "border-blue-100", text: "text-blue-600", points: ["Cloud connect", "Auto-duplex", "Mobile print"] },
  { bg: "bg-orange-50/60", border: "border-orange-100", text: "text-orange-600", points: ["Vivid color", "Pro-res", "Dry inks"] },
  { bg: "bg-purple-50/60", border: "border-purple-100", text: "text-purple-600", points: ["Heavy-duty", "Security", "Low maint"] },
  { bg: "bg-pink-50/60", border: "border-pink-100", text: "text-pink-600", points: ["Compact", "Quiet ops", "Affordable"] },
  { bg: "bg-indigo-50/60", border: "border-indigo-100", text: "text-indigo-600", points: ["High-yield", "Touch UI", "Auto-refill"] },
  { bg: "bg-sky-50/60", border: "border-sky-100", text: "text-sky-600", points: ["Diagnostics", "Instant-on", "Ethernet"] },
  { bg: "bg-amber-50/60", border: "border-amber-100", text: "text-amber-600", points: ["Industrial", "Thermal stable", "Long-life"] }
];

export default function ShopByCategory({ categories = [] }) {
  const printerParent = categories.find(
    (c) => c.slug === "printers" || c.id === 46
  );
  const displayCategories = printerParent?.children || [];

  const getImagePath = (image) => {
    if (!image) return "/logo/fabicon.png";
    const processedImage = image.replace(/\.jpg$/, '.png');
    return processedImage.startsWith("/") ? processedImage : `/${processedImage}`;
  };

  if (!displayCategories.length) return null;

  return (
    <section className="w-full bg-[#fcfdfe] py-16 md:py-24 font-['Heebo']">
      <div className="w-full px-6 lg:px-24">

        {/* CENTERED COMPACT HEADER */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-slate-300"></div>
            <span className="text-[10px] font-black text-[#4f46e5] uppercase tracking-[0.4em]">Premium Hardware</span>
            <div className="h-px w-8 bg-slate-300"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-0">
            Shop by <span className="italic font-light text-[#4f46e5]">Category</span>
          </h2>


        </div>

        {/* FULL WIDTH COMPACT SLIDER - 5 CARDS */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation]}
            navigation={{
              nextEl: ".shop-cat-next",
              prevEl: ".shop-cat-prev",
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={displayCategories.length > 5}
            spaceBetween={20}
            slidesPerView={1.1}
            breakpoints={{
              640: { slidesPerView: 2.2, spaceBetween: 15 },
              1024: { slidesPerView: 3.2, spaceBetween: 20 },
              1280: { slidesPerView: 4.2, spaceBetween: 20 },
              1600: { slidesPerView: 5, spaceBetween: 20 },
            }}
            className="category-swiper !px-2"
          >
            {displayCategories.map((cat, index) => {
              const colorSet = softColors[index % softColors.length];
              return (
                <SwiperSlide key={cat.id} className="h-auto">
                  <Link
                    to={`/shop?category=${cat.slug}`}
                    className="group block h-full"
                  >
                    <div className={`flex  items-stretch p-1 rounded-xl border ${colorSet.border} ${colorSet.bg} transition-all duration-500  h-full `}>

                      {/* TOP: IMAGE AREA */}
                      <div className="w-30 h-30  flex items-center justify-center p-4 mb-0 transition-all duration-700 ">
                        <img
                          src={getImagePath(cat.image)}
                          alt={cat.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                          onError={(e) => {
                            e.currentTarget.src = "/logo/fabicon.png";
                          }}
                        />
                      </div>

                      {/* BOTTOM: CONTENT AREA */}
                      <div className="flex-1 flex flex-col min-w-0 py-2">
                        <h3 className="text-[15px] font-black text-slate-900 capitalize mb-2 truncate group-hover:text-[#4f46e5] transition-colors leading-tight">
                          {cat.name}
                        </h3>

                        {/* 5 POINTS COMPACT */}
                        <div className="flex flex-col gap-2 mb-0">
                          {colorSet.points.map((point, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Check size={10} className={`${colorSet.text} shrink-0`} strokeWidth={4} />
                              <span className="text-[11px] font-bold text-slate-500 truncate">{point}</span>
                            </div>
                          ))}
                        </div>


                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="flex items-center justify-center gap-3">
            <button className="shop-cat-prev w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-[#4f46e5] hover:text-white transition-all cursor-pointer">
              <ArrowLeft size={18} />
            </button>
            <button className="shop-cat-next w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-[#4f46e5] hover:text-white transition-all cursor-pointer">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .category-swiper {
          padding: 10px 0 40px 0 !important;
        }
      `}</style>
    </section>
  );
}

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function PromoSection() {
  return (
    <section className="w-full relative min-h-[500px] flex items-center overflow-hidden font-['Heebo']">

      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/banner/promo-top-right.jpg"
          alt="Premium Office Setup"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-full mx-auto px-6 lg:px-12 lg:py-20 relative z-10 w-full">
        <div className="max-w-2xl text-white">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-10 h-[2px] bg-[#4F46E5]"></span>
            <span className="text-[12px] font-black text-[#4F46E5] uppercase tracking-[3px]">Enterprise solutions</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-4 capitalize leading-[1.3]">
            Advanced printing for modern businesses
          </h2>

          <p className="text-slate-300 text-lg md:text-xl font-medium mb-10 leading-relaxed">
            Optimizing your document workflow with state-of-the-art multi-functional devices. Designed for speed, security, and exceptional clarity in every print.
          </p>



          <Link to="/contact" className="group inline-flex items-center gap-4 py-3 px-10 bg-[#4F46E5] text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#059669] transition-all shadow-2xl shadow-[#4F46E5]/20">
            Get professional consultation <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

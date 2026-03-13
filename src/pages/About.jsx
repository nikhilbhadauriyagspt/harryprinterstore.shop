import React from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { ShieldCheck, Zap, Globe, Printer, Package, ChevronRight, CheckCircle2, ArrowRight, Headphones, Leaf, Wrench, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-white min-h-screen font-['Heebo'] text-slate-900 pb-20">
      <SEO
        title="About Us | Our Mission"
        description="Learn about our commitment to hardware excellence, our journey, and the core pillars that drive our specialized services."
      />

      {/* --- SIMPLE PAGE HEADER --- */}
      <div className="w-full px-6 lg:px-12 py-12 md:py-20 border-b border-slate-100">
        <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          <Link to="/" className="hover:text-[#4F46E5] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-900">About Us</span>
        </nav>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight capitalize">
          Hardware Excellence
        </h1>
        <p className="mt-4 text-slate-500 text-lg md:text-xl font-medium max-w-2xl">
          A new generation partner bridging the gap between complex technology and a seamless experience.
        </p>
      </div>

      <div className="max-w-full mx-auto px-6 lg:px-12 mt-20 space-y-24">

        {/* --- THE VISION SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#4F46E5]"></span>
              <span className="text-[11px] font-black text-[#4F46E5] uppercase tracking-[3px]">The Vision</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">Built on trust and precision</h2>
          </div>
          <div className="space-y-6">
            <p className="text-slate-600 text-lg leading-relaxed">
              Founded in 2026, Printer Mania was established to solve a singular challenge: making the acquisition of high-performance printing infrastructure simple, transparent, and absolutely authentic.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              As a new generation partner, we bridge the gap between complex industrial technology and a seamless, personalized experience. Technology should work as hard as you do.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-2 text-[#4F46E5] font-bold hover:underline">
              Browse our catalog <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* --- CORE CAPABILITIES (LIGHT GRID) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 border-y border-slate-100">
          {[
            { icon: Printer, title: "Top Quality Products", desc: "Expert selection of LaserJet, All-in-One, and high-volume industrial systems tailored for your business needs." },
            { icon: Package, title: "Supply chain excellence", desc: "Source for 100% genuine ink, toner, and certified replacement parts with rapid nationwide delivery." },
            { icon: Headphones, title: "Quick assistance", desc: "Factory-trained technicians providing troubleshooting, installation guidance, and long-term hardware maintenance." }
          ].map((item, i) => (
            <div key={i} className="space-y-6">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-[#4F46E5]">
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 capitalize">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed text-base">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* --- MISSION & COMMUNITY --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Target className="text-[#4F46E5]" size={20} />
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Our mission</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 capitalize">The customer standard</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              To empower professionals with reliable, efficient, and sustainable hardware solutions through original products and certified advice. We believe in technology that works as hard as you do.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Users className="text-[#4F46E5]" size={20} />
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Our community</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 capitalize">Nationwide reach</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              Expanding across the United States to deliver professional HP technology with unmatched logistics and long-term service value. Our network ensures you are never without technical support.
            </p>
          </div>
        </div>

        {/* --- ADVANTAGE LIST (SIMPLE) --- */}
        <div className="bg-slate-50 rounded-[2rem] p-8 md:p-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">The Printer Mania Advantage</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: "Verified status", icon: ShieldCheck },
              { title: "Genuine supplies", icon: Package },
              { title: "Hardware service", icon: Zap },
              { title: "Safe logistics", icon: Globe },
              { title: "Original hardware", icon: CheckCircle2 },
              { title: "Quick Assistance", icon: Headphones },
              { title: "Sustainable tech", icon: Leaf },
              { title: "Professional hub", icon: Wrench }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4 group">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-slate-400 border border-slate-100 group-hover:text-[#4F46E5] group-hover:border-[#4F46E5] transition-all">
                  <item.icon size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-700 capitalize">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
